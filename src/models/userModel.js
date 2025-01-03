// models/userModel.js

const { Timestamp } = require('firebase-admin/firestore');

/**
 * Enum para los roles disponibles en el sistema.
 * @readonly
 * @enum {string}
 */
const Roles = {
  ESTANDAR: "usuario",
  PAGADO: "tienda",
};

class UserModel {
  /**
   * Constructor para el modelo de usuario.
   * @param {Object} data - Datos del usuario.
   * @param {string} data.id - Uid del usuario.
   * @param {string} data.nombres - Nombre completo del usuario.
   * @param {string} data.email - Correo electrónico del usuario.
   * @param {Timestamp} data.fecha_registro - Fecha de registro del usuario (Firebase Timestamp).
   * @param {string} data.rol - Rol del usuario (estándar o pagado).
   * @param {Object} [data.ajustes] - Configuración personalizada del usuario.
   */
  constructor({ uid, nombres, email, fecha_registro, rol, ajustes }) {
    this.uid = uid || null;
    this.nombres = nombres || '';
    this.email = email || '';
    this.fecha_registro = fecha_registro || Timestamp.now(); // Timestamp de Firebase por defecto.
    this.rol = rol || Roles.ESTANDAR; // Valor predeterminado "usuario".
    this.ajustes = ajustes || {}; // Configuración personalizada, por defecto vacío.
  }

  /**
   * Valida los datos del usuario.
   * @param {Object} data - Datos del usuario.
   * @throws {Error} Si alguno de los campos obligatorios no está presente o es inválido.
   * @returns {boolean} Retorna true si los datos son válidos.
   */
  static validate(data) {
    if (!data.nombres) throw new Error('El campo "nombres" es obligatorio.');
    if (!data.email) throw new Error('El campo "email" es obligatorio.');
    if (!data.fecha_registro || !(data.fecha_registro instanceof Timestamp)) {
      throw new Error('El campo "fecha_registro" debe ser un Firebase Timestamp.');
    }
    if (!Object.values(Roles).includes(data.rol)) {
      throw new Error(`El campo "rol" debe ser uno de los siguientes valores: ${Object.values(Roles).join(', ')}`);
    }
    return true;
  }


  /**
   * Convierte la instancia a un objeto plano.
   * @returns {Object} Objeto plano con las propiedades del modelo.
   */
  toPlainObject() {
    return {
      uid: this.uid,
      nombres: this.nombres,
      email: this.email,
      fecha_registro: this.fecha_registro,
      rol: this.rol,
      ajustes: this.ajustes,
    };
  }
}

module.exports = { UserModel, Roles };
