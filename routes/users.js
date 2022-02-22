import { Router } from "express";
import {
  postUser,
  updateUser,
  deleteOneUser,
  getOneUser,
  getUser,
} from "../controllers/user.controllers.js";
import {role}  from"../constants.js";
import permit from "../middlewares/auth.js";




const router = Router();

//@POST method
// @desc post a user
//@path : http://localhost::2022/api/users/
//Params body

router.post("/",permit(role.ADMIN), postUser);

//@Get method
// @desc Get all user
//@path : http://localhost::2022/api/users
//Params body

router.get("/", permit(role.ADMIN), getUser);

//@Get method
// @desc Get one user
//@path : http://localhost:2022/api/users:id
//Params body

router.get(
  "/:id",
  
  permit(role.ADMIN),
  getOneUser
);

//@Delete method
// @desc delete one user by id
//@path : http://localhost:2022/api/users:id
//Params id
router.delete("/:id", permit(role.ADMIN), deleteOneUser);

//@put method
// @desc update one User by id
//@path : http://localhost:2022/api/users:id
//Params id

router.put(
  "/:id",
  
 
  permit(role.ADMIN,role.INSTRUCTOR, role.STUDENT),
  updateUser
);

export default router;
