const express = require('express');
const router = express.Router();
const consumptionHistoryService = require('../services/consumptionHistoryService');
const errorHandler = require('../middleware/errorHandler');

/**
 * @swagger
 * /consumptionHistory/{uid}/all:
 *   get:
 *     summary: Obtiene todo el historial de consumo de un usuario.
 *     tags:
 *       - Historial de Consumo
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
 * @swagger
 * /consumptionHistory/{uid}/days:
 *   get:
 *     summary: Obtiene el historial de consumo de un usuario en un rango de días desde hoy.
 *     tags:
 *       - Historial de Consumo
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario.
 *       - in: query
 *         name: days
 *         required: true
 *         schema:
 *           type: integer
 *         description: Número de días desde hoy para limitar el historial.
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
 * @swagger
 * /consumptionHistory/{uid}:
 *   post:
 *     summary: Agrega un nuevo registro al historial de consumo de un usuario.
 *     tags:
 *       - Historial de Consumo
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
 *             $ref: '#/components/schemas/ConsumptionHistoryRecord'
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
 * @swagger
 * /consumptionHistory/{uid}/{recordId}:
 *   delete:
 *     summary: Elimina un registro específico del historial de consumo.
 *     tags:
 *       - Historial de Consumo
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
