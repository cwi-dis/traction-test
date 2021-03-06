import { Router } from "express";
import * as Busboy from "busboy";
import { v4 as uuid4 } from "uuid";
import * as tmp from "tmp-promise";
import * as fs from "fs";

import {
  getDatabase, hashPassword, requireAuth, isLoggedIn, uploadToS3, encodeDash,
  confirmSubscription, getFileExtension, insertVideoMetadata, updateFailureState, hasAudio
} from "../util";

const { CLOUDFRONT_URL, SNS_ARN } = process.env;
const router = Router();

router.get("/", (req, res, next) => {
  res.render("index", { title: "TRACTION" });
});

router.get("/videos", requireAuth, async (req, res) => {
  const db = await getDatabase(req);
  const videos = await db.collection("videos").find().sort("_id", -1).toArray();

  res.send(videos.map((v) => {
    const mainThumbnail = v?.thumbnails?.[0];

    return {
      ...v,
      mainThumbnail: (mainThumbnail) ? `${CLOUDFRONT_URL!}/transcoded/${mainThumbnail}` : undefined
    }
  }));
});

router.get("/video/:id", requireAuth, async (req, res) => {
  const { id } = req.params;

  const db = await getDatabase(req);
  const video = await db.collection("videos").findOne({ name: id });

  if (video) {
    res.send({
      name: id,
      manifest: `${CLOUDFRONT_URL!}/transcoded/${id.split(".")[0]}.mpd`
    });
  } else {
    res.status(404);
    res.send({
      status: "ERR",
      message: "Video not found"
    });
  }

});

router.post("/upload", requireAuth, async (req, res) => {
  const busboy = new Busboy({ headers: req.headers });
  const db = await getDatabase(req);

  busboy.on("file", async (fieldname, file, filename, encoding, mimetype) => {
    console.log("Receiving file:", fieldname, filename, encoding, mimetype);

    const extension = getFileExtension(filename);
    const newName = uuid4() + extension;

    const { fd, path, cleanup } = await tmp.file();

    const writeStream = fs.createWriteStream("", { fd, emitClose: true }).on("close", async () => {
      try {
        console.log("Temp file written");
        const tmpReadStream = fs.createReadStream(path);

        await uploadToS3(newName, tmpReadStream);
        console.log("File saved as", newName)

        const jobId = await encodeDash(
          newName,
          await hasAudio(path)
        );

        if (jobId) {
          await db.collection("videos").insertOne({
            jobId, name: newName, status: "processing"
          });
        } else {
          await db.collection("videos").insertOne({
            jobId, name: newName, status: "error"
          });
        }

        res.send({
          status: "OK"
        });
      } catch {
        res.send({
          status: "ERR",
          message: "Could not upload to S3"
        });
      }

      cleanup();
    });

    file.pipe(writeStream);
  });

  req.pipe(busboy);
});

router.post("/register", async (req, res) => {
  const db = await getDatabase(req);
  const { username, password, confirmation } = req.body;

  if (password === confirmation) {
    const users = db.collection("users");
    const userExists = await users.findOne({ username });

    if (!userExists) {
      const hash = hashPassword(password);

      await users.insertOne({
        username, hash
      });

      res.send({ status: "OK" });
    } else {
      res.status(400);
      res.send({
        status: "ERR",
        message: "Username exists"
      });
    }
  } else {
    res.status(400);
    res.send({
      status: "ERR",
      message: "Password does not match confirmation"
    });
  }
});

router.post("/login", async (req, res) => {
  const db = await getDatabase(req);
  const { username, password } = req.body;

  const users = db.collection("users");
  const loginSuccessful = await users.findOne({
    username,
    hash: hashPassword(password)
  });

  if (loginSuccessful) {
    req.session!.loggedIn = true;
    res.send({ status: "OK" });
  } else {
    res.status(401);
    res.send({
      status: "ERR",
      message: "Authorisation failed"
    });
  }
});

router.get("/loginstatus", (req, res) => {
  res.send({
    status: req.session?.loggedIn || false
  });
});

router.post("/logout", (req, res) => {
  if (!isLoggedIn(req)) {
    res.status(400);
    res.send({
      status: "ERR",
      message: "Not logged in"
    });
  } else {
    req.session!.destroy(() => {
      res.send({ status: "OK" });
    });
  }
});

router.post("/sns", async (req, res) => {
  if (req.headers['x-amz-sns-message-type'] === 'SubscriptionConfirmation') {
    confirmSubscription(req.headers as any, req.body);
  } else {
    const topic = req.headers["x-amz-sns-topic-arn"];

    if (topic && topic === SNS_ARN!) {
      const data = JSON.parse(req.body.Message);
      const db = await getDatabase(req);

      console.log("Received transcoder notification");
      console.log(data);

      if (data.state === "COMPLETED") {
        console.log("Inserting video metadata:", await insertVideoMetadata(db, data));
      } else {
        console.error("Updating error state:", await updateFailureState(db, data));
      }
    }
  }

  res.send("");
});

export default router;
