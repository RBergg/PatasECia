const express = require('express');
const router = express.Router();
const tutoresRouter = require('./tutores');
const animaisRouter = require('./animais');

router.use('/api/tutores', tutoresRouter);
router.use('/api/animais', animaisRouter);

router.get('/', (req, res) => { res.send('API Patas & Cia. funcionando!'); });


module.exports = router; 
