/**
 * Middleware para manejar errores en la aplicación.
 * @param {Object} err - Objeto de error.
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 * @param {Function} next - Función para pasar al siguiente middleware.
 */
const errorHandler = (err, req, res, next) => {
    console.error(`[ErrorHandler]: ${err.message}`);

    // Si el error tiene un código de estado, usarlo; si no, usar 500 (Error interno del servidor)
    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        message: err.message || 'An unexpected error occurred.',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }), // En desarrollo, incluir el stack del error.
    });
};

module.exports = errorHandler;
