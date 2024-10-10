import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";
import cookieParser from "cookie-parser";
import path from "path";

dotenv.config(); // Load environment variables from the .env file into the process.env object

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => {
    console.log(err);
  });

const __dirname = path.resolve(); // Add this line of code to fix the "__dirname is not defined" error in ES modules when using Node.js with Express and Webpack

const app = express();

app.use(express.json());

app.use(cookieParser());

app.listen(3000, () => {
  console.log("Server is running on port 3000!");
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

app.use(express.static(path.join(__dirname, "/client/public"))); // Serve the static files from the React app in the dist folder using Express static middleware to serve the static files from the dist folder in the client directory when the server is in production mode (i.e., when the NODE_ENV environment variable is set to "production") and the React app is built using the npm run build command.

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "public", "index.html")); // Send the index.html file from the dist folder in the client directory when the server receives a GET request for any route that is not defined in the server.
});

//Middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
