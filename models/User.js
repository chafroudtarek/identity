import mongoose from "mongoose";
import { gender, language } from "../constants.js";

const schema = mongoose.Schema;

const userSchema = new schema(
  {
    firstname: {
      type: String,
    },
    lastname: {
      type: String,
     
    },
    username: {
      type: String,
      trim: true,
      unique: "username already registered",
    },
    // email
    email: {
      type: String,
      trim: true,
      required: "email is required",
      unique: "email already registered",
      match: [/.+\@.+\..+/, "Valid email required"],
    },
    password: {
      type: String,
    },

    gender: {
      type: String,
      enum: gender,
    },
    birthday: {
      type: Date,
    },
    phone: {
      type: String,
    },
    region: {
      type: String,
    },
    type: {
      type: String,
      trim: true,
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
    description: {
      type:String,
    },
    address: {
      type:String,
    },
    // profile: {
    //   type: {
    //     fullName: { type: String, default: "", trim: true },
    //     phone: { type: String, default: "", trim: true },
    //     linkedIn: { type: String, default: "", trim: true },
    //     facebook: { type: String, default: "", trim: true },
    //   },
    //   default: new Object()
    // },
    // permissions: {
    //   type: {
    //     chapitre: { type: Boolean, default: false },
    //     media: { type: Boolean, default: false },
    //     seance: { type: Boolean, default: false },
    //     homework: { type: Boolean, default: false },
    //   },
    //   default: new Object()
    // },

    deletedAt: Date,
    facebookUrl: String,
    linkedInUrl: String,

   },
  { timestamps: true }
);

export default mongoose.model("user", userSchema);
