import * as fs from "fs";
import { Router } from "express";
import * as Busboy from "busboy";
import { getDatabase, hashPassword, requireAuth } from "../util";

const router = Router();

router.get("/", (req, res, next) => {
  res.render("index", { title: "TRACTION" });
});

router.post("/upload", requireAuth, (req, res) => {
  const busboy = new Busboy({ headers: req.headers });

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    console.log("Receiving file:", fieldname, filename, encoding, mimetype);
    file.pipe(fs.createWriteStream("/dev/null"));
  });

  busboy.on("finish", () => {
    console.log("File upload complete");

    res.send({
      status: "OK"
    });
  });

  return req.pipe(busboy);
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
  req.session!.destroy(() => {
    res.send({ status: "OK" });
  });
});

export default router;
