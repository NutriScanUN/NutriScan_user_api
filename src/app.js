const express = require('express');
const searchHistoryRoute = require('./routes/searchHistoryRoutes');
const consumptionHistoryRoute = require('./routes/consumptionHistoryRoutes');
const userRoute = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');
const setupSwagger = require('./swagger');
const promClient = require("prom-client");


const app = express();

const register = promClient.register;
const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics({ register });

const httpRequestDurationMicroseconds = new promClient.Histogram({
  name: "http_request_duration_seconds",
  help: "Duración de las solicitudes HTTP en segundos",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5] // Intervalos de tiempo en segundos
});
register.registerMetric(httpRequestDurationMicroseconds );

const cacheRequests = new promClient.Counter({
  name: "user_api_cache_total",
  help: "Total de requests al cache",
  labelNames: ["instance", "type"]
});

register.registerMetric(cacheRequests);

const httpRequestTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total de peticiones HTTP recibidas',
  labelNames: ['method', 'route', 'status_code'],
});

// Simulación: Incrementar contador cuando se consulta caché
app.get("/cache", (req, res) => {
  cacheRequests.inc({ instance: "user-api", type: "Request" });
  res.json({ message: "Cache request counted" });
});

app.use(express.json());

// Configuración de Swagger
setupSwagger(app);

app.use((req, res, next) => {
  const end = httpRequestDurationMicroseconds.startTimer();
  res.on("finish", () => {
    httpRequestTotal.inc({
      method: req.method,
      route: req.route ? req.route.path : req.path,
      status_code: res.statusCode,
    });
    end({ method: req.method, route: req.route?.path || req.path, status_code: res.statusCode });
  });
  next();
});

// Rutas
app.use('/api/search-history', searchHistoryRoute);
app.use('/api/consumption-history', consumptionHistoryRoute);
app.use('/api/users', userRoute);

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});
  

// Manejo de errores
app.use(errorHandler);

module.exports = app;
