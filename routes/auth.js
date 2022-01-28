import { Router } from "express";
import {
  getLoggenInUser,
  login,
  register,
  sendresetemail,
  resetpassword,
  changepass,
} from "../controllers/account.js";
import { allowLoggedin } from "../middlewares/auth.js";

const router = Router();

//@POST method
// @desc login a user
//@path : http://localhost::2022/api/auth/
//Params body

router.post("/login", login);

//@POST method
// @desc register a user
//@path : http://localhost::2022/api/auth/
//Params body

router.post("/register", register);

//@POST method
// @desc change password
//@path : http://localhost::2022/api/auth/
//Params body

router.post("/changepassword", allowLoggedin, changepass);

//@POST method
// @desc post get loggen in user
//@path : http://localhost::2022/api/auth/
//Params body

router.get("/", getLoggenInUser);

//@POST method
// @desc reset password
//@path : http://localhost::2022/api/auth/
//Params body
router.post("/resetpass", sendresetemail);
router.post("/resetpass/:userId/:token", resetpassword);
export default router;
