const express = require('express');
const router = express.Router();
const userService = require('../services/userService');
const errorHandler = require('../middleware/errorHandler');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         uid:
 *           type: string
 *           description: ID único del usuario.
 *           example: "123456"
 *         nombres:
 *           type: string
 *           description: Nombre completo del usuario.
 *           example: "Juan Pérez"
 *         email:
 *           type: string
 *           description: Correo electrónico del usuario.
 *           example: "juan.perez@example.com"
 *         url_imagen:
 *           type: string
 *           description: URL de la imagen de perfil del usuario.
 *           example: ""
 *         fecha_nacimiento:
 *           type: object
 *           properties:
 *             _seconds:
 *               type: integer
 *               example: 1738042253
 *             _nanoseconds:
 *               type: integer
 *               example: 117000000
 *         fecha_registro:
 *           type: string
 *           format: date-time
 *           description: Fecha de registro del usuario.
 *           example: "2025-01-15T12:00:00.000Z"
 *         rol:
 *           type: string
 *           description: Rol del usuario.
 *           example: "usuario"
 *         ajustes:
 *           type: object
 *           properties:
 *             notificaciones:
 *               type: boolean
 *               example: true
 *             tema:
 *               type: string
 *               example: "oscuro"
 */

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
 *             type: object
 *             properties:
 *               uid:
 *                 type: string
 *                 description: Identificador único del usuario.
 *                 example: "123456"
 *               nombres:
 *                 type: string
 *                 description: Nombres del usuario.
 *                 example: "Juan Andres C"
 *               email:
 *                 type: string
 *                 description: Correo electrónico del usuario.
 *                 example: "juan.perez@example.com"
 *               url_imagen:
 *                 type: string
 *                 description: URL de la imagen del usuario.
 *                 example: ""
 *               fecha_nacimiento:
 *                 type: object
 *                 description: Fecha de nacimiento en formato TimeStamp de Firebase.
 *                 properties:
 *                   _seconds:
 *                     type: integer
 *                     example: 1738123242
 *                   _nanoseconds:
 *                     type: integer
 *                     example: 927000000
 *               fecha_registro:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha de registro en formato ISO 8601.
 *                 example: "2025-01-15T12:00:00.000Z"
 *               rol:
 *                 type: string
 *                 description: Rol del usuario.
 *                 example: "usuario"
 *               ajustes:
 *                 type: object
 *                 description: Configuraciones del usuario.
 *                 properties:
 *                   notificaciones:
 *                     type: boolean
 *                     example: true
 *                   tema:
 *                     type: string
 *                     example: "oscuro"
 *     responses:
 *       201:
 *         description: Usuario creado con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Usuario creado con éxito."
 *       400:
 *         description: Error al crear el usuario.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Error al crear el usuario."
 */
router.post('/', async (req, res, next) => {
    try {
        const { uid, ...userData } = req.body;
        if (!uid) {
            return res.status(400).json({ success: false, message: 'UID is required' });
        }
        const result = await userService.createUser(uid,userData);
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
 *         description: Usuario encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     uid:
 *                       type: string
 *                       example: "123456"
 *                     nombres:
 *                       type: string
 *                       example: "Juan Andres C"
 *                     email:
 *                       type: string
 *                       example: "juan.perez@example.com"
 *                     url_imagen:
 *                       type: string
 *                       example: ""
 *                     fecha_nacimiento:
 *                       type: object
 *                       description: Fecha de nacimiento en formato TimeStamp de Firebase.
 *                       properties:
 *                         _seconds:
 *                           type: integer
 *                           example: 1738123242
 *                         _nanoseconds:
 *                           type: integer
 *                           example: 927000000
 *                     fecha_registro:
 *                       type: string
 *                       format: date-time
 *                       description: Fecha de registro en formato ISO 8601.
 *                       example: "2025-01-15T12:00:00.000Z"
 *                     rol:
 *                       type: string
 *                       example: "usuario"
 *                     ajustes:
 *                       type: object
 *                       properties:
 *                         notificaciones:
 *                           type: boolean
 *                           example: true
 *                         tema:
 *                           type: string
 *                           example: "oscuro"
 *       404:
 *         description: Usuario no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Error"
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
 *             type: object
 *             properties:
 *               nombres:
 *                 type: string
 *                 description: Nombres del usuario.
 *                 example: "Juan Andres C"
 *               email:
 *                 type: string
 *                 description: Correo electrónico del usuario.
 *                 example: "juan.perez@example.com"
 *               url_imagen:
 *                 type: string
 *                 description: URL de la imagen del usuario.
 *                 example: ""
 *               fecha_nacimiento:
 *                 type: object
 *                 description: Fecha de nacimiento en formato TimeStamp de Firebase.
 *                 properties:
 *                   _seconds:
 *                     type: integer
 *                     example: 1738123242
 *                   _nanoseconds:
 *                     type: integer
 *                     example: 927000000
 *               ajustes:
 *                 type: object
 *                 description: Configuraciones del usuario.
 *                 properties:
 *                   notificaciones:
 *                     type: boolean
 *                     example: true
 *                   tema:
 *                     type: string
 *                     example: "oscuro"
 *     responses:
 *       200:
 *         description: Usuario actualizado con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                       example: true
 *                     message:
 *                       type: string
 *                       example: "Document updated successfully"
 *       400:
 *         description: Error al actualizar el usuario.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Error al actualizar el usuario."
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
 *         description: Resultado de la verificación de existencia del usuario.
 *         content:
 *           application/json:
 *             schema:
 *               type: boolean
 *               example: true
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
