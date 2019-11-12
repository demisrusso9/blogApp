const express = require('express');
const router = express.Router();
const mongoosee = require('mongoose');
require('../models/Categoria');
const Categoria = mongoosee.model('categorias');

router.get('/', (req, res) => {
    res.render('admin/index');
})

router.get('/posts', (req, res) => {
    res.send('Pagina de Posts ADMIN');
})

router.get('/categorias', (req, res) => {

    Categoria.find().then((categorias) => {
        res.render('admin/categorias', { categorias: categorias });
    }).catch((err) => {
        req.flash('error_msg', 'Houve um Erro ao listar');
        res.redirect('/admin')
    })
})

router.get('/categorias/add', (req, res) => {
    res.render('admin/addcategorias')
})

router.post('/categorias/nova', (req, res) => {
    //Validação de Form /Manual

    var error = [];

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        error.push({
            text: 'Nome Inválido'
        })
    }

    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        error.push({
            text: 'Slug Inválido'
        })
    }

    if (req.body.nome.length < 2) {
        error.push({ text: 'Nome é muito pequeno' })
    }

    if (error.length > 0) {
        res.render('admin/addcategorias', { error: error });
    } else {
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }

        new Categoria(novaCategoria).save().then(() => {
            req.flash('success_msg', 'Categoria Salva')
            res.redirect('/admin/categorias')
        }).catch((err) => {
            req.flash('error_msg', 'Erro ao salvar')
            res.redirect('/admin')
        })

    }
});

module.exports = router; //exporta rotas 