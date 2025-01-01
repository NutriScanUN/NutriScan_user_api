const firestoreService = require('./firestoreService');
const UserModel = require('../models/userModel');

/**
 * Crea un nuevo usuario en la colección `/usuarios`.
 * @param {string} uid - ID del usuario.
 * @param {UserModel} userData - Datos del usuario a crear.
 * @returns {Promise<Object>} Resultado de la operación.
 */
const createUser = async (uid, userData) => {
    const path = `/usuarios`;

    try {
        const user = new UserModel(userData); // Validación del modelo
        const result = await firestoreService.createDocumentWithId(path, uid, user);
        return { success: true, message: 'User created successfully', data: result };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

/**
 * Obtiene los datos de un usuario por su ID.
 * @param {string} uid - ID del usuario.
 * @returns {Promise<Object>} Resultado de la operación.
 */
const getUser = async (uid) => {
    const path = `/usuarios`;

    try {
        const result = await firestoreService.getDocument(path, uid);
        if (!result.success) return result;

        // Validación del modelo con los datos obtenidos
        const user = new UserModel(result.data);
        return { success: true, data: user };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

/**
 * Actualiza los datos de un usuario.
 * @param {string} uid - ID del usuario.
 * @param {UserModel} userData - Datos del usuario a actualizar.
 * @returns {Promise<Object>} Resultado de la operación.
 */
const updateUser = async (uid, userData) => {
    const path = `/usuarios`;

    try {
        const user = new UserModel(userData); // Validación del modelo
        const result = await firestoreService.updateDocument(path, uid, user);
        return { success: true, message: 'User updated successfully', data: result };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

/**
 * Elimina un usuario por su ID.
 * @param {string} uid - ID del usuario.
 * @returns {Promise<Object>} Resultado de la operación.
 */
const deleteUser = async (uid) => {
    const path = `/usuarios`;

    try {
        const result = await firestoreService.deleteDocument(path, uid);
        return { success: true, message: 'User deleted successfully', data: result };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

/**
 * Verifica si existe un usuario con el ID proporcionado.
 * @param {string} uid - ID del usuario.
 * @returns {Promise<boolean>} `true` si el usuario existe, `false` en caso contrario.
 */
const doesUserExist = async (uid) => {
    const path = `/usuarios`;

    try {
        const result = await firestoreService.getDocument(path, uid);
        return result.success && result.data ? true : false;
    } catch (error) {
        return false;
    }
};

module.exports = {
    createUser,
    getUser,
    updateUser,
    deleteUser,
    doesUserExist,
};
