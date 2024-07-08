import jwt from 'jsonwebtoken';
import User from '../Models/userSchema.js';
import dotenv from 'dotenv';

dotenv.config();

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: "Authorization header not found" });
        }

        const token = authHeader?.split(' ')[1]; // Bearer token
        if (!token) {
            return res.status(401).json({ message: "Token not found" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
        console.log("Decoded user:", req.user);

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(401).json({ message: "Access Denied: Not a valid user" });
        }

        next();
    } catch (error) {
        console.log("Token verification error:", error);
        res.status(500).json({ message: "Invalid Token or Internal Server Error" });
    }
};

export default authMiddleware;
