const firestoreService = require('./firestoreService');
const ConsumptionHistoryModel = require('../models/consumptionHistoryModel')
/**
 * Consulta todos los productos del historial de consumo de un usuario.
 * @param {string} uid - ID del usuario.
 * @returns {Promise<Object>} Resultado de la operación.
 */
const getAllConsumptionHistory = async (uid) => {
    const path = `/usuarios/${uid}/historial_consumo`;
    return await firestoreService.getCollectionOrdered(path, 'fecha_consumo', 'asc'); // Ordena por fecha más antigua primero
};

/**
 * Obtiene los registros del historial de búsqueda dentro de un rango de días.
 * @param {string} uid - ID del usuario.
 * @param {number} n - Número de días hacia atrás (mínimo 1).
 * @param {string} [orderDirection='asc'] - Dirección de ordenamiento ('asc' o 'desc').
 * @returns {Promise<Object>} Resultado de la operación.
 */
const getConsumptionHistoryByDays = async (uid, n, orderDirection = 'asc') => {
    const path = `/usuarios/${uid}/historial_consumo`;

    try {
        // Calcular la fecha límite para la consulta
        const now = new Date();
        const startDate = new Date(now);
        startDate.setDate(startDate.getDate() - Math.max(1, n)); // Al menos 1 día antes

        // Llamar a la función de Firebase Service
        console.log(path)
        const result = await firestoreService.getDocumentsByDateRange(
            path,
            startDate,
            now,
            'fecha_consumo',
            orderDirection
        );

        console.log(result)
        if (!result.success) {
            return result;
        }

        // Crear los objetos del modelo con los resultados
        const data = result.data.map(item => new ConsumptionHistoryModel(item));
        return { success: true, data };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

/**
 * Borra un registro del historial de consumo.
 * @param {string} uid - ID del usuario.
 * @param {string} docId - ID del documento a borrar.
 * @returns {Promise<Object>} Resultado de la operación.
 */
const deleteConsumptionHistoryRecord = async (uid, docId) => {
    const path = `/usuarios/${uid}/historial_consumo`;
    try {
        const result = await firestoreService.deleteDocument(path, docId);
        return { success: true, message: 'Record deleted successfully', data: result };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

/**
 * Agrega un nuevo registro al historial de consumo de un usuario.
 * @param {string} uid - ID del usuario.
 * @param {Object} data - Datos del historial de consumo.
 * @returns {Promise<Object>} Resultado de la operación.
 */
const addConsumptionHistoryRecord = async (uid, data) => {
    const path = `/usuarios/${uid}/historial_consumo`;

    try {
        // Validar los datos usando el modelo
        const newRecord = new ConsumptionHistoryModel(data);

        // Insertar en Firestore
        console.log(newRecord.toPlainObject())
        const result = await firestoreService.createDocument(path, newRecord.toPlainObject());
        return { success: true, message: 'Record added successfully', id: result.id };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

module.exports = {
    getAllConsumptionHistory,
    getConsumptionHistoryByDays,
    deleteConsumptionHistoryRecord,
    addConsumptionHistoryRecord,
};
