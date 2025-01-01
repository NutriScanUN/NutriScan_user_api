// models/consumptionHistoryModel.js

const { Timestamp } = require('firebase-admin/firestore');

class ConsumptionHistoryModel {
  /**
   * Constructor para el modelo de historial de consumo.
   * @param {Object} data - Datos del historial de consumo.
   * @param {string} [data.id] - Identificador único generado por Firebase.
   * @param {string} data.id_producto - Identificador del producto consumido.
   * @param {Timestamp} data.fecha_consumo - Fecha en que se registró el consumo (Firebase Timestamp).
   * @param {number} data.cantidad_consumida - Cantidad consumida del producto.
   * @param {Object} data.nutrientes_ingeridos - Detalle de los nutrientes ingeridos (mapa clave-valor).
   * @param {boolean} data.activo - Indica si el registro está activo.
   */
  constructor({ id, id_producto, fecha_consumo, cantidad_consumida, nutrientes_ingeridos, activo }) {
    this.id = id || null; // Identificador único generado por Firebase.
    this.id_producto = id_producto || '';
    this.fecha_consumo = fecha_consumo || Timestamp.now(); // Timestamp de Firebase por defecto.
    this.cantidad_consumida = cantidad_consumida || 0; // Por defecto, 0.
    this.nutrientes_ingeridos = nutrientes_ingeridos || {}; // Por defecto, un objeto vacío.
    this.activo = activo !== undefined ? activo : true; // Por defecto, activo.
  }

  /**
   * Valida los datos del historial de consumo.
   * @param {Object} data - Datos del historial de consumo.
   * @throws {Error} Si alguno de los campos obligatorios no está presente o es inválido.
   * @returns {boolean} Retorna true si los datos son válidos.
   */
  static validate(data) {
    if (!data.id_producto) {
      throw new Error('El campo "id_producto" es obligatorio.');
    }
    if (!data.fecha_consumo || !(data.fecha_consumo instanceof Timestamp)) {
      throw new Error('El campo "fecha_consumo" debe ser un Firebase Timestamp.');
    }
    if (typeof data.cantidad_consumida !== 'number') {
      throw new Error('El campo "cantidad_consumida" debe ser un número.');
    }
    if (typeof data.nutrientes_ingeridos !== 'object') {
      throw new Error('El campo "nutrientes_ingeridos" debe ser un objeto.');
    }
    if (typeof data.activo !== 'boolean') {
      throw new Error('El campo "activo" debe ser un valor booleano.');
    }
    return true;
  }
}

module.exports = ConsumptionHistoryModel;
