const express = require('express');
const router = express.Router();
const consumptionHistoryService = require('../services/consumptionHistoryService');
const errorHandler = require('../middlewares/errorHandler');

/**
 * Obtiene todo el historial de consumo de un usuario.
 */
router.get('/:uid/all', async (req, res, next) => {
    try {
        const { uid } = req.params;
        const { orderDirection = 'asc' } = req.query;
        const result = await consumptionHistoryService.getAllConsumptionHistory(uid, orderDirection);
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
 * Obtiene el historial de consumo de un usuario en un rango de días desde hoy.
 */
router.get('/:uid/days', async (req, res, next) => {
    try {
        const { uid } = req.params;
        const { days, orderDirection = 'asc' } = req.query;
        const result = await consumptionHistoryService.getConsumptionHistoryByDays(uid, parseInt(days), orderDirection);
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
 * Agrega un nuevo registro al historial de consumo de un usuario.
 */
router.post('/:uid', async (req, res, next) => {
    try {
        const { uid } = req.params;
        const data = req.body;
        const result = await consumptionHistoryService.addConsumptionHistoryRecord(uid, data);
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
 * Elimina un registro específico del historial de consumo.
 */
router.delete('/:uid/:recordId', async (req, res, next) => {
    try {
        const { uid, recordId } = req.params;
        const collectionPath = `/usuarios/${uid}/historial_consumo`;
        const result = await consumptionHistoryService.deleteConsumptionHistoryRecord(collectionPath, recordId);
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
