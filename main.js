const express = require('express')
const app = express()
const port = process.env.PORT || 3000


app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(express.static('rotas')) 

  
const compraRota = require('./rotas/rotasSefaz');
app.use('/api/sefaz', compraRota);

const webRota = require('./rotas/rotasWeb');
app.use('/web', webRota);



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})