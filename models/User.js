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
      // validate: function (input) {
      //   let formatedInput = new Date(input)
      //   return typeof Object.prototype.toString.call(formatedInput) === '[object Date]' && formatedInput < new Date('2017-01-01');
      // },
      //  message: input => `${input} must be greater than or equal to the current date!`
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
      type: String,
      default: ''
    },
    studentNiveauId: {
      type: mongoose.Types.ObjectId,

    },
    company:
    {
      type: mongoose.Types.ObjectId, ref: 'company'
    },
    eooaccessrights: [
      {
        type: String
      }
    ],

    // company : [
    //   {
    //     type: mongoose.Types.ObjectId, ref : 'company'
    // }
    // ],
    //   firebase : [{
    //         tokenNotification:{type:String},
    //         niveau:{type:String}
    // }],

    description: {
      type: String,
    },
    address: {
      type: String,
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
