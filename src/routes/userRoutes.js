const express = require('express');
const router = express.Router();
const userService = require('../services/userService');
const errorHandler = require('../middleware/errorHandler');

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Crea un nuevo usuario.
 *     tags:
 *       - Usuarios
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Usuario creado con éxito.
 *       400:
 *         description: Error al crear el usuario.
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
        next(error);
    }
});

/**
 * @swagger
 * /users/{uid}:
 *   get:
 *     summary: Obtiene un usuario por UID.
 *     tags:
 *       - Usuarios
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: UID del usuario a buscar.
 *     responses:
 *       200:
 *         description: Información del usuario obtenida con éxito.
 *       404:
 *         description: Usuario no encontrado.
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
 * @swagger
 * /users/{uid}:
 *   put:
 *     summary: Actualiza un usuario existente.
 *     tags:
 *       - Usuarios
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: UID del usuario a actualizar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Usuario actualizado con éxito.
 *       400:
 *         description: Error al actualizar el usuario.
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
 * @swagger
 * /users/{uid}:
 *   delete:
 *     summary: Elimina un usuario por UID.
 *     tags:
 *       - Usuarios
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: UID del usuario a eliminar.
 *     responses:
 *       200:
 *         description: Usuario eliminado con éxito.
 *       404:
 *         description: Usuario no encontrado.
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
 * @swagger
 * /users/{uid}/exists:
 *   get:
 *     summary: Verifica si un usuario existe por UID.
 *     tags:
 *       - Usuarios
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: UID del usuario.
 *     responses:
 *       200:
 *         description: Resultado de la verificación.
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
