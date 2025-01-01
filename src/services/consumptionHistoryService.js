const firestoreService = require('./firestoreService');
const { Timestamp } = require('firebase-admin/firestore');

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
 * Consulta los productos consumidos dentro de los últimos `n` días, ordenados por fecha.
 * @param {string} uid - ID del usuario.
 * @param {number} days - Número de días hacia atrás desde hoy.
 * @returns {Promise<Object>} Resultado de la operación.
 */
const getConsumptionHistoryByDays = async (uid, days) => {
    const path = `/usuarios/${uid}/historial_consumo`;

    try {
        const today = Timestamp.now();
        const pastDate = new Timestamp(
            Math.floor((Date.now() - days * 24 * 60 * 60 * 1000) / 1000),
            0
        );

        const querySnapshot = await firestoreService.getCollectionOrdered(path, 'fecha_consumo', 'asc');
        if (!querySnapshot.success) {
            return querySnapshot;
        }

        // Filtra los documentos que están dentro del rango de fechas
        const filteredDocuments = querySnapshot.data.filter((doc) => {
            const fechaConsumo = doc.fecha_consumo.toDate();
            return fechaConsumo >= pastDate.toDate() && fechaConsumo <= today.toDate();
        });

        if (filteredDocuments.length === 0) {
            return { success: false, message: 'No documents found in the specified date range' };
        }

        return { success: true, data: filteredDocuments };
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
        const result = await firestoreService.createDocument(path, newRecord);
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
