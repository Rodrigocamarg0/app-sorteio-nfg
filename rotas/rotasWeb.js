const express = require('express');
const rota = express.Router();

rota.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
  });

rota.get('/termo', function(req, res) {
    res.sendFile(__dirname + '/termo.html');
    });

 
module.exports = rota;

