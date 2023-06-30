const express = require('express');
const rota = express.Router();

const controller = require('../controller/controllerNotas');

rota.post('/computarNota', controller.computarNota);

module.exports = rota;