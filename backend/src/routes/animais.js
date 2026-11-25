const express = require('express');
const router = express.Router();
const pool = require('../database/connection');

router.post('/', async (req, res) => {
    const dados = req.body;
    if (!dados.nome || !dados.especie || !dados.tutor_id) {
        return res.status(400).send('Dados obrigatórios ausentes');
    }

    try {
        const resultado = await pool.query('INSERT INTO animais (nome, especie, raca, data_nascimento, tutor_id) VALUES ($1,$2,$3,$4,$5) RETURNING id, nome, especie, raca, data_nascimento, tutor_id',
            [dados.nome, dados.especie, dados.raca, dados.data_nascimento, dados.tutor_id]);
        const animalCompleto = await pool.query('SELECT animais.*, tutores.nome AS tutor FROM animais INNER JOIN tutores ON animais.tutor_id = tutores.id WHERE animais.id = $1',
            [resultado.rows[0].id]);

        return res.status(201).send(animalCompleto.rows[0]);
    } catch (erro) {
        console.error(erro);
        if (erro.code === '23503') {
            return res.status(400).send('Tutor informado não encontrado.');
        }
        return res.status(500).send('Erro interno no servidor.');
    }
});

router.get('/', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT animais.*, tutores.nome AS tutor FROM animais INNER JOIN tutores ON animais.tutor_id = tutores.id;');
        res.send(resultado.rows)
    } catch (erro) {
        console.error(erro);
        return res.status(500).send('Erro interno no servidor.')
    }
});

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const resultado = await pool.query('SELECT id, nome, especie, raca, data_nascimento, tutor_id FROM animais WHERE id =$1',
            [id])
        if (resultado.rows.length === 0) {
            return res.status(404).send('Animal não encontrado.')
        }
        res.send(resultado.rows[0])
    } catch (erro) {
        console.error(erro);
        return res.status(500).send('Erro interno no servidor.')
    }
});

router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const dados = req.body;
    let resultado
    if (!dados.nome || !dados.especie || !dados.tutor_id) {
        return res.status(400).send('Dados obrigatórios ausentes.');
    }

    let animalCompleto
    try {
        resultado = await pool.query('UPDATE animais SET nome=$1, especie=$2, raca=$3, data_nascimento=$4,tutor_id=$5 WHERE id=$6 RETURNING id, nome, raca, data_nascimento, especie, tutor_id',
            [dados.nome, dados.especie, dados.raca, dados.data_nascimento, dados.tutor_id, id]
        );
        if (resultado.rowCount === 0) {

            return res.status(404).send('Animal não encontrado.');
        }
        animalCompleto = await pool.query('SELECT animais.*, tutores.nome AS tutor FROM animais INNER JOIN tutores ON animais.tutor_id = tutores.id WHERE animais.id = $1',
            [id]);

    } catch (erro) {
        console.error(erro);
        if (erro.code === '23503') {
            return res.status(400).send('O tutor informado não está cadastrado.')
        }
        return res.status(500).send('Erro interno no servidor.');
    }

    return res.status(200).send(animalCompleto.rows[0]);
});

router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    let resultado
    try {
        resultado = await pool.query('DELETE FROM animais WHERE id=$1', [id]);
    } catch (erro) {
        console.error(erro);
        return res.status(500).send('Erro interno no servidor.');
    }
    if (resultado.rowCount === 0) {
        return res.status(404).send('Animal não encontrado.');
    }
    return res.status(204).send();
});

module.exports = router;