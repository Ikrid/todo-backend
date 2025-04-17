const express = require('express');
const cors = require('cors');
const sequelize = require('./config');
const User = require('./models/User');
const Task = require('./models/Task');

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api/tasks', taskRoutes);

sequelize.sync().then(() => {
    console.log('✅ Duomenų bazė sinchronizuota');
    app.listen(5000, () => console.log('🚀 Serveris veikia http://localhost:5000'));
}).catch(err => console.error('❌ DB klaida:', err));
