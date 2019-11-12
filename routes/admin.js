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

    // Listar todas as categoria do database
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

router.get('/categorias/edit/:id', (req, res) => {
    Categoria.findOne({_id:req.params.id}).then((categoria) => {
        res.render('admin/editcategorias', {categoria: categoria})
    }).catch((err) => {
        req.flash('error_msg', 'Esta Categoria não existe');
        res.redirect('/admin/categorias');
    })
})

router.post('/categorias/edit', (req, res) => {
    Categoria.findOne({_id: req.body.id}).then((categoria) => {
        
        categoria.nome = req.body.nome
        categoria.slug = req.body.slug

        categoria.save().then(() => {
            req.flash('success_msg', 'Categoria Editada com Sucesso');
            res.redirect('/admin/categorias');
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro ao editar');
            res.redirect('/admin/categorias');
        })

    }).catch((err) => {
        req.flash('error_msg', 'Erro ao editar');
        res.redirect('/admin/categorias');
    }) 
})

module.exports = router; //exporta rotas 