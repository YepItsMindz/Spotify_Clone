import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  req.auth.userId
  res.send("Hello from user route");
  
});

export default router;