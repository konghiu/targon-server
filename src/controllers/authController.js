import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import emailController from "./emailController.js";
import axios from "axios";
import getGoogleAuthUrl from "../config/index.js";

const tokenList = {};

export const createUserList = {};

const authController = {
    // [METHOD] create jwt
    // a = access (default), r = refresh
    createJWT: (payload, type = "a") => {
        let expiresIn = 86400;
        if (type === "r") expiresIn = 604800;
        const token = jwt.sign({ _id: payload }, process.env.JWT_SECRET_KEY, {
            expiresIn: expiresIn,
        });
        return token;
    },

    // [GET] get all users
    GetUsers: async (req, res) => {
        const username = req.query.username;
        let users;
        if (username) {
            users = await User.find({
                username: { $regex: username, $options: "i" },
            });
        } else users = await User.find({});

        try {
            res.status(200).json(users);
        } catch (err) {
            res.status(400).json({ message: err });
        }
    },
    // [GET] layout sign on
    GetSignOn: (req, res) => {
        res.render("signOn");
    },

    // [POST] handle create user
    PostSignOn: async (req, res) => {
        try {
            const { username, email, password } = req.body;
            const findUser = await User.findOne({ email: email });
            if (findUser) {
                res.status(403).json({ message: "This email was used!" });
            } else {
                const hashPassword = bcrypt.hashSync(
                    password,
                    Number(process.env.SALT_ROUNDS)
                );
                const newUser = new User({
                    username: username,
                    email: email,
                    password: hashPassword,
                });
                createUserList[email] = newUser;
                await emailController.createVerificationCode(email, res);
                // await newUser.save();
                res.status(200).json({ message: "sent verification code" });
            }
        } catch (e) {
            res.status(400).json({ message: e.message });
        }
    },

    // [GET] layout sign in
    GetSignIn: (req, res) => {
        res.render("signIn");
    },

    // [POST] sign in
    postSignIn: async (req, res) => {
        const { email, password } = req.body;
        await User.findOne({ email: email })
            .then((data) => {
                if (bcrypt.compareSync(password, data.password)) {
                    const access = authController.createJWT(data._id);
                    const refresh = authController.createJWT(data._id, "r");
                    tokenList[refresh] = access;
                    const infoUser = {
                        ...data._doc,
                        accessToken: access,
                        refreshToken: refresh,
                    };
                    delete infoUser.password;
                    res.status(200).json({ ...infoUser });
                } else {
                    res.status(403).json({
                        message: "Incorrect email or password!",
                    });
                }
            })
            .catch((err) => {
                res.status(403).json({
                    message: "Incorrect email or password!",
                });
            });
    },

    // [GET] sign in with google account
    GetSignInWithGoogle: async (req, res) => {
        await axios
            .get(getGoogleAuthUrl(), {
                headers: {
                    accept: "application/json",
                },
            })
            .then((response) => {
                const accessToken = response.data;
                console.log(accessToken);
            })
            .catch((e) => console.log(e));
        res.status(200).json({
            message: "sign in with google account successfully!",
        });
    },

    // [POST] refresh token / relogin
    PostRefreshToken: async (req, res) => {
        try {
            const { refreshToken } = req.cookies;
            if (refreshToken && refreshToken in tokenList) {
                const decoder = jwt.verify(
                    refreshToken,
                    process.env.JWT_SECRET_KEY
                );
                const access = authController.createJWT(decoder._id);
                tokenList[refreshToken] = access;
                const user = await User.findById(decoder._id);
                const infoUser = { ...user._doc, accessToken: access };
                delete infoUser.password;
                res.status(200).json({ ...infoUser });
            } else {
                res.status(401).json({
                    message: "Invalid token or token was expired",
                });
            }
        } catch (err) {
            res.status(403).json({ message: err.message });
        }
    },

    // [POST] sign out
    PostSignOut: async (req, res) => {
        res.clearCookie("refreshToken");
        res.status(200).json({ message: "Sign out successfully!" });
    },
};

export default authController;
