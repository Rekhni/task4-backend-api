const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || '123';

const authenticateUser = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');

        console.log("📢 Incoming Request Headers:", req.headers);

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            console.error("❌ No token provided");
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        const token = authHeader.split(" ")[1];
        console.log("📢 Extracted Token:", token);

        const decoded = jwt.verify(token, JWT_SECRET);
        console.log("✅ Token Decoded:", decoded);

        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;
        console.log("✅ User Authenticated:", user.email);
        next();
    } catch (error) {
        console.error("❌ Token verification failed:", error.message);
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authenticateUser;