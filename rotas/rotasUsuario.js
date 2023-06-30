const express = require('express');
const rota = express.Router();

const controller = require('../controller/controllerUsuario');

rota.get('/:cpf', controller.consultartCPF);
rota.post('/cadastrar', controller.cadastro);


module.exports = rota;