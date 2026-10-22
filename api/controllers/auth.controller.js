import User from "../models/User.model.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res) => {
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
    res.status(500).json(error.message);
  }
};
