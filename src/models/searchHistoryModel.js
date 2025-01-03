// models/searchHistoryModel.js

const { Timestamp } = require('firebase-admin/firestore');

class SearchHistoryModel {
  /**
   * Constructor para el modelo de historial de búsqueda.
   * @param {Object} data - Datos del historial de búsqueda.
   * @param {string} [data.id] - Identificador único generado por Firebase.
   * @param {Timestamp} data.fecha_busqueda - Fecha en que se realizó la búsqueda (Firebase Timestamp).
   * @param {string} data.id_producto - Identificador del producto buscado.
   * @param {boolean} data.redireccion_tienda - Indica si hubo redirección a una tienda.
   * @param {string} [data.id_tienda] - Identificador de la tienda (opcional).
   * @param {boolean} data.activo - Indica si el registro está activo.
   */
  constructor({ id, fecha_busqueda, id_producto, redireccion_tienda, id_tienda, activo }) {
    this.id = id || null; // Identificador único generado por Firebase.
    this.fecha_busqueda = fecha_busqueda || Timestamp.now(); // Timestamp de Firebase por defecto.
    this.id_producto = id_producto || '';
    this.redireccion_tienda = redireccion_tienda || false; // Por defecto, no hubo redirección.
    this.id_tienda = id_tienda || ''; // Valor opcional.
    this.activo = activo !== undefined ? activo : true; // Por defecto, está activo.
  }

  /**
   * Valida los datos del historial de búsqueda.
   * @param {Object} data - Datos del historial de búsqueda.
   * @throws {Error} Si alguno de los campos obligatorios no está presente o es inválido.
   * @returns {boolean} Retorna true si los datos son válidos.
   */
  static validate(data) {
    if (!data.fecha_busqueda || !(data.fecha_busqueda instanceof Timestamp)) {
      throw new Error('El campo "fecha_busqueda" debe ser un Firebase Timestamp.');
    }
    if (!data.id_producto) {
      throw new Error('El campo "id_producto" es obligatorio.');
    }
    if (typeof data.redireccion_tienda !== 'boolean') {
      throw new Error('El campo "redireccion_tienda" debe ser un valor booleano.');
    }
    return true;
  }

  /**
   * Convierte la instancia del modelo a un objeto plano.
   * @returns {Object} Objeto plano con las propiedades del modelo.
   */
  toPlainObject() {
    return {
      id: this.id,
      fecha_busqueda: this.fecha_busqueda,
      id_producto: this.id_producto,
      redireccion_tienda: this.redireccion_tienda,
      id_tienda: this.id_tienda,
      activo: this.activo,
    };
  }
}

module.exports = SearchHistoryModel;
