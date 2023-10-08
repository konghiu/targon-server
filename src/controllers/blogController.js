import Blog from "../models//Blog.js";
import User from "../models/User.js";

const blogController = {
    PostNewBlog: async (req, res) => {
        try {
            const { author, title, content } = req.body;
            const newBlog = Blog({
                author: author,
                title: title,
                content: content,
            });
            await newBlog.save();
            res.status(200).json({ message: "Post blog successfully" });
        } catch (err) {
            res.json({ error: err.message });
        }
    },
    PostComment: async (req, res) => {
        try {
            const { title } = req.params;
            let comment = req.body;
            const user = await User.findById(comment.assessor);
            delete user.password;

            comment = { ...comment, assessor: user };
            const blog = await Blog.findOne({ title: title });
            const comments = [comment, ...blog.comments];
            blog.comments = comments;
            await blog.save();
            res.status(200).json({ comment: blog.comments[0] });
        } catch (e) {
            res.json({ error: e.message });
        }
    },
    GetAllTheBlog: async (req, res) => {
        try {
            const blog = await Blog.find().populate("comments.assessor");
            res.status(200).json(blog);
        } catch (err) {
            res.json({ error: err.message });
        }
    },
    GetTheBlog: async (req, res) => {
        try {
            const { title } = req.params;
            const blog = await Blog.findOne({ title: title }).populate(
                "comments.assessor"
            );
            res.status(200).json(blog);
        } catch (err) {
            res.json({ error: err.message });
        }
    },
    PostLikeOrDislikeBlog: async (req, res) => {
        try {
            const { title } = req.params;
            // type is like or dislike
            const { user, type } = req.body;
            const typeElse = type === "like" ? "dislike" : "like";
            const blog = await Blog.findOne({ title: title });
            blog[typeElse] = blog[typeElse].filter(
                (item) => item.user !== user
            );
            blog[type].push(user);
            await blog.save();
            console.log(blog);
            res.status(200).json({ message: `You ${type} successfully` });
        } catch (err) {
            res.json({ error: err.message });
        }
    },
    PostLikeOrDislikeComment: async (req, res) => {
        try {
            const { title } = req.params;
            // type is like or dislike
            const { user, type, commentId } = req.body;
            const typeElse = type === "like" ? "dislike" : "like";
            const blog = await Blog.findOne({ title: title });
            const cmt = blog.comments.find(
                (item) => String(item._id) === commentId
            );
            const checkLiked = cmt[type].findIndex(
                (item) => String(item._id) === user
            );
            if (checkLiked === -1) {
                cmt[typeElse] = cmt[typeElse].filter((item) => {
                    return String(item._id) !== user;
                });

                cmt[type].push(user);
            } else {
                cmt[type] = cmt[type].filter((item) => {
                    return String(item._id) !== user;
                });
            }
            await blog.save();
            res.status(200).json({
                like: cmt["like"].length,
                dislike: cmt["dislike"].length,
            });
        } catch (err) {
            res.status(403).json({ error: err.message });
        }
    },
};

export default blogController;
