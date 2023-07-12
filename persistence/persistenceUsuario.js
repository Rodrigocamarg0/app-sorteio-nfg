const {Client} = require('pg');

const conexao = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};


exports.consultaCPF = async (cpf) => {
    const sql = "SELECT * FROM usuario WHERE cpf=$1";
    const values = [cpf];
    console.log("Consulta CPF: ", cpf)

    const cliente = new Client(conexao);
    cliente.connect();

    try{
        const resultado = await cliente.query(sql, values);
        cliente.end();
        return(resultado.rows);        
    }
    catch (err) {
        let error = {};
        error.name = err.name;
        error.message = err.message;
        error.status = 500; 
        throw error; 
    }
}

exports.inserir = async (usuario) => {

    const { nome, cpf, celular, created_at } = usuario;

    var sql = 'SELECT insert_usuario($1, $2, $3, $4)';
    var values = [nome, cpf, celular, created_at]

    const cliente = new Client(conexao);
    cliente.connect();
    
    try{
        const resultado = await cliente.query(sql,values);
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

exports.totalDeNotas = async (cpf) => {

    var sql = 'SELECT count_notas_by_cpf($1)';
    var values = [cpf]

    const cliente = new Client(conexao);
    cliente.connect();
    
    try{
        const resultado = await cliente.query(sql,values);
        cliente.end();
        return(resultado.rows[0].count_notas_by_cpf);
    }
    catch(err) {
        let error = {};
        error.name = err.name;
        error.message = err.message;
        error.status = 500; 
        throw error; 
    }
}

exports.listUsuarios = async () => {

    var sql = 'SELECT * from list_users_with_notas_total()';

    const cliente = new Client(conexao);
    cliente.connect();
    
    try{
        const resultado = await cliente.query(sql);
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


