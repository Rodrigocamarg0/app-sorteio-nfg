const {Client} = require('pg');

const conexao = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

exports.computarNota = async (nota) => {

    const { usuarioId, codigo, loja, valor, data } = nota;
    console.log(usuarioId)
    var sql = 'SELECT add_item_to_notas($1, $2, $3, $4, $5)';
    var values = [usuarioId, codigo, loja, valor, data]

    const cliente = new Client(conexao);
    cliente.connect();
    
    try{
        const resultado = await cliente.query(sql,values);
        console.log('Item added to notas successfully!');
        cliente.end();
        return(resultado.rows);
    }
    catch(err) {
        let error = {};
        error.name = err.name;
        error.message = err.message;
        error.status = 500; 
        throw error; 
    }
}