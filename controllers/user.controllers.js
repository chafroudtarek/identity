import User from "../models/User.js";
import { mylogger } from "../utils/winstonn.js";

export const postUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    if (
      !req.body.email ||
      !req.body.firstname ||
      !req.body.lastname ||
      !req.body.password
    ) {
      mylogger.error(
        `res.status = "400"  - MISSING_FIELD - ${req.originalUrl} - ${req.method} - ${req.ip}`
      );
      res.status(400).send({ message: req.t("ERROR.AUTH.MISSING_FIELD") });
      return;
    }
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      res.status(400).send({ message: req.t("ERROR.AUTH.USER_EXISTS") });
      mylogger.error(
        `res.status = "400"  - USER ALREADY EXISTS - user id:${req.body.id}- ${req.originalUrl} - ${req.method} - ${req.ip}`
      );
      return;
    }

    const response = await newUser.save();
    res.send({ response: response, message: req.t("SUCCESS.SAVED") });
    mylogger.error(
      `res.status = "200"  -SUCCESS.SAVED - user id:${req.body.id} - ${req.originalUrl} - ${req.method} - ${req.ip}`
    );
  } catch (error) {
    mylogger.error(
      `res.status = "500"  - SAVED_FAILED - ${req.method} - ${req.ip}- ${req.originalUrl}`
    );
    res.status(500).send({ message: req.t("ERROR.NOT_SAVED") });
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
    if (req.user.role !== "ADMIN") {
      const result = await User.findOne({ _id: req.params.id }).select({
        firstname: 1,
        lastname: 1,                                            
        email: 1,
      });
      res.send({
        response: result,
        message: req.t("SUCCESS.FOUND_USER"),
      });
    } else {
      const result = await User.findOne({ _id: req.params.id });
      res.send({ response: result, message: req.t("SUCCESS.FOUND_USER") });
      mylogger.error(
        `res.status = "200"  - SUCCESS.FOUND_USER - user id:${req.body.id} - ${req.originalUrl} - ${req.method} - ${req.ip}`
      );
    }
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
    await user.save();
    res.send({ message: req.t("SUCCESS.DELETED") });
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
  if (req.user.role !== "ADMIN") {
    const { id } = res.locals.loggedInUser;
    User.findOneAndUpdate(
      id,
      {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        profession: req.body.profession,
        civility: req.body.civility,
        language: req.body.language,
      },
      { new: true }
    )
      .then((user) => res.json(user))
      .catch((err) => res.status(404).json(err));
  } else {
    User.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then((user) => res.json(user))
      .catch((err) => res.status(404).json(err));
  }
};

// get user lang
export const getUserLang = (req, res, next) => {
  var lang = req.acceptsLanguages("fr", "es", "en");
  if (lang) req.lang = lang;
  next();
};
