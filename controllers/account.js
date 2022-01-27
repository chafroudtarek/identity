import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Token from "../models/token.js";
import crypto from "crypto";

import { sendEmail } from "../utils/sendEmail.js";
import { mylogger } from "../utils/winstonn.js";

export const getLoggenInUser = async (req, res, next) => {
  const { id } = res.locals.loggedInUser;

  try {
    const user = await User.findOne({ _id: id });
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
  let { firstname, lastname, email, password, role, birthday, phone } =
    req.body;
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
        user: _user,
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
      data: { email: user.email, role: user.role },
      accessToken,
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

// Reset Password

export const sendresetemail = async (req, res) => {
  try {
    if (!req.body.email) {
      mylogger.error(
        `res.status = "400"  - MISSING_FIELD - ${req.originalUrl} - ${req.method} - ${req.ip}`
      );
      res.status(400).send({ message: req.t("ERROR.AUTH.MISSING_FIELD") });
      return;
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(400).send("user with given email doesn't exist");

    let token = await Token.findOne({ userId: user._id });
    if (!token) {
      token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
    }
    const link = `${process.env.BASE_URL}/resetpass/${user._id}/${token.token}`;
    await sendEmail(user.email, "Password reset", link);

    res.send("password reset link sent to your email account");
  } catch (error) {
    res.send("An error occured");
    console.log(error);
  }
};

export const resetpassword = async (req, res) => {
  try {
    if (!req.body.password) {
      mylogger.error(
        `res.status = "400"  - MISSING_FIELD - ${req.originalUrl} - ${req.method} - ${req.ip}`
      );
      res.status(400).send({ message: req.t("ERROR.AUTH.MISSING_FIELD") });
      return;
    }

    const user = await User.findById(req.params.userId);
    if (!user) return res.status(400).send("invalid link or expired");

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send("Invalid link or expired");

    user.password = req.body.password;
    await user.save();
    await token.delete();

    res.send("password reset sucessfully.");
  } catch (error) {
    res.send("An error occured");
    console.log(error);
  }
};
