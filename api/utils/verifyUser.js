import { errorHandler } from "./error.js";
import jwt from "jsonwebtoken";

// For example, when React sends a request to your backend, Express receives it and executes this middleware.
export const verifyToken = (req,res,next) => {

    // Go inside the incoming request → Check cookies → Get the access_token.
    const token = req.cookies.access_token;
    //Now the token variable contains the JWT token.
   
    // if token is not present
    if(!token) return next(errorHandler(401, 'Unauthorized'));
    // Let's break it down.
    // - !token means the token does not exist.
    // - return stops the current middleware from continuing.
    // - next() passes the error to Express error-handling middleware.
    //verify the token

    // We are asking JWT:
    // Is this token genuine and valid?
    jwt.verify(token,process.env.JWT_SECRET,(err,user)=> {
        if(err) return next(errorHandler(403, 'Forbidden'));
        req.user = user; //Because other middleware or route handlers can access this information.
        next();
    });


};


// token → The token received from the browser.
// process.env.JWT_SECRET → The secret key used to verify the token.
// Callback function → Executes after verification.
// Callback function -> It receives two values:
// - err → Contains an error if verification fails.
// - user → Contains the decoded token payload if verification succeeds.