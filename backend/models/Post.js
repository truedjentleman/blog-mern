//* MVC - model-view-controller

//* create Post schema - model 
import mongoose from "mongoose";

const PostModel = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true, // mandatory field or not
    },
    text: {
      type: String,
      required: true,
      unique: true, // is the record unique or not
    },
    tags: {
      type: Array,
      default: [] // if there are no tags, send empty array to DB
    },
    viewsCount: {
      type: Number,
      default: 0,   // if there are no views, send 0 to DB
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',   // reference to 'User' model, and get from there full user data based on type: mongoose.Schema.Types.ObjectId - '_id'
      required: true,
    },
    imageUrl: String,
  },
  {
    timestamps: true, // to add creation/updating date to Post object
  },
);

export default mongoose.model('Post', PostModel);  // export schema with name Post
