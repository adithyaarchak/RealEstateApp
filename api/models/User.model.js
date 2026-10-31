import mongoose from "mongoose";

// create schema
const userSchema = new mongoose.Schema({
    username: {
        type:String,
        required: true,
        unique: true,
    },
     email: {
        type:String,
        required: true,
        unique :true
    },
     password: {
        type:String,
        required: true,
    }, 
    avatar: {
        type:String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    }

},{timestamps:true});
// time-stamps to check when logined and last seen

//create the model
const User = mongoose.model('User',userSchema);

// export the model
export default User;
