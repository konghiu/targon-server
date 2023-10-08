import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connect } from "./src/config/db/index.js";
import productRoutes from "./src/routes/product.js";
import authRoutes from "./src/routes/auth.js";
import emailRoutes from "./src/routes/email.js";
import blogRoutes from "./src/routes/blog.js";

dotenv.config();
connect();

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
export const folderView = path.join(__dirname, "/src/views/");
export const folderPublic = path.join(__dirname, "/src/public/");

const app = express();

app.use(
    cors({
        origin: ["http://localhost:3000", "https://konghiu.github.io"],
        optionSuccessStatus: 200,
        credentials: true,
    })
);
app.use(morgan("dev"));
app.use(
    session({
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
    })
);
app.use(passport.initialize());
app.use(passport.session());

// set up views
app.set("views", folderView);
app.set("view engine", "ejs");

// config static files
app.use(express.urlencoded({ extended: true }));
app.use(express.static(folderPublic));
app.use(express.json());

// config json from client request to server
app.use(cookieParser());
app.use((req, res, next) => {
    res.header("Content-Type", "application/json;charset=UTF-8");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

// routes
app.use("/products", productRoutes);
app.use("/blog", blogRoutes);
app.use("/email", emailRoutes);
app.use("/v/auth", authRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;
