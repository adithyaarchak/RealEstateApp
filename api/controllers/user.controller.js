import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import User from "../models/User.model.js";

export const test = (req,res)=> {
    res.json({
        message: 'Shit',
    });
}

export const updateUser = async (req,res,next) => {
    if(req.user.id !== req.params.id) return next(errorHandler(401,"You can only update your own account!"));
    try {
        // user trying to change the password
        if(req.body.passowrd) {
            req.body.passowrd = bcryptjs.hashSync(req.body.passowrd,10);
        }
        
        const updateUser = await User.findByIdAndUpdate(req.params.id,{
            // following things user can update
            $set: {
                username: req.body.username,
                email:req.body.email,
                password:req.body.passowrd,
            }
        },{new:true}); //if we dont add this one we will get the previous information as the response
        const {password, ...rest} = updateUser._doc
        res.status(200).json(rest);
    } catch (error) {
        next(error)
    }
}