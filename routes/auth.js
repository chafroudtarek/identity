import { Router } from "express";
import {
  getLoggenInUser,
  login,
  register,
  sendresetemail,
  resetpassword,
} from "../controllers/account.js";

const router = Router();

router.post("/login", login);

router.post("/register", register);

router.get("/", getLoggenInUser);

router.post("/resetpass", sendresetemail);
router.post("/resetpass/:userId/:token", resetpassword);
export default router;
