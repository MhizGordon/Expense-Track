const express = require('express');
const { addIncome } = require('../controllers/income');

const router = express.Router();


router.post('/add-income', addIncome)

module.exports = router;