const jwt = require('jsonwebtoken');
require('dotenv').config();

console.log('✅ JWT_SECRET naudojamas (authMiddleware.js):', process.env.JWT_SECRET);

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

    if (!token) {
        return res.status(401).json({ error: 'Nėra tokeno' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (err) {
        console.error('❌ Token verifikacija nepavyko:', err);
        res.status(401).json({ error: 'Blogas tokenas' });
    }
};

module.exports = authMiddleware;
