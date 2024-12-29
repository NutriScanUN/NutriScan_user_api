const db = require('../config/firebase');

const getDocument = async (collection, docId) => {
    try {
        const docRef = db.collection(collection).doc(docId);
        const doc = await docRef.get();

        if (!doc.exists) {
            return { success: false, message: 'Document not found' };
        }

        return { success: true, data: doc.data() };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

module.exports = { getDocument };
