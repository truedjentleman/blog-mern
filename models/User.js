//* MVC - model view controller

//* create User schema - model 
import mongoose from "mongoose";

const UserModel = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true, // mandatory field or not
    },
    email: {
      type: String,
      required: true,
      unique: true, // is the record unique or not
    },
    passwordHash: {
      type: String,
      required: true,
    },
    avatarUrl: String,
  },
  {
    timestamps: true, // to add creation/updating date to User object
  },
);

export default mongoose.model('User', UserModel);  // export schema with name User
