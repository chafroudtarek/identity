import { Router } from "express";
import {
  postUser,
  updateUser,
  deleteOneUser,
  getOneUser,
  getUser,
  activateUser,
  getAllInstructor,
  getAllHr,
  getAllDisabledHr,
  getAllDisabledInstructor,
  restore,
  getDisableStudent,
  getUsersExceptType,
  getAllEmployees,

} from "../controllers/user.controllers.js";
import { role } from "../constants.js";
import permit from "../middlewares/auth.js";




const router = Router();


//get restore one  user
router.get(
  "/disablestudent",


  getDisableStudent
);
//get restore one  user
router.put(
  "/restore/:id",


  restore
);

//get all hr user
router.get(
  "/allhr",


  getAllHr
);
//get all Disabled hr user
router.get(
  "/alldisabledhr",


  getAllDisabledHr
);

// get all instructor user
router.get(
  "/allinstructor",


  getAllInstructor
);
// get all Disabled instructor user
router.get(
  "/alldisabledinstructor",


  getAllDisabledInstructor
);

// get all Employees

router.get(
  "/allEmployees",
  getAllEmployees
)

//@POST method
// @desc post a user
//@path : http://localhost::2022/api/users/
//Params body

router.post("/",/*permit(role.ADMIN),*/ postUser);

//@Get method
// @desc Get all user
//@path : http://localhost::2022/api/users
//Params body

router.get("/",/* permit(role.ADMIN),*/getUser);

router.get("/exceptType", getUsersExceptType)
//@Get method
// @desc Get one user
//@path : http://localhost:2022/api/users:id
//Params body

router.get(
  "/:id",

  /*permit(role.ADMIN),*/
  getOneUser
);




//@Delete method
// @desc delete one user by id
//@path : http://localhost:2022/api/users:id
//Params id
router.delete("/:id", /*permit(role.ADMIN),*/ deleteOneUser);

//@put method
// @desc update one User by id
//@path : http://localhost:2022/api/users:id
//Params id

router.put(
  "/:id",


  /*permit(role.ADMIN,role.INSTRUCTOR, role.STUDENT),*/
  updateUser
);

//@put method
// @desc activate one User by id
//@path : http://localhost:2022/api/v1/users:id
//Params id
router.delete(
  "/activate/:id",


  /*permit(role.ADMIN,role.INSTRUCTOR, role.STUDENT),*/
  activateUser
);

export default router;
