const express = require('express');
const searchHistoryRoute = require('./routes/searchHistoryRoutes');
const consumptionHistoryRoute = require('./routes/consumptionHistoryRoutes');
const userRoute = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');
const setupSwagger = require('./swagger');
const promClient = require("prom-client");


const app = express();

const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics();
app.use(express.json());

// Configuración de Swagger
setupSwagger(app);

// Rutas
app.use('/api/search-history', searchHistoryRoute);
app.use('/api/consumption-history', consumptionHistoryRoute);
app.use('/api/users', userRoute);

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", promClient.register.contentType);
  res.end(await promClient.register.metrics());
});
  

// Manejo de errores
app.use(errorHandler);

module.exports = app;
