import express from 'express';
import bodyParser from 'body-parser';

const app = express();

var mongoose = require('mongoose');
var Produto = require('./app/models/product');

//PERSISTÊNCIA
mongoose.connect('mongodb://localhost/bdCrud');


//Configuração do server para usar body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Definindo a porta via arquivo de configuração
var port = process.env.port || 3000;

//Definindo Rotas
var router = express.Router();//intercepta todas as rotas.

//Middleware
router.use(function (req, res, next) {
    //Aqui poderão ser implementadas rotinas de 
    //LOGs, VALIDAÇÕES, ERROs
    console.log("Interceptação pelo Middleware");
    next();
});

router.get('/',
    (req, res) => res.json({'message': 'rota teste OK'}));

router.route('/produtos')
    .post(function(req, res){
        var produto = new Produto();
        produto.nome = req.body.nome;
        produto.preco = req.body.preco;
        produto.descricao = req.body.descricao;

        produto.save(function(error){
            if(error)
                res.send("Erro ao tentar salvar produto" + error);

            res.status(201).json({message:'Produto inserido com sucesso'});   
        });
    })

router.route('/produtos')
        .get(function(req, res){
            Produto.find(function(err, prods){
                if(err)
                    res.send(err);

                res.status(200).json({
                    message:"produtos retornados",
                    produtos: prods
                });
            });
        })    
        
    router.get('/produtos/:id', function (req, res, next) {
        Produto.find({ _id: req.params.id }).lean().exec(function (e, docs) {
            res.json(docs);
            res.end();
        });
    });


    router.put('/produtos/:id', function (req, res, next) {
        Produto.findOneAndUpdate

    });

    router.delete('/produtos/:id', function (req, res, next) {
        Produto.find({ _id: req.params.id }).remove(function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                res.end();
                return;
            }
            res.json({success: true});
            res.end();
        });
    });

    router.put('/produtos/:id', function (req, res, next) {
        Produto.findOneAndUpdate({ _id: req.params.id }, req.body, { upsert: true }, function (err, doc) {
            if (err) {
                res.status(500).json({ error: err.message });
                res.end();
                return;
            }
            res.json(req.body);
            res.end();
        });
    });
    


//Vincular a aplicacao (app) com o motor de rotas
app.use('/api', router);

app.listen(port, () => {
    console.log('Server up and running!');

});

