import jwt from "jsonwebtoken";

const middlwareController = {
    verifyUser: (req, res, next) => {
        const bearerToken = req.headers.authorization;
        console.log(bearerToken);
        if (bearerToken) {
            const accessToken = bearerToken.slice(7, bearerToken.length);
            jwt.verify(accessToken, process.env.JWT_SECRET_KEY, (err, data) => {
                if (err) {
                    res.status(401).json({
                        message: "Unauthorized",
                    });
                } else {
                    req.userId = data._id;
                    next();
                }
            });
        } else {
            res.status(401).json({
                message: "You aren't authorized to access this",
            });
        }
    },
    verifyAdmin: (req, res, next) => {},
};

export default middlwareController;
