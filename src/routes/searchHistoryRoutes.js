const express = require('express');
const { getDocument } = require('../services/firestoreService');
const router = express.Router();

router.get('/document/:collection/:docId', async (req, res) => {
    const { collection, docId } = req.params;

    const response = await getDocument(collection, docId);
    if (response.success) {
        return res.status(200).json(response.data);
    } else {
        return res.status(404).json({ error: response.message });
    }
});

module.exports = router;
