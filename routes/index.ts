import { Router } from "express";
import * as Busboy from "busboy";
import { v4 as uuid4 } from "uuid";

import {
  getDatabase, hashPassword, requireAuth, isLoggedIn, uploadToS3, encodeDash,
  confirmSubscription, getFileExtension, insertVideoMetadata
} from "../util";

const { SNS_ARN } = process.env;
const router = Router();

router.get("/", (req, res, next) => {
  res.render("index", { title: "TRACTION" });
});

router.post("/upload", requireAuth, (req, res) => {
  const busboy = new Busboy({ headers: req.headers });

  busboy.on("file", async (fieldname, file, filename, encoding, mimetype) => {
    console.log("Receiving file:", fieldname, filename, encoding, mimetype);

    const extension = getFileExtension(filename);
    const newName = uuid4() + extension;

    try {
      await uploadToS3(newName, file);
      console.log("File saved as", newName)
      encodeDash(newName);

      res.send({
        status: "OK"
      });
    } catch {
      res.send({
        status: "ERR",
        message: "Could not upload to S3"
      });
    }
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
    console.log("SNS notification:", req.headers, req.body);
    const topic = req.headers["x-amz-sns-topic-arn"];

    if (topic && topic === SNS_ARN!) {
      console.log("Received transcoder notification");
      const data = JSON.parse(req.body.Message);

      if (data["state"] == "COMPLETED") {
        const db = await getDatabase(req);
        console.log("Inserting video metadata:", insertVideoMetadata(db, data));
      } else {
        console.error("Transcoder error:", data);
      }
    }
  }
});

export default router;
