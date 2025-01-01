const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const searchHistoryRoute = require('./routes/searchHistoryRoute');
const consumptionHistoryRoute = require('./routes/consumptionHistoryRoute');
const userRoute = require('./routes/userRoute');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middlewares globales
app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use('/api/search-history', searchHistoryRoute);
app.use('/api/consumption-history', consumptionHistoryRoute);
app.use('/api/users', userRoute);

// Manejo de errores
app.use(errorHandler);

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

module.exports = app;
