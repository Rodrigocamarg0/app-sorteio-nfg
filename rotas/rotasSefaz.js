const express = require('express');
const rota = express.Router();

const controller = require('../controller/controllerSefaz');
//const controGoogle = require('./business/businessGoogleSheets');


rota.get('/:id', controller.pegarValor);
rota.get('/cadastrar/:id', controller.cadastrarNota);
rota.get('/getNota/:id', controller.getNota);


module.exports = rota;