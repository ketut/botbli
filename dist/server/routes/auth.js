import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import authMiddleware from '../middleware/auth.js';
import dotenv from 'dotenv';
dotenv.config();
const router = Router();
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            console.log(`Login failed for email: ${email}`);
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log(`Login successful for email: ${email}`);
        res.json({ token, email: user.email });
    }
    catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});
router.get('/validate', authMiddleware, async (req, res) => {
    try {
        if (!req.user) {
            return res.json({ valid: false });
        }
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.json({ valid: false });
        }
        res.json({ valid: true, email: user.email });
    }
    catch (err) {
        console.error('Validate error:', err);
        res.json({ valid: false });
    }
});
export default router;
