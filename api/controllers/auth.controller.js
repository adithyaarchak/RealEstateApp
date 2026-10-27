import User from "../models/User.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

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

// signin
export const signin = async (req,res,next) => {
  const {email,password} = req.body;
  try{
    //check the email is alreay excisted
    const validUser = await User.findOne({email});
    if(!validUser) return next(errorHandler(404, 'User not found!'));

    //compare the password
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if(!validPassword) return next(errorHandler(401, 'Wrong credential!'));

    // when we display the user details we don't need to display 
    // to hide the passoword 
    const {password:pass, ...rest} = validUser._doc;

    //create token
    const token = jwt.sign(
      {id: validUser._id },process.env.JWT_SECRET
    );

    //save the token inside the cookie
    res.cookie('access_token',token,{httpsOnly:true})
    .status(200)
    // we ger rest of evrything instead of password using(.json(rest))
    .json(rest);
  } catch (error) {
    next(error);
  }
}
