const express = require('express')
const app = express()
const port = process.env.PORT || 3000
require('dotenv').config()

const cors = require('cors');


app.use(cors());
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(express.static('rotas')) 

  
const compraRota = require('./rotas/rotasSefaz');
app.use('/api/sefaz', compraRota);

const usuarioRota = require('./rotas/rotasUsuario');
app.use('/api/usuario', usuarioRota);

const notaRota = require('./rotas/rotasNotas');
app.use('/api/nota', notaRota);

const webRota = require('./rotas/rotasWeb');
app.use('/web', webRota);



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})