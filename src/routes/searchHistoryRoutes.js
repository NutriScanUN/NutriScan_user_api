const express = require('express');
const router = express.Router();
const searchHistoryService = require('../services/searchHistoryService');
const errorHandler = require('../middleware/errorHandler');

/**
 * @swagger
 * components:
 *   schemas:
 *     SearchHistory:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Identificador único del registro de historial de búsqueda.
 *           example: "yLz21syVA4tjZMpCyGQz"
 *         fecha_busqueda:
 *           type: object
 *           description: Fecha en la que se realizó la búsqueda (timestamp de Firebase).
 *           properties:
 *             _seconds:
 *               type: integer
 *               description: Valor de los segundos en el timestamp de Firebase.
 *               example: 0
 *             _nanoseconds:
 *               type: integer
 *               description: Valor de los nanosegundos en el timestamp de Firebase.
 *               example: 0
 *         id_producto:
 *           type: string
 *           description: Identificador único del producto que fue buscado.
 *           example: "string"
 *         redireccion_tienda:
 *           type: boolean
 *           description: Indica si hubo redirección a una tienda después de la búsqueda.
 *           example: false
 *         id_tienda:
 *           type: string
 *           description: Identificador único de la tienda a la cual se redirigió al usuario (opcional).
 *           example: "string"
 *         activo:
 *           type: boolean
 *           description: Indica si el registro está activo o no.
 *           example: true
 */


/**
 * @swagger
 * /search-history/{uid}/limit:
 *   get:
 *     summary: Obtiene el historial de búsqueda de un usuario con un límite de resultados.
 *     tags:
 *       - Historial de Búsqueda
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: UID del usuario para el cual se obtiene el historial de búsqueda.
 *       - in: query
 *         name: limit
 *         required: true
 *         schema:
 *           type: integer
 *         description: Límite de resultados a devolver.
 *       - in: query
 *         name: orderDirection
 *         required: false
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Dirección de ordenamiento por fecha de búsqueda (ascendente o descendente). Default es 'asc'.
 *     responses:
 *       200:
 *         description: Historial de búsqueda con el límite especificado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "yLz21syVA4tjZMpCyGQz"
 *                       fecha_busqueda:
 *                         type: object
 *                         properties:
 *                           seconds:
 *                             type: integer
 *                             example: 0
 *                           nanoseconds:
 *                             type: integer
 *                             example: 0
 *                       id_producto:
 *                         type: string
 *                         example: "string"
 *                       redireccion_tienda:
 *                         type: boolean
 *                         example: false
 *                       id_tienda:
 *                         type: string
 *                         example: "string"
 *                       activo:
 *                         type: boolean
 *                         example: true
 *       404:
 *         description: No se encontraron documentos en el historial de búsqueda.
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
 *                   example: "No documents found"
 */
router.get('/:uid/limit', async (req, res, next) => {
    try {
        const { uid } = req.params;
        const { limit, orderDirection = 'asc' } = req.query;
        const result = await searchHistoryService.getSearchHistoryWithLimit(uid, parseInt(limit), orderDirection);
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
 * /search-history/{uid}/{days}:
 *   get:
 *     summary: Obtiene el historial de búsqueda de un usuario para los últimos días especificados.
 *     tags:
 *       - Historial de Búsqueda
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: UID del usuario para el cual se obtiene el historial de búsqueda.
 *       - in: path
 *         name: days
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Número de días antes del día actual para el cual se desea obtener el historial de búsqueda. El valor mínimo es 1, lo que significa todos los registros de hoy.
 *     responses:
 *       200:
 *         description: Historial de búsqueda de los últimos días especificados.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "yLz21syVA4tjZMpCyGQz"
 *                       fecha_busqueda:
 *                         type: object
 *                         properties:
 *                           seconds:
 *                             type: integer
 *                             example: 0
 *                           nanoseconds:
 *                             type: integer
 *                             example: 0
 *                       id_producto:
 *                         type: string
 *                         example: "string"
 *                       redireccion_tienda:
 *                         type: boolean
 *                         example: false
 *                       id_tienda:
 *                         type: string
 *                         example: "string"
 *                       activo:
 *                         type: boolean
 *                         example: true
 *       404:
 *         description: No se encontraron registros para el rango de días especificado.
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
 *                   example: "No documents found"
 */
router.get('/:uid/:days', async (req, res, next) => {
    try {
        const { uid, days } = req.params;
        const result = await searchHistoryService.getSearchHistoryByDays(uid, parseInt(days), 'asc');
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
 * /search-history/{uid}/all:
 *   get:
 *     summary: Obtener todo el historial de búsqueda de un usuario.
 *     description: Devuelve todos los registros del historial de búsqueda para el usuario especificado por su UID, con la opción de ordenar por fecha.
 *     tags:
 *       - Historial de Búsqueda
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: UID del usuario cuyo historial de búsqueda se desea obtener.
 *       - in: query
 *         name: orderDirection
 *         required: false
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Dirección de ordenamiento por fecha de búsqueda (ascendente o descendente). Por defecto, se usa 'asc'.
 *     responses:
 *       200:
 *         description: Historial de búsqueda obtenido con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: Identificador único del registro.
 *                       fecha_busqueda:
 *                         type: object
 *                         properties:
 *                           seconds:
 *                             type: integer
 *                             description: Segundos del Firebase Timestamp.
 *                           nanoseconds:
 *                             type: integer
 *                             description: Nanosegundos del Firebase Timestamp.
 *                       id_producto:
 *                         type: string
 *                         description: Identificador del producto buscado.
 *                       redireccion_tienda:
 *                         type: boolean
 *                         description: Indica si hubo redirección a una tienda.
 *                       id_tienda:
 *                         type: string
 *                         description: Identificador de la tienda (opcional).
 *                       activo:
 *                         type: boolean
 *                         description: Indica si el registro está activo.
 *                 example:
 *                   success: true
 *                   data:
 *                     - id: "yLz21syVA4tjZMpCyGQz"
 *                       fecha_busqueda:
 *                         seconds: 0
 *                         nanoseconds: 0
 *                       id_producto: "string"
 *                       redireccion_tienda: false
 *                       id_tienda: "string"
 *                       activo: true
 *                     - id: "1pjI90vRlVoBl0BUgz8R"
 *                       fecha_busqueda:
 *                         seconds: 1700000000
 *                         nanoseconds: 0
 *                       id_producto: "producto123"
 *                       redireccion_tienda: true
 *                       id_tienda: "tienda456"
 *                       activo: true
 *       404:
 *         description: Historial de búsqueda no encontrado.
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
 *                   example: "No search history found for the user."
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/:uid/all', async (req, res, next) => {
    try {
        const { uid } = req.params;
        const { orderDirection = 'asc' } = req.query;
        const result = await searchHistoryService.getAllSearchHistory(uid, orderDirection);
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
 * /search-history/{uid}:
 *   post:
 *     summary: Añadir un registro al historial de búsqueda de un usuario.
 *     description: Agrega un nuevo registro de historial de búsqueda para el usuario especificado por su UID.
 *     tags:
 *       - Historial de Búsqueda
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: UID del usuario al que se añadirá el registro del historial de búsqueda.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fecha_busqueda:
 *                 type: object
 *                 properties:
 *                   seconds:
 *                     type: integer
 *                     description: Segundos del Firebase Timestamp.
 *                   nanoseconds:
 *                     type: integer
 *                     description: Nanosegundos del Firebase Timestamp.
 *                 description: Fecha en que se realizó la búsqueda (Firebase Timestamp).
 *               id_producto:
 *                 type: string
 *                 description: Identificador del producto buscado.
 *               redireccion_tienda:
 *                 type: boolean
 *                 description: Indica si hubo redirección a una tienda.
 *               id_tienda:
 *                 type: string
 *                 description: Identificador de la tienda (opcional).
 *               activo:
 *                 type: boolean
 *                 description: Indica si el registro está activo.
 *             required:
 *               - fecha_busqueda
 *               - id_producto
 *               - redireccion_tienda
 *               - activo
 *     responses:
 *       201:
 *         description: Registro añadido con éxito al historial de búsqueda.
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
 *                   example: "Search history record added successfully"
 *                 data:
 *                   type: object
 *                   description: Detalles del registro agregado.
 *       400:
 *         description: Error al añadir el registro al historial.
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
 *                   example: "Failed to add search history record"
 *       500:
 *         description: Error interno del servidor.
 */
router.post('/:uid', async (req, res, next) => {
    try {
        const { uid } = req.params;
        const data = req.body;
        const result = await searchHistoryService.addSearchHistoryRecord(uid, data);
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
 * /search-history/{uid}/{recordId}:
 *   delete:
 *     summary: Elimina un registro específico del historial de búsqueda.
 *     tags:
 *       - Historial de Búsqueda
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario.
 *       - in: path
 *         name: recordId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del registro a eliminar.
 *     responses:
 *       200:
 *         description: Registro eliminado con éxito.
 *       404:
 *         description: Registro no encontrado.
 */
router.delete('/:uid/:recordId', async (req, res, next) => {
    try {
        const { uid, recordId } = req.params;
        const collectionPath = `/usuarios/${uid}/historial_busqueda`;
        const result = await searchHistoryService.deleteSearchHistoryRecord(collectionPath, recordId);
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(404).json(result);
        }
    } catch (error) {
        next(error);
    }
});

// Middleware de manejo de errores
router.use(errorHandler);

module.exports = router;
