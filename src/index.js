const app = require('./app'); // Importar la configuración de la aplicación desde app.js
const PORT = process.env.PORT || 3000; // Leer el puerto desde el archivo .env o usar 3000 por defecto

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
