const express = require('express');
const User = require('../models/User');
const authenticateUser = require('../middleware/authMiddleware');
const checkBlocked = require('../middleware/blockCheckMiddleware');

const router = express.Router();

router.get('/', authenticateUser, checkBlocked, async (req, res) => {
    try {
        const users = await User.find().sort({ last_login: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/action', authenticateUser, checkBlocked, async (req, res) => {
    const { action, userIds } = req.body;
    try {
        if (action === 'block') {
            await User.updateMany({ _id: { $in: userIds } }, { status: 'blocked' });
        } else if (action === 'unblock') {
            await User.updateMany({ _id: { $in: userIds } }, { status: 'active' });
        } else if (action === 'delete') {
            await User.deleteMany({ _id: { $in: userIds } });
        } else {
            return res.status(403).json({ message: 'Invalid action' })
        }
        res.json({ message: `Users ${action}ed successfully` });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;