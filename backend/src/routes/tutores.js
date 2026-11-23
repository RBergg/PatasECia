const express = require('express');
const router = express.Router();
const pool = require('../database/connection');

router.get('/', async (req, res) => {
    const resultado = await pool.query('SELECT * FROM tutores');
    res.send(resultado.rows)
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const resultado = await pool.query('SELECT * FROM tutores WHERE id=$1', [id]);
    if (resultado.rows.length === 0) {
        return res.status(404).send('Tutor não encontrado.');
    }
    res.send(resultado.rows[0])
});

router.post('/', async (req, res) => {
    const dados = req.body;
    if (!dados.nome || !dados.telefone) {
        return res.status(400).send('Dados obrigatórios ausentes');
    }
    try {
        const resultado = await pool.query('INSERT INTO tutores (nome, telefone, email, endereco) VALUES($1, $2, $3, $4) RETURNING *',
            [dados.nome, dados.telefone, dados.email, dados.endereco]);
        return res.status(201).send(resultado.rows[0]);
    } catch (erro) {
        console.error(erro);
        return res.status(500).send('Erro interno no servidor.')
    }
});

router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const dados = req.body;
    let resultado;
    if (!dados.nome || !dados.telefone) {
        return res.status(400).send('Dados obrigatórios ausentes');
    }
    try {
        resultado = await pool.query('UPDATE tutores SET nome=$1,telefone=$2, email=$3, endereco=$4 WHERE id=$5 RETURNING *',
            [dados.nome, dados.telefone, dados.email, dados.endereco, id]);
    } catch (erro) {
        console.error(erro);
        return res.status(500).send('Erro interno no servidor.');
    }
    if (resultado.rowCount === 0) {
        return res.status(404).send('Tutor não encontrado.');
    }
    return res.status(200).send(resultado.rows[0]);
});

router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    let resultado
    try {
        resultado = await pool.query('DELETE FROM tutores WHERE id=$1', [id]);
    } catch (erro) {
        console.error(erro);
        if (erro.code === '23503') {
            return res.status(409).send('Não é possível excluir um tutor que possui animais vinculados.');
        }
        return res.status(500).send('Erro interno no servidor.');
    }
    if (resultado.rowCount === 0) {
        return res.status(404).send('Tutor não encontrado.');
    }
    return res.status(204).send();
});

module.exports = router;
