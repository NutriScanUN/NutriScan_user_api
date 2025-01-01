const express = require('express');
const router = express.Router();
const userService = require('../services/userService');
const errorHandler = require('../middlewares/errorHandler');

/**
 * Crea un nuevo usuario.
 */
router.post('/', async (req, res, next) => {
    try {
        const data = req.body;
        const result = await userService.createUser(data);
        if (result.success) {
            res.status(201).json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        next(error); // Pasar el error al middleware de manejo de errores
    }
});

/**
 * Obtiene un usuario por UID.
 */
router.get('/:uid', async (req, res, next) => {
    try {
        const { uid } = req.params;
        const result = await userService.getUser(uid);
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(404).json(result);
        }
    } catch (error) {
        next(error);
    }
});

/**
 * Actualiza un usuario existente.
 */
router.put('/:uid', async (req, res, next) => {
    try {
        const { uid } = req.params;
        const data = req.body;
        const result = await userService.updateUser(uid, data);
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        next(error);
    }
});

/**
 * Elimina un usuario por UID.
 */
router.delete('/:uid', async (req, res, next) => {
    try {
        const { uid } = req.params;
        const result = await userService.deleteUser(uid);
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(404).json(result);
        }
    } catch (error) {
        next(error);
    }
});

/**
 * Verifica si un usuario existe por UID.
 */
router.get('/:uid/exists', async (req, res, next) => {
    try {
        const { uid } = req.params;
        const result = await userService.doesUserExist(uid);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

// Middleware de manejo de errores
router.use(errorHandler);

module.exports = router;
