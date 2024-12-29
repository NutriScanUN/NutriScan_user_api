const express = require('express');
const firestoreRoutes = require('./routes/firestoreRoutes');

const app = express();

// Middlewares
app.use(express.json());

// Rutas
app.use('/api', firestoreRoutes);

module.exports = app;
