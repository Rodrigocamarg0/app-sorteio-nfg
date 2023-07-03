const persistenceUsuario = require('../persistence/persistenceUsuario');


exports.consultarCPF = async (cpf) => {
    try {
        const usuario = await persistenceUsuario.consultaCPF(cpf);
        if (usuario && usuario.length > 0) {
            usuario[0].totalNotas  = await persistenceUsuario.totalDeNotas(cpf);
            return usuario;
        }
        else {
            let erro = new Error();
            erro.message = "CPF não encontrado";
            erro.status = 404;
            console.log(cpf)
            erro.cpf = cpf;
            throw erro;
        }
    } catch (err) {
        throw err;
    }
}

exports.cadastrarUsuario = async (usuario) => {
    try {
        const consulta = await persistenceUsuario.consultaCPF(usuario.cpf);
        if (consulta.length == 0) {
            const usuarioCadastrado = await persistenceUsuario.inserir(usuario);
            return usuarioCadastrado;
        }
        else {
            let erro = new Error();
            erro.message = "CPF já cadastrado";
            erro.status = 409;
            throw erro;
        }
    } catch (err) {
        throw err;
    }
}