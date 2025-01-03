const express = require('express');
const router = express.Router();
const searchHistoryService = require('../services/searchHistoryService');
const errorHandler = require('../middleware/errorHandler');

/**
 * @swagger
 * /searchHistory/{uid}/limit:
 *   get:
 *     summary: Obtiene todo el historial de búsqueda de un usuario con un límite.
 *     tags:
 *       - Historial de Búsqueda
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario.
 *       - in: query
 *         name: limit
 *         required: true
 *         schema:
 *           type: integer
 *         description: Límite de registros a devolver.
 *       - in: query
 *         name: orderDirection
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Dirección de ordenamiento ('asc' o 'desc').
 *     responses:
 *       200:
 *         description: Historial obtenido con éxito.
 *       404:
 *         description: Historial no encontrado.
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
 * /searchHistory/{uid}/count:
 *   get:
 *     summary: Obtiene una cantidad específica de registros del historial de búsqueda de un usuario.
 *     tags:
 *       - Historial de Búsqueda
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario.
 *       - in: query
 *         name: count
 *         required: true
 *         schema:
 *           type: integer
 *         description: Número de registros a devolver.
 *       - in: query
 *         name: orderDirection
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Dirección de ordenamiento ('asc' o 'desc').
 *     responses:
 *       200:
 *         description: Registros obtenidos con éxito.
 *       404:
 *         description: Historial no encontrado.
 */
router.get('/:uid/count', async (req, res, next) => {
    try {
        const { uid } = req.params;
        const { count, orderDirection = 'asc' } = req.query;
        const result = await searchHistoryService.getSearchHistoryByCount(uid, parseInt(count), orderDirection);
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
 * /searchHistory/{uid}/all:
 *   get:
 *     summary: Obtiene todo el historial de búsqueda de un usuario, sin límite.
 *     tags:
 *       - Historial de Búsqueda
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario.
 *       - in: query
 *         name: orderDirection
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Dirección de ordenamiento ('asc' o 'desc').
 *     responses:
 *       200:
 *         description: Historial obtenido con éxito.
 *       404:
 *         description: Historial no encontrado.
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
 * /searchHistory/{uid}:
 *   post:
 *     summary: Agrega un nuevo registro al historial de búsqueda de un usuario.
 *     tags:
 *       - Historial de Búsqueda
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SearchHistoryRecord'
 *     responses:
 *       201:
 *         description: Registro agregado con éxito.
 *       400:
 *         description: Error al agregar el registro.
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
 * /searchHistory/{uid}/{recordId}:
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
