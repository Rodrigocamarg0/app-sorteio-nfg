const express = require('express');
const rota = express.Router();

const controller = require('../controller/controllerUsuario');

rota.get('/:cpf', controller.consultartCPF);
rota.post('/cadastrar', controller.cadastro);
rota.get('/listar/tudo', controller.listUsuarios);



module.exports = rota;