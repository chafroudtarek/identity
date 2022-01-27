import { Router } from "express";
import {
  postUser,
  updateUser,
  deleteOneUser,
  getOneUser,
  getUser,
} from "../controllers/user.controllers.js";
import { authRole } from "../middlewares/accessrole.js";
import { allowLoggedin } from "../middlewares/auth.js";

const router = Router();

//@POST method
// @desc post a user
//@path : http://localhost::2022/api/users/
//Params body

router.post("/", allowLoggedin, postUser);

//@Get method
// @desc Get all user
//@path : http://localhost::2022/api/users
//Params body

router.get("/", allowLoggedin, authRole(["ADMIN"]), getUser);

//@Get method
// @desc Get one user
//@path : http://localhost:2022/api/users:id
//Params body

router.get(
  "/:id",
  allowLoggedin,
  authRole(["ADMIN", "STUDENT", "EMPLOYER"]),
  getOneUser
);

//@Delete method
// @desc delete one user by id
//@path : http://localhost:2022/api/users:id
//Params id
router.delete("/:id", allowLoggedin, authRole(["ADMIN"]), deleteOneUser);

//@put method
// @desc update one User by id
//@path : http://localhost:2022/api/users:id
//Params id

router.put(
  "/:id",
  allowLoggedin,
  authRole(["ADMIN", "STUDENT", "EMPLOYER"]),
  updateUser
);

export default router;
