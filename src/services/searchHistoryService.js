const firestoreService = require('./firestoreService');
const { Timestamp } = require('firebase-admin/firestore');
const SearchHistoryModel = require('../models/searchHistoryModel');

/**
 * Consulta todo el historial de búsqueda de un usuario con un límite ordenado por fecha_busqueda.
 * @param {string} uid - ID del usuario.
 * @param {number} limit - Cantidad máxima de registros a obtener.
 * @param {string} [orderDirection='asc'] - Dirección de ordenamiento ('asc' o 'desc').
 * @returns {Promise<Object>} Resultado de la operación.
 */
const getSearchHistoryWithLimit = async (uid, limit, orderDirection = 'asc') => {
    const path = `/usuarios/${uid}/historial_busqueda`;
    const result = await firestoreService.getCollectionWithPagination(path, 'fecha_busqueda', orderDirection, null, limit);

    if (!result.success) {
        return result;
    }

    // Validar los resultados usando el modelo
    const data = result.data.map((item) => new SearchHistoryModel(item));
    return { success: true, data };
};

/**
 * Obtiene los registros del historial de búsqueda dentro de un rango de días.
 * @param {string} uid - ID del usuario.
 * @param {number} n - Número de días hacia atrás (mínimo 1).
 * @param {string} [orderDirection='asc'] - Dirección de ordenamiento ('asc' o 'desc').
 * @returns {Promise<Object>} Resultado de la operación.
 */
const getSearchHistoryByDays = async (uid, n, orderDirection = 'asc') => {
    const path = `/usuarios/${uid}/historial_busqueda`;

    try {
        // Calcular la fecha límite para la consulta
        const now = new Date();
        const startDate = new Date(now);
        startDate.setDate(startDate.getDate() - Math.max(1, n)); // Al menos 1 día antes

        // Llamar a la función de Firebase Service
        const result = await firestoreService.getDocumentsByDateRange(
            path,
            startDate,
            now,
            'fecha_busqueda',
            orderDirection
        );

        if (!result.success) {
            return result;
        }

        // Crear los objetos del modelo con los resultados
        const data = result.data.map(item => new SearchHistoryModel(item));
        return { success: true, data };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

/**
 * Consulta todo el historial de búsqueda de un usuario, sin límite.
 * @param {string} uid - ID del usuario.
 * @param {string} [orderDirection='asc'] - Dirección de ordenamiento ('asc' o 'desc').
 * @returns {Promise<Object>} Resultado de la operación.
 */
const getAllSearchHistory = async (uid, orderDirection = 'asc') => {
    const path = `/usuarios/${uid}/historial_busqueda`;
    const result = await firestoreService.getCollectionOrdered(path, 'fecha_busqueda', orderDirection);

    if (!result.success) {
        return result;
    }

    // Validar los resultados usando el modelo
    const data = result.data.map((item) => {
        console.log(item) // Extraer el ID del documento
        return new SearchHistoryModel({...item});
    });
    return { success: true, data };
};

/**
 * Elimina un documento de una colección.
 * @param {string} collectionPath - Ruta completa de la colección.
 * @param {string} docId - ID del documento a borrar.
 * @returns {Promise<Object>} Resultado de la operación.
 */
const deleteSearchHistoryRecord = async (collectionPath, docId) => {
    try {
        const result = await firestoreService.deleteDocument(collectionPath, docId);
        return { success: true, message: 'Document deleted successfully', data: result };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

/**
 * Agrega un nuevo registro al historial de búsqueda de un usuario.
 * @param {string} uid - ID del usuario.
 * @param {Object} data - Datos del historial de búsqueda.
 * @returns {Promise<Object>} Resultado de la operación.
 */
const addSearchHistoryRecord = async (uid, data) => {
    const path = `/usuarios/${uid}/historial_busqueda`;

    try {
        // Validar los datos usando el modelo
        const newRecord = new SearchHistoryModel(data);

        // Insertar en Firestore
        const result = await firestoreService.createDocument(path, newRecord.toPlainObject());
        return { success: true, message: 'Record added successfully', id: result.id };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

module.exports = {
    getSearchHistoryWithLimit,
    getSearchHistoryByDays,
    getAllSearchHistory,
    deleteSearchHistoryRecord,
    addSearchHistoryRecord,
};
