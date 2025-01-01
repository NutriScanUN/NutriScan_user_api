const express = require('express');
const router = express.Router();
const userService = require('../services/userService');

/**
 * Ruta para crear un nuevo usuario.
 * POST /api/usuarios/:uid
 */
router.post('/:uid', async (req, res) => {
    const { uid } = req.params;
    const userData = req.body;

    try {
        const result = await userService.createUser(uid, userData);
        res.status(result.success ? 201 : 400).json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * Ruta para obtener un usuario por ID.
 * GET /api/usuarios/:uid
 */
router.get('/:uid', async (req, res) => {
    const { uid } = req.params;

    try {
        const result = await userService.getUser(uid);
        res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * Ruta para actualizar un usuario.
 * PUT /api/usuarios/:uid
 */
router.put('/:uid', async (req, res) => {
    const { uid } = req.params;
    const userData = req.body;

    try {
        const result = await userService.updateUser(uid, userData);
        res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * Ruta para eliminar un usuario.
 * DELETE /api/usuarios/:uid
 */
router.delete('/:uid', async (req, res) => {
    const { uid } = req.params;

    try {
        const result = await userService.deleteUser(uid);
        res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * Ruta para verificar si un usuario existe.
 * GET /api/usuarios/:uid/existe
 */
router.get('/:uid/existe', async (req, res) => {
    const { uid } = req.params;

    try {
        const exists = await userService.doesUserExist(uid);
        res.status(200).json({ success: true, exists });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
