import express from "express";
import {
  test,
  updateUser,
  deleteUser,
  getUserListings,
  getUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", test); // Add the test route
router.post("/update/:id", verifyToken, updateUser); // Add the verifyToken middleware
router.delete("/delete/:id", verifyToken, deleteUser); // Add the verifyToken middleware to the delete route
router.get("/listings/:id", verifyToken, getUserListings); // Add the verifyToken middleware to the get user listings route
router.get("/:id", verifyToken, getUser); // Add the verifyToken middleware to the get user by ID route

export default router;
