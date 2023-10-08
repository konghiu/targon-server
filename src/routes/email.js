import express from "express";
import emailController from "../controllers/emailController.js";
const emailRoutes = express.Router();

emailRoutes.post("/verify", emailController.PostVerifyEmail);
emailRoutes.get("/verify", emailController.GetCreateNewCode);

export default emailRoutes;
