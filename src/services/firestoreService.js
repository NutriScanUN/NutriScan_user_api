const db = require('../config/firebase');

/**
 * Obtiene un documento por ID en una ruta dinámica.
 * @param {string} path - Ruta de la colección (e.g., `/usuarios/:uidUsuario/coleccionObjetivo`).
 * @param {string} docId - ID del documento a consultar.
 * @returns {Promise<Object>} Resultado de la operación.
 */
const getDocument = async (path, docId) => {
    try {
        const docRef = db.doc(`${path}/${docId}`);
        const doc = await docRef.get();

        if (!doc.exists) {
            return { success: false, message: 'Document not found' };
        }

        return { success: true, data: { id: doc.id, ...doc.data() } };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

/**
 * Escribe un nuevo documento en una ruta dinámica.
 * @param {string} path - Ruta de la colección (e.g., `/usuarios/:uidUsuario/coleccionObjetivo`).
 * @param {Object} data - Datos del documento a crear.
 * @returns {Promise<Object>} Resultado de la operación.
 */
const createDocument = async (path, data) => {
    try {
        const docRef = await db.collection(path).add(data);
        return { success: true, id: docRef.id, message: 'Document created successfully' };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

/**
 * Actualiza un documento en una ruta dinámica.
 * @param {string} path - Ruta de la colección (e.g., `/usuarios/:uidUsuario/coleccionObjetivo`).
 * @param {string} docId - ID del documento a actualizar.
 * @param {Object} data - Datos a actualizar.
 * @returns {Promise<Object>} Resultado de la operación.
 */
const updateDocument = async (path, docId, data) => {
    try {
        const docRef = db.doc(`${path}/${docId}`);
        await docRef.update(data);
        return { success: true, message: 'Document updated successfully' };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

/**
 * Consulta una colección y obtiene documentos ordenados por un campo.
 * @param {string} path - Ruta de la colección (e.g., `/usuarios/:uidUsuario/coleccionObjetivo`).
 * @param {string} orderByField - Campo por el cual se ordenarán los documentos.
 * @param {string} [orderDirection='asc'] - Dirección de ordenamiento ('asc' o 'desc').
 * @returns {Promise<Object>} Resultado de la operación.
 */
const getCollectionOrdered = async (path, orderByField, orderDirection = 'asc') => {
    try {
        const querySnapshot = await db.collection(path).orderBy(orderByField, orderDirection).get();

        if (querySnapshot.empty) {
            return { success: false, message: 'No documents found' };
        }

        const documents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return { success: true, data: documents };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

/**
 * Consulta una colección con paginación por índice.
 * @param {string} path - Ruta de la colección (e.g., `/usuarios/:uidUsuario/coleccionObjetivo`).
 * @param {string} orderByField - Campo por el cual se ordenarán los documentos.
 * @param {string} [orderDirection='asc'] - Dirección de ordenamiento ('asc' o 'desc').
 * @param {any} startAfterValue - Valor del campo para empezar después (paginación).
 * @param {number} limit - Cantidad de documentos a obtener.
 * @returns {Promise<Object>} Resultado de la operación.
 */
const getCollectionWithPagination = async (path, orderByField, orderDirection = 'asc', startAfterValue, limit) => {
    try {
        let query = db.collection(path).orderBy(orderByField, orderDirection).limit(limit);

        if (startAfterValue !== undefined && startAfterValue !== null) {
            query = query.startAfter(startAfterValue);
        }

        const querySnapshot = await query.get();

        if (querySnapshot.empty) {
            return { success: false, message: 'No documents found' };
        }

        const documents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return { success: true, data: documents };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

module.exports = {
    getDocument,
    createDocument,
    updateDocument,
    getCollectionOrdered,
    getCollectionWithPagination,
};
