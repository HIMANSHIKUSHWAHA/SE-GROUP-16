const express = require('express');
const router = express.Router();
const {
    findEntity,
    updateUser,
    updateProfessional,
    getUserFields,
    getProfessionalFields
} = require('../controllers/settings/settingsController');

router.get('/entity/:id', async (req, res) => {
    const { id } = req.params;
    const result = await findEntity(id);
    res.status(result.status).json(result.json);
});

router.put('/updateUser/:id', async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    const result = await updateUser(id, updateData);
    res.status(result.status).json(result.json);
});

router.put('/updateProfessional/:id', async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    const result = await updateProfessional(id, updateData);
    res.status(result.status).json(result.json);
});

router.get('/userfields/:id', async (req, res) => {
    const { id } = req.params;
    const result = await getUserFields(id);
    res.status(result.status).json(result.json);
});

router.get('/professionalfields/:id', async (req, res) => {
    const { id } = req.params;
    const result = await getProfessionalFields(id);
    res.status(result.status).json(result.json);
});

module.exports = router;