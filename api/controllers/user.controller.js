import bcryptjs from "bcryptjs"; // Import bcryptjs to hash the password
import User from "../models/user.model.js"; // Import the User model
import { errorHandler } from "../utils/error.js";

export const test = (req, res) => {
  res.json({
    message: "Api route is working!",
  });
};

// Update a user by ID (Protected Route) - /api/user/update/:id
export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    // Check if the user ID in the token matches the user ID in the request
    return next(errorHandler(401, "you can only update your account")); // Return an error if the user ID does not match
  // Check if the password is provided in the request body
  try {
    if (req.body.password) {
      req.body.password = await bcryptjs.hashSync(req.body.password, 10); // Hash the password
    }

    // Update the user by ID and return the updated user
    const updateUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated user
    });

    // Return the updated user without the password field in the response
    const { password, ...info } = updateUser._doc;

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: info,
    });
  } catch (error) {
    next(error);
  }
};
