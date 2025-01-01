const express = require('express');
const router = express.Router();
const searchHistoryService = require('../services/searchHistoryService');
const errorHandler = require('../middlewares/errorHandler');

/**
 * Obtiene todo el historial de búsqueda de un usuario con un límite.
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
 * Obtiene una cantidad específica de registros del historial de búsqueda de un usuario.
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
 * Obtiene todo el historial de búsqueda de un usuario, sin límite.
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
 * Agrega un nuevo registro al historial de búsqueda de un usuario.
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
 * Elimina un registro específico del historial de búsqueda.
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
