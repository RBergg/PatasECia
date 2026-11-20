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

router.post('/', async (req, res) => {
    const dados = req.body;
    if (!dados.nome || !dados.telefone) {
        return res.status(400).send('Dados obrigatórios ausentes');
    }
    try {
        const resultado = await pool.query('INSERT INTO tutores (nome, telefone) VALUES($1, $2) RETURNING id, nome, telefone',
            [dados.nome, dados.telefone]);
        return res.status(201).send(resultado.rows[0]);
    } catch (erro) {
        console.error(erro);
        return res.status(500).send('Erro interno no servidor.')
    }
});

module.exports = router;
