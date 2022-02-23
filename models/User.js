import mongoose from "mongoose";
import { gender, language } from "../constants.js";

const schema = mongoose.Schema;

const userSchema = new schema(
  {
    firstname: {
      type: String,
      require: true,
    },
    lastname: {
      type: String,
      require: true,
    },
    username: {
      type: String,
      require: true,
    },
    
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },

    gender: {
      type: String,
      enum: gender,
    },
    birthday: {
      type: Date,
    },
    phone: {
      type: Number,
    },
    region: {
      type: String,
    },
    type: {
      type: String,
      trim: true,
      required: "Specify Type of User",
    },
    studentOffreId: {
      type: mongoose.Types.ObjectId,
      ref: "Offre"
    },
    
    language: {
      type: String,
      enum: language,
    },
    civility: {
      type: String,
    },
    profession: {
      type: String,
    },
    situation: {
      type: String,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    accessToken: {
      type:String,
      default:''
    },
    studentNiveauId: {
      type: mongoose.Types.ObjectId,
      
    },
    profile: {
      type: {
        fullName: { type: String, default: "", trim: true },
        phone: { type: String, default: "", trim: true },
        linkedIn: { type: String, default: "", trim: true },
        facebook: { type: String, default: "", trim: true },
      },
      default: new Object()
    },
    permissions: {
      type: {
        chapitre: { type: Boolean, default: false },
        media: { type: Boolean, default: false },
        seance: { type: Boolean, default: false },
        homework: { type: Boolean, default: false },
      },
      default: new Object()
    },

    deletedAt: Date,
    facebookUrl: String,
    linkedInUrl: String,

   },
  { timestamps: true }
);

export default mongoose.model("user", userSchema);
