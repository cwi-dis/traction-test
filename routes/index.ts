import { Router } from "express";
import { getDatabase, hashPassword } from "../util";

const router = Router();

router.get("/", (req, res, next) => {
  res.render("index", { title: "TRACTION" });
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

router.get("/login", (req, res) => {
  const { username, password } = req.body;
});

export default router;
