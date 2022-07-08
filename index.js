import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";

// import validation rule
import { registerValidation } from "./validations/auth.js";

// import user schema
import UserModel from "./models/User.js";

// connect to MongoDB aтв catch the errors if occurred
mongoose
  .conn  ect(
    "mongodb+srv://admin:qwerty123@cluster0.7a9jt.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log("DB error:", error));

const app = express();

app.use(express.json()); // to enable JSON read from requests

app.get("/", (req, res) => {
  res.send("Get request successfully completed!");
});

//* basic login
app.post("/auth/login-check", (req, res) => {
  console.log(req.body);

  // generate token with data to be encode AND the key as a second parameter
  // key can be ony
  const token = jwt.sign(
    {
      email: req.body.email, // email from req.body which is come from client (front)
      fullName: "John Doe",
    },
    "secretToken"
  );

  res.json({
    success: true,
    token, // return token to client
  });
});

//* POST request for registration with validation - send validation function as a second parameter
app.post("/auth/register", registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req); // get all errors occurred during the validation
    if (!errors.isEmpty()) {
      // if there is/are error - return server status '400' and json with these errors
      return res.status(400).json(errors.array());
    }

    // encrypt password form req.body
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10); // create encryption Salt - algorithm
    const hash = await bcrypt.hash(password, salt); // hash the password with salt

    // create document for User
    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    });
    // save user to DB
    const user = await doc.save();

    // create token for _id returned from DB
    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d", // TTL of token
      }
    );

    // destructure 'user', to extract 'passwordHash', aтв save the rest to 'userData'
    // in order do not to sent user's 'passwordHash' to user in response, although it's saved in DB
    const { passwordHash, ...userData } = user._doc;

    res.json({
      // if there are no errors during validation - return 'success: true' and user info
      success: true,
      ...userData,
      token,
    });
  } catch (error) {
    console.error(error); // not sending errors to user, just console it
    res.status(500).json({    // send server res 500 and message to user
      success: false,
      message: "Invalid registration",
    });
  }
});

//* POST request for login
app.post("/auth/login", async (req, res) => {
  try {
    //to find user in MongoDB by email
    const user = await UserModel.findOne({ email: req.body.email });

    // if there is no user with specified email
    if (!user) {
      return res.status(404).json({
        message: "Incorrect login",
      });
    }

    // if user exists - compare the password from user with password hash in DB
    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );
    // if password is incorrect
    if (!isValidPass) {
      return res.status(400).json({
        message: "Incorrect login or password",
      });
    }

    // if login(email) and password are correct create new token for _id returned from DB
    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d", // TTL of token
      }
    );

    // destructure 'user', to extract 'passwordHash', aтв save the rest to 'userData'
    // in order do not to sent user's 'passwordHash' to user in response, although it's saved in DB
    const { passwordHash, ...userData } = user._doc;

    res.json({
      // if there are no errors during validation - return 'success: true' and user info
      success: true,
      ...userData,
      token,
    });
  } catch (error) {
    console.error(error); // not sending errors to user, just console it
    res.status(500).json({  // send server res 500 and message to user
      success: false, 
      message: "Authorization failed",
    })
  }
});

//* GET the ME info 
app.get('/auth/me', (req, res) => {

})

app.listen(4444, (err) => {
  // running server
  if (err) {
    return console.log(err);
  }
  return console.log("Server is running on port 4444");
});
