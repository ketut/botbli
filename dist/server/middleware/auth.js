import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Set req.user
        next();
    }
    catch (err) {
        console.error('JWT verification failed:', err);
        res.status(401).json({ error: 'Invalid token' });
    }
};
export default authMiddleware;
