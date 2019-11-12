// Loading Modules
const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const app = express();
const admin = require('./routes/admin'); // chamar grupo de rotas de outro arquivo
const path = require('path'); //vem com o node, modulo de diretório, manipulação de pastas
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');

// ----- Config
    // Session
    app.use(session({
        secret: 'node123', //chave da sessão
        resave: true,
        saveUninitialized: true
    }))

    // Flash
    app.use(flash());

    //Middleware
    app.use((req, res, next) => {
        res.locals.success_msg = req.flash('success_msg');
        res.locals.error_msg = req.flash('error_msg');
        next();
    })

    //BodyParser 
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    //Handlebars
    app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
    app.set('view engine', 'handlebars');

    //Public, pasta de arquivos estaticos
    //tells the express that the folder 'public' stores all the static files,
    app.use(express.static(path.join(__dirname, 'public')));

    // Mongoose
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/BlogApp').then(() => {
        console.log('---------- Database: Connected');
    }).catch(err => {
        console.log('Err: ' + err);
    })

// ----- END Config

// Rotas
app.get('/', (req, res) => {
    res.send('Rota Principal')
})
app.get('/posts', (req, res) => {
    res.send('Lista de Posts')
})

app.use('/admin', admin); //tem q criar um prefixo // chamar grupo de rotas de outro arquivo

// Outros   
const PORT = 3000;
app.listen(PORT, () => {
    console.log('---------- Server: Running');
});
