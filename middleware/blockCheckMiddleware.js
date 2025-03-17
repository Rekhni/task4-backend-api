const User = require('../models/User');

const checkBlocked = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized: No user data.' });
        }
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: User not found.' });
        }
        
        if (user.status === 'blocked') {
            return res.status(403).json({ message: 'Access denied. Your account is blocked.' });
        }
        next();
    } catch(error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = checkBlocked;

