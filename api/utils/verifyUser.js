import jwt from "jsonwebtoken";
// import { errorHandler } from "./error";

// Create a function to verify the user's token
export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token; // Get the token from the cookies

  // If there is no token, return an error
  if (!token) return next(errorHandler(401, "Unauthorized"));

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(errorHandler(403, "Forbidden"));

    req.user = user; // Set the user in the request object
    next(); // Call the next middleware
  });
};
