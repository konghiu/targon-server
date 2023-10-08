import express from "express";
import blogController from "../controllers/blogController.js";
const blogRoutes = express.Router();

blogRoutes.post("/", blogController.PostNewBlog);
blogRoutes.get("/", blogController.GetAllTheBlog);
blogRoutes.get("/:title", blogController.GetTheBlog);
blogRoutes.post("/likeOrDislike/:title", blogController.PostLikeOrDislikeBlog);
blogRoutes.post("/comment/:title", blogController.PostComment);
blogRoutes.post(
    "/comment/likeOrDislike/:title",
    blogController.PostLikeOrDislikeComment
);

export default blogRoutes;
