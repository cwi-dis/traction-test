import { Router } from "express";
import * as Busboy from "busboy";
import * as aws from "aws-sdk";
import { getDatabase, hashPassword, requireAuth, isLoggedIn } from "../util";

const router = Router();

router.get("/", (req, res, next) => {
  res.render("index", { title: "TRACTION" });
});

router.post("/upload", requireAuth, (req, res) => {
  const busboy = new Busboy({ headers: req.headers });
  const s3 = new aws.S3();

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    console.log("Receiving file:", fieldname, filename, encoding, mimetype);

    s3.upload({
      Bucket: "troeggla-traction-test", Key: filename, Body: file
    }, {
      partSize: 5 * 1024 * 1024, queueSize: 10
    }, (err, data) => {
      if (err) {
        console.error("ERROR:", err);

        res.send({
          status: "ERR",
          message: "Could not upload to S3"
        });
      } else {
        console.log(data);

        res.send({
          status: "OK"
        });
      }
    });
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

export default router;
