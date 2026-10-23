import User from "../models/User.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
  //taking the input of the user by req.body
  const { username, email, password } = req.body;

  //hash the provided password
  //since we use Sync we no need to use await function there
  const hashPassword = bcryptjs.hashSync(password, 10);

  // save it inside the database
  const newUser = new User({ username, email, password: hashPassword });
  try {
    await newUser.save();
    res.status(201).json("User created successfully");
  } catch (error) {
    // next is the middlerware which is written in index.js and called everywhere we need to handle the error
    // first we need it to be called with req,res,next
    next(error);
  }
};
