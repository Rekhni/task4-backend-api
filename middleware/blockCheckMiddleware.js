const User = require('../models/User');

const checkBlocked = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id) {
            console.error("❌ checkBlocked: No user found in request.");
            return res.status(401).json({ message: 'Unauthorized: No user data.' });
        }
        const user = await User.findById(req.user.id);

        if (!user) {
            console.error("❌ checkBlocked: User not found in database.");
            return res.status(401).json({ message: 'Unauthorized: User not found.' });
        }
        
        if (!user || user.status === 'blocked') {
            return res.status(403).json({ message: 'Access denied. Your account is blocked.' });
        }
        console.log("✅ checkBlocked: User access granted.");
        next();
    } catch(error) {
        console.error("❌ checkBlocked Middleware Error:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = checkBlocked;

