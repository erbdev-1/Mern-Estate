import express from "express";
import { test, updateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", test); // Add the test route
router.post("/update/:id", verifyToken, updateUser); // Add the verifyToken middleware

export default router;
