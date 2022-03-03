import { run } from "../utils/kafka.js";
import User from "../models/User.js";
import bcryptjs from "bcryptjs";

import { mylogger } from "../utils/winstonn.js";

export const postUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    
    if (
      !req.body.email ||
      !req.body.firstname ||
      !req.body.lastname ||
      !req.body.password||
      !req.body.username
    ) {
    

      mylogger.error(
        `res.status = "400"  - MISSING_FIELD - ${req.originalUrl} - ${req.method} - ${req.ip}`
      );


      res.status(400).send({ message: req.t("ERROR.AUTH.MISSING_FIELD") });
      return;
    }
  //  mylogger.info(newUser);
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      res.status(400).send({ message: req.t("ERROR.AUTH.USER_EXISTS") });
      mylogger.error(
        `res.status = "400"  - USER ALREADY EXISTS - user id:${req.body.id}- ${req.originalUrl} - ${req.method} - ${req.ip}`
      );
      return;
    }
    

    
    await newUser.save();

     //hash password
     bcryptjs.hash(req.body.password, 10, async (hashError, hash) => {
      if (hashError) {
        mylogger.error(
          `res.status = "500"  - ${hashError.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
        );
        return res.status(500).json({
          message: hashError.message,
          error: hashError,
        });
      }

      newUser.password = hash;
      newUser.markModified("password");
      const response = newUser.save();
      res.send({ response: response, message: req.t("SUCCESS.SAVED") });
    });
    
   

   // kafka producer
    //run( response._id);


    mylogger.info(
      `res.status = "200"  -SUCCESS.SAVED - user id:${req.body.id} - ${req.originalUrl} - ${req.method} - ${req.ip}`
    );
  } catch (error) {
    mylogger.error(
      `res.status = "500"  - SAVED_FAILED - ${req.method} - ${req.ip}- ${req.originalUrl}`
    );
    res.status(500).send({ message: /* req.t("ERROR.NOT_SAVED")*/error });
  }
};

//Get User
export const getUser = async (req, res) => {
  try {
    const result = await User.find();
    res.send({ response: result, message: req.t("SUCCESS.FOUND_USER") });
    mylogger.error(
      `res.status = "200"  - SUCCESS.FOUND_USER - user id:${req.body.id} - ${req.method} - ${req.ip}- ${req.originalUrl}`
    );
  } catch (error) {
    res.status(400).send({ message: req.t("ERROR.NOT_fOUND") });
    mylogger.error(
      `res.status = "400"  - NOT_FOUND - user id:${req.body.id} - ${req.originalUrl} - ${req.method} - ${req.ip}`
    );
  }
};

// get One User

export const getOneUser = async (req, res) => {
  try {
    // if (req.user.role !== "ADMIN") {
    //   const result = await User.findOne({ _id: req.params.id }).select({
    //     firstname: 1,
    //     lastname: 1,
    //     email: 1,
    //   });
    //   res.send({
    //     response: result,
    //     message: req.t("SUCCESS.FOUND_USER"),
    //   });
  /*  } else {*/
      const result = await User.findOne({ _id: req.params.id });
      res.send({ response: result, message: req.t("SUCCESS.FOUND_USER") });
      console.log(result)
      mylogger.error(
        `res.status = "200"  - SUCCESS.FOUND_USER - user id:${req.body.id} - ${req.originalUrl} - ${req.method} - ${req.ip}`
      );
   /* }*/
  } catch (error) {
    res.status(400).send({ message: req.t("ERROR.NOT_fOUND") });
    mylogger.error(
      `res.status = "400"  - NOT_FOUND - ${req.originalUrl} - ${req.method} - ${req.ip}`
    );
  }
};

//deleteOneUser
export const deleteOneUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    user.enabled = false;
    const response = await user.save();
    res.send({ message: req.t("SUCCESS.DELETED") });
    
    // kafka producer
    //run( response);

    mylogger.error(
      `res.status = "200"  - SUCCESS.DELETED - user id:${req.body.id} - ${req.originalUrl} - ${req.method} - ${req.ip}`
    );
  } catch (error) {
    res.send({ message: req.t("ERROR.NOT_FOUND") });
    mylogger.error(
      `res.status = "400"  - NOT_FOUND - ${req.originalUrl} - ${req.method} - ${req.ip}`
    );
  }
};

// update User
export const updateUser = async (req, res) => {
  // if (req.user.type !== "EADMIN") {
  //   const { id } = res.locals.loggedInUser;
  //   const response = await User.findOneAndUpdate(
  //     id,
  //     {
  //       firstname: req.body.firstname,
  //       lastname: req.body.lastname,
  //       profession: req.body.profession,
  //       civility: req.body.civility,
  //       language: req.body.language,
  //     },
  //     { new: true }
  //   )
  //   if(response){
  //     res.send({ message: req.t("SUCCESS.EDITED") });

  //     // kafka producer
  //     run(response);
  //   }else{
  //     res.send({message:req.t("ERROR.DEFAULT")})
  //   }
    
      
  // } else {
    const response = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if(response){
      res.send({ message: req.t("SUCCESS.EDITED") });

      // kafka producer
      run(response);
    }else{
      res.send({message:req.t("ERROR.DEFAULT")})
    }
      
 /* }*/
};

// get user lang
export const getUserLang = (req, res, next) => {
  var lang = req.acceptsLanguages("fr", "es", "en");
  if (lang) req.lang = lang;
  next();
};

export const activateUser =async (req,res)=>{

  try {
    console.log(req.params.id)
    const user = await User.findOne({ _id: req.params.id });
    console.log(req.params.id)
    user.enabled = true;
    await user.save();
    res.send({ message: req.t("SUCCESS.DELETED") });
    
    // kafka producer
    //run( response);

    mylogger.error(
      `res.status = "200"  - SUCCESS.DELETED - user id:${req.body.id} - ${req.originalUrl} - ${req.method} - ${req.ip}`
    );
  } catch (error) {
    res.send({ message: req.t("ERROR.NOT_FOUND") });
    mylogger.error(
      `res.status = "400"  - NOT_FOUND - ${req.originalUrl} - ${req.method} - ${req.ip}`
    );
  }
}