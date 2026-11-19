const express = require('express');
const router = express.Router();
const tutoresRouter = require('./tutores');

router.use('/api/tutores', tutoresRouter);

router.get('/', (req, res) => { res.send('API Patas & Cia. funcionando!'); });


module.exports = router; 
