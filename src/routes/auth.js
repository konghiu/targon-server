import express from "express";
import authController from "../controllers/authController.js";
import middlwareController from "../controllers/middlewareController.js";
import getGoogleAuthUrl from "../config/index.js";
import { Strategy } from "passport-google-oauth2";
import passport from "passport";

const authRoutes = express.Router();

passport.use(
    new Strategy(
        {
            clientID:
                "752838172831-ea9nfpal54soegp45aqn7g67u3dcc8b8.apps.googleusercontent.com",
            clientSecret: "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",
            callbackURL: "http://localhost:8000/v/auth/google/callback",
            passReqToCallback: true,
        },
        function (request, accessToken, refreshToken, profile, done) {
            console.log(accessToken, refreshToken);
            done(null, profile);
        }
    )
);

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

authRoutes.get("/", middlwareController.verifyUser, authController.GetUsers);
// authRoutes.get("/google", authController.GetSignInWithGoogle);
authRoutes.get(
    "/google",
    passport.authenticate("google", { scope: ["email", "profile"] })
);
authRoutes.get(
    "/google/callback",
    passport.authenticate("google", {
        successRedirect: "/products/insert",
        failureRedirect: "/products?page=1",
    })
);
authRoutes.get("/sign-on", authController.GetSignOn);
authRoutes.post("/sign-on", authController.PostSignOn);
authRoutes.get("/sign-in", authController.GetSignIn);
authRoutes.post("/sign-in", authController.postSignIn);
authRoutes.post(
    "/sign-out",
    middlwareController.verifyUser,
    authController.PostSignOut
);
authRoutes.post("/refresh-token", authController.PostRefreshToken);

export default authRoutes;
