import console from "console";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

// if we dont write this we will get {undefined} as error so therefore if we write this we will allow JSOn as the input of the server
//middleware
app.use(express.json());

//create an API
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

//create a middleware to handle the error
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000 !!");
});

// notes
/* 
    const app = express(); 
    creates your Express application: 
        the object that represents your web server. 
        Calling express() returns a new app instance, 
        and everything else in your file is built on top of it.

*****What app lets you do*****

In your code, app is used for three things:

1. Add middleware

javascript
app.use(express.json());

Middleware runs on every incoming request before it reaches your routes. Here, it parses JSON request bodies so you can read them as req.body.

2. Define routes

javascript
app.use("/api/user", userRouter);
app.use('/api/auth', authRouter);

This tells the app: “Any request starting with /api/user goes to userRouter, and anything starting with /api/auth goes to authRouter.”

3. Start the server

javascript
app.listen(3000, () => { ... });

This makes the app listen for requests on port 3000.

Without it
Without app, you’d have no server object to attach middleware, routes, or a listener to. express by itself is just a function; express() is what turns it into a working app.

Analogy
Think of express as a blueprint for a restaurant, and app as the actual restaurant you build from it. You then hire staff (middleware), set up the menu (routes), and open the doors (listen).

Small tip
Your code works as written, but it’s conventional to put app.listen() at the end of the file, after all middleware and routes are registered. It makes the flow easier to read:

javascript
const app = express();

app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

app.listen(3000, () => {
    console.log('Server is running on port 3000 !!');
});

Also, import console from 'console' isn’t needed. console is available globally in Node.js, so you can remove that line.

*/
