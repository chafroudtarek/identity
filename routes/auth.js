import { Router } from "express";
import {
  getLoggenInUser,
  login,
  register,
  changepass,
  logout
} from "../controllers/account.js";

import {
  forgetpassword,
  forgetpasswordverify,
  resetpasswordv1,
} from "../controllers/resetpassword.js";
import permit from "../middlewares/auth.js";
import {role}  from"../constants.js";



const router = Router();

//@POST method
// @desc login a user
//@path : http://localhost::2022/api/auth/
//Params body

router.post("/login/:email",login);

//@POST method
// @desc register a user
//@path : http://localhost::2022/api/auth/
//Params body

router.post("/register", register);

//@POST method
// @desc change password
//@path : http://localhost::2022/api/auth/
//Params body

router.post("/changepassword",  permit(role.ADMIN,role.INSTRUCTOR, role.STUDENT), changepass);

//@POST method
// @desc post get loggen in user
//@path : http://localhost::2022/api/auth/
//Params body

router.get("/", getLoggenInUser);

//@POST method
// @desc forget password
//@path : http://localhost::2022/api/auth/
//Params body
router.post("/forgetpassword/", forgetpassword);

//@POST method
// @desc verfication du code
//@path : http://localhost::2022/api/auth/
//Params body

router.post("/forgetpass-verify/:id", forgetpasswordverify);

//@POST method
// @desc reset password
//@path : http://localhost::2022/api/auth/
//Params body
router.post("/resetpassword/:id", resetpasswordv1);


router.post('/logout',permit(role.STUDENT,role.INSTRUCTOR,role.ADMIN),logout);

export default router;
