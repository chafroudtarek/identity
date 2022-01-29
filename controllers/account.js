import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Token from "../models/token.js";



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
  let { firstname, lastname, email, password, role } = req.body;
  if (!firstname || !lastname || !password || !email || !role) {
    mylogger.error(
      `res.status = "400"  - INVALID_INFORMATION - ${req.originalUrl} - ${req.method} - ${req.ip}`
    );
    return res.status(400).json({
      message: req.t("ERROR.AUTH.INVALID_INFORMATION"),
      success: false,
    });
  }
  try {
    const user = await User.findOne({ email });
    if (user) {
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

      const _user = new User({
        _id: new mongoose.Types.ObjectId(),
        firstname,
        lastname,
        email,
        role,
        password: hash,
      });
      const accessToken = jwt.sign(
        { userId: _user._id },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );
      _user.accessToken = accessToken;
      await _user.save();
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

export const login = async (req, res, next) => {
  let { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
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
    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    await User.findByIdAndUpdate(user._id, { accessToken });
    res.status(200).json({
      message: req.t("SUCCESS.LOGGED"),
      accessToken: accessToken,
      success: true,
    });
  } catch (error) {
    mylogger.error(
      `res.status = "500"  - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
    );
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
