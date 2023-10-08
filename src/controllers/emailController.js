import nodemailer from "nodemailer";
import { createUserList } from "./authController.js";

const verifyEmail = {};

const emailController = {
    // [method] create verification code
    createVerificationCode: async (email, res) => {
        try {
            let transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.USER_EMAIL,
                    pass: process.env.PASSWORD_EMAIL,
                },
            });
            const verifyCodeRandom = String(Math.random()).slice(2, 8);

            verifyEmail[email] = {
                code: verifyCodeRandom,
                time: Date.now() + 80000,
            };

            await transporter.sendMail({
                from: process.env.USER_EMAIL,
                to: [email],
                subject: "Verification code",
                html: `
                        <h1>From Admin</h1>
                        <h3>Hello User!</h3>
                        <p>verification code: 
                            <b style="color: red">${verifyCodeRandom}</b>
                        </p>
                    `,
            });
        } catch (error) {
            throw error.message;
        }
    },
    // [GET] get new code
    GetCreateNewCode: async (req, res) => {
        const { email } = req.query;
        try {
            await emailController.createVerificationCode(email, res);
            res.status(200).json({ message: "sent new verification code" });
        } catch (error) {
            res.status(403).json({ message: error.message });
        }
    },

    // [POST] verify email
    PostVerifyEmail: async (req, res) => {
        const { email, code } = req.body;
        if (!code) {
            res.status(404).json({ message: "Invalid verification code." });
        } else {
            try {
                const determineCode = verifyEmail[email].code === code;
                const onTime = verifyEmail[email].time >= Date.now();
                if (determineCode && onTime) {
                    if (createUserList[email]) {
                        await createUserList[email].save();
                        delete createUserList[email];
                        res.status(200).json({
                            message:
                                "Congratulations!!! You have successfully created an account.",
                        });
                    } else {
                        res.status(200).json({ message: "verify successful." });
                    }
                } else {
                    if (onTime === false) {
                        res.status(403).json({
                            message:
                                "Verification code was expired. Please get new code",
                        });
                    } else {
                        res.status(403).json({
                            message:
                                "Verification code doesn't match. Please get new code.",
                        });
                    }
                }
                delete verifyEmail[email];
            } catch (e) {
                res.status(403).json({
                    message:
                        "Verification code was canceled. Please get new code.",
                });
            }
        }
    },
};

export default emailController;
