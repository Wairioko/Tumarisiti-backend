import jwt from "jsonwebtoken"
import dotenv from "dotenv"


dotenv.config()
const jwtSecret = process.env.AuthTokenSecret;


export const verifyJWT = (req, res, next) => {
    try {
        if (!req.cookies || !req.cookies.authToken) {
            return res.status(401).json({ message: "Unauthorized, no token" });
        }

        const token = req.cookies.authToken;
        const decoded = jwt.verify(token, jwtSecret);

        
        req.user = decoded.KRApin;

        if (typeof next === "function") {
            next(); 
        } else {
            console.error("Express 'next' function is not provided.");
            return res.status(500).json({ message: "Server error: Middleware misconfigured" });
        }
    } catch (error) {
        console.error("JWT Verification Error:", error);
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};

