const express = require('express');
const rota = express.Router();

rota.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
  });

 
module.exports = rota;

