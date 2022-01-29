import mongoose from "mongoose";

const Schema = mongoose.Schema;

const VerificationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    email: String,
    firstUsed: {
      type: Boolean,
      default: false,
    },
    lastUsed: {
      type: Boolean,
      default: false,
    },
    used: {
      type: Boolean,
      default: false,
    },
    link: String,
    verificationCode: String,
    title: String,
    type: String,
  },
  { timestamps: true }
);

export default mongoose.model("Verification", VerificationSchema);
