const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

// Registracija
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, password: hashedPassword });
        res.status(201).json({ message: 'Registracija sėkminga!' });
    } catch (err) {
        console.error(err);

        if (err.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({ error: 'Toks vartotojo vardas jau egzistuoja.' });
        } else {
            res.status(500).json({ error: 'Įvyko serverio klaida registruojant vartotoją.' });
        }
    }
});

// Prisijungimas
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ where: { username } });
        if (!user) return res.status(401).json({ error: 'Neteisingas vartotojo vardas.' });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ error: 'Neteisingas slaptažodis.' });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Serverio klaida prisijungiant.' });
    }
});

module.exports = router;
