import bcryptjs from "bcryptjs";
import User from "../models/User.js";
import Verification from "../models/Verfication.js";
import { sendEmail } from "../utils/sendEmail.js";
import { mylogger } from "../utils/winstonn.js";
import { v4 as uuidv4 } from "uuid";

export const forgetpassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      const forgetpassword = await Verification.findOne({ email: user.email });

      if (forgetpassword) {
        forgetpassword.verificationCode = uuidv4();
        forgetpassword.used = false;
        const result = await forgetpassword.save();
        if (result) {
          const result2 = await sendEmail(
            user.email,
            forgetpassword.verificationCode
          );
          result2 == true
            ? res
                .status(200)
                .send({ message: "SEND EMAIL FAILED", success: true })
            : res.send({ message: req.t("SUCCESS.EMAIL_SENT") });
        }
      } else {
        const verification = new Verification({
          userId: user._id,
          email: user.email,
          verificationCode: uuidv4(),
          title: "Forget Password",
          type: "Email Verification",
        });

        verification.markModified(
          "userId",
          "email",
          "verificationCode",
          "title",
          "type"
        );
        const result = await verification.save();
        if (result) {
          const result2 = await sendEmail(
            user.email,
            verification.verificationCode
          );
          result2 == true
            ? res
                .status(200)
                .send({ message: "SEND EMAIL FAILED", success: true })
            : res.send({ message: req.t("SUCCESS.EMAIL_SENT") });
        } else {
          res.send({ error: "verifiation doenst found" });
          console.log("verification eroooor");
        }
      }
    } else {
      res.status(404).send({ message: req.t("ERROR.NOTFOUND_USERBYEMAIL") });
    }
  } catch (error) {
    console.log(error);
    res.status(404).send({ message: error, succes: false });
  }
};

export const forgetpasswordverify = async (req, res) => {
  try {
    const forgetpassword = await Verification.findOne({
      email: req.params.email,
    });
    console.log("***********", forgetpassword.verificationCode);
    if (
      forgetpassword.used == false &&
      req.body.verificationCode == forgetpassword.verificationCode
    ) {
      forgetpassword.firstUsed = true;
      forgetpassword.used = true;
      forgetpassword.markModified("firstUsed", "used");
      await forgetpassword.save();
      res.send({
        email: forgetpassword.email,
        message: "now reset your password.",
        succes: true,
      });
    } else {
      res.send({ error: req.t("ERROR.USED"), succes: false });
    }
  } catch (e) {
    console.log("$$$$$$$$$$$$$$$$$$$$", e);
    res.send({ error: "CHECK YOUR CODE AGAIN", succes: false });
  }
};

export const resetpasswordv1 = async (req, res) => {
  let { newpassword } = req.body;
  try {
    const forgetpassword = await Verification.findOne({
      email: req.params.email,
    });
    forgetpassword.lastUsed = true;
    forgetpassword.link = `http://localhost:2022/api/auth/resetpassword/${req.params.id}`;
    forgetpassword.used = false;
    forgetpassword.markModified("lastUsed", "firstUsed", "link", "used");
    await forgetpassword.save();

    const user = await User.findOne({ email: forgetpassword.email });
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
  } catch (e) {
    console.log(e);
    res.send({ error: e, succes: false });
  }
};
