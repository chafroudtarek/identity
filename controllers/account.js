import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { run } from "../utils/kafka.js";

import { mylogger } from "../utils/winstonn.js";

export const getLoggenInUser = async (req, res, next) => {
  const { _id } = res.locals.loggedInUser;

  try {
    const user = await User.findOne({ _id: _id });
    if (!user) {
      mylogger.error(
        `res.status = "400"  - UNAUTHORIZED - ${req.originalUrl} - ${req.method} - ${req.ip}`
      );
      return res.status(400).json({
        message: req.t("ERROR.UNAUTHORIZED"),
      });
    }
    return res.status(200).json({
      user,
    });
  } catch (error) {
    mylogger.error(
      `res.status = "500"  - ${error.message} -  ${req.originalUrl} - ${req.method} - ${req.ip}`
    );
    return res.status(500).json({
      message: error.message,
      error,
    });
  }
};

export const register = async (req, res, next) => {
  let { username,type, email, password } = req.body;
  if (!username || !type|| !password || !email ) {
    mylogger.error(
      `res.status = "400"  - INVALID_INFORMATION - ${req.originalUrl} - ${req.method} - ${req.ip}`
    );
    return res.status(400).json({
      message: req.t("ERROR.AUTH.INVALID_INFORMATION"),
      success: false,
    });
  }
  try {
    const _user = await User.findOne({ email });
    if (_user) {
      mylogger.error(
        `res.status = "401"  - USER_EXISTS -${req.body.id} ${req.originalUrl} - ${req.method} - ${req.ip}`
      );
      return res.status(401).json({
        message: req.t("ERROR.AUTH.USER_EXISTS"),
        success: false,
      });
    }

    bcryptjs.hash(password, 10, async (hashError, hash) => {
      if (hashError) {
        mylogger.error(
          `res.status = "500"  - ${hashError.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
        );
        return res.status(500).json({
          message: hashError.message,
          error: hashError,
        });
      }

      const user = new User({
        _id: new mongoose.Types.ObjectId(),
        username,
        type,
        email,
        password: hash,
      });
      
      const accessToken = jwt.sign(
        {user} ,
        process.env.JWT_SECRET,
        { expiresIn: process.env.expiresIn }
      );
      user.accessToken = accessToken;
      const response = await user.save();

       // kafka producer
       run(response);
      
      return res.status(201).json({
        
        message: req.t("SUCCESS.ADDED"),
        accessToken: accessToken,
        success: true,
      });
    
      
    });
    
  } catch (error) {
    mylogger.error(
      `res.status = "500"  - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
    );
    return res.status(500).json({
      message: error.message,
      error,
    });
  }
};

export const login = async (req, res) => {
  let { password } = req.body;
  try {
    const user = await User.findOne({ email: req.params.email});
    if (!user) {
      mylogger.error(
        `res.status = "400"  - INVALID_CREDNTIALS - ${req.originalUrl} - ${req.method} - ${req.ip}`
      );
      return res.status(400).json({
        message: req.t("ERROR.AUTH.INVALID_CREDNTIALS"),
        success: false,
      });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      mylogger.error(
        `res.status = "400"  - INVALID_CREDNTIALS - ${req.originalUrl} - ${req.method} - ${req.ip}`
      );
      return res.status(400).json({
        message: req.t("ERROR.AUTH.INVALID_CREDNTIALS"),
        success: false,
      });
    }

    const { accessToken, ...newUser } = user._doc;
    
    
    const newaccessToken = jwt.sign({ newUser}, process.env.JWT_SECRET, 
     { expiresIn: process.env.expiresIn,}
    );
   

    user.accessToken = newaccessToken;
    user.markModified("accessToken");
    user.save();
   
   

    res.status(200).json({
      message: req.t("SUCCESS.LOGGED"),
      accessToken: newaccessToken,
      success: true,
    });
    
  } catch (error) {
    
    mylogger.error(
      `res.status = "500"  - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
    );
    mylogger.info(error.message);
    return res.status(500).json({
      message: error.message,
      error: error,
    });
  }
};

//Change user password
export const changepass = async (req, res) => {
  let { oldpassword, newpassword } = req.body;
  const { email } = res.locals.loggedInUser;
  try {
    const user = await User.findOne({ email: email });
    if (!user)
      return res
        .status(400)
        .send({ message: req.t("ERROR.NOTFOUND_USERBYEMAIL") });

    const isMatch = await bcryptjs.compare(oldpassword, user.password);
    if (!isMatch) {
      mylogger.error(
        `res.status = "400"  - WRONG_OLD_PASSWORD - ${req.originalUrl} - ${req.method} - ${req.ip}`
      );
      return res.status(400).json({
        message: req.t("ERROR.AUTH.WRONG_OLD_PASSWORD"),
        success: false,
      });
    }
    bcryptjs.hash(newpassword, 10, async (hashError, hash) => {
      if (hashError) {
        mylogger.error(
          `res.status = "500"  - ${hashError.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
        );
        return res.status(500).json({
          message: hashError.message,
          error: hashError,
        });
      }

      user.password = hash;
      user.markModified("password");
      user.save();
      res.send({ message: req.t("SUCCESS.CHANGE_PASSWORD"), success: true });
    });
  } catch (error) {
    res.send({ message: error });
    mylogger.error(
      `res.status = "400"  - ERROR RESET PASSWORD -${req.params.userId}- ${req.originalUrl} - ${req.method} - ${req.ip}`
    );
  }
};


// recently added
export const logout = async (req, res) => {
  const { id } = res.locals.loggedInUser;
  User.findOneAndUpdate( id,
      { accessToken: '' },
      { new: true })
      .then((user) => res.json(user))
      .catch((err) => res.status(404).json(err));
}