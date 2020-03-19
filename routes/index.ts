import { Router } from "express";
const router = Router();

router.get("/", (req, res, next) => {
  res.render("index", { title: "TRACTION" });
});

router.get("/register", (req, res) => {
  const { username, password, confirm } = req.body;
});

router.get("/login", (req, res) => {
  const { username, password } = req.body;
});

export default router;
