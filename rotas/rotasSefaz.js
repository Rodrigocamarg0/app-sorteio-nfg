const express = require('express');
const rota = express.Router();

const controller = require('../controller/controllerSefaz');
//const controGoogle = require('./business/businessGoogleSheets');



// sendFile will go here
rota.get('/:id', controller.pegarValor);
// sendFile will go here
rota.get('/getNota/:id', controller.getNota);


module.exports = rota;