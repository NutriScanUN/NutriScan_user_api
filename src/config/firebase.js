const admin = require('firebase-admin');
const path = require('path');

// Inicializar Firebase Admin SDK
const serviceAccountPath = path.join(__dirname, '../../nutriscan-71493-firebase-adminsdk-ugmom-e4fbdbaa0b.json');

admin.initializeApp({
    credential: admin.credential.cert(require(serviceAccountPath)),
});

const db = admin.firestore();

module.exports = db;
