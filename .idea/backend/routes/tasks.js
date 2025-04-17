const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const jwt = require('jsonwebtoken');

// Middleware – autentifikacija
const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ error: 'Nėra tokeno' });

    try {
        const decoded = jwt.verify(token, 'slaptas_raktas'); // naudok .env produkcijoj
        req.userId = decoded.id;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Blogas tokenas' });
    }
};

// Gauti visas užduotis
router.get('/', authMiddleware, async (req, res) => {
    const tasks = await Task.findAll({ where: { UserId: req.userId } });
    res.json(tasks);
});

// Sukurti naują užduotį
router.post('/', authMiddleware, async (req, res) => {
    const { title, description } = req.body;
    const task = await Task.create({ title, description, UserId: req.userId });
    res.status(201).json(task);
});

// Atnaujinti užduotį
router.put('/:id', authMiddleware, async (req, res) => {
    const task = await Task.findOne({ where: { id: req.params.id, UserId: req.userId } });
    if (!task) return res.status(404).json({ error: 'Nerasta' });
    await task.update(req.body);
    res.json(task);
});

// Ištrinti užduotį
router.delete('/:id', authMiddleware, async (req, res) => {
    const task = await Task.findOne({ where: { id: req.params.id, UserId: req.userId } });
    if (!task) return res.status(404).json({ error: 'Nerasta' });
    await task.destroy();
    res.json({ message: 'Ištrinta' });
});

module.exports = router;
 