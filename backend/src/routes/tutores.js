const express = require('express');
const router = express.Router();
const pool = require('../database/connection');

router.get('/', async (req, res) => {
    const resultado = await pool.query('SELECT id,nome,telefone FROM tutores');
    res.send(resultado.rows)
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const resultado = await pool.query('SELECT id,nome,telefone FROM tutores WHERE id=$1', [id]);
    if (resultado.rows.length === 0) {
        return res.status(404).send('Tutor não encontrado');
    }
    res.send(resultado.rows)
});

module.exports = router;
