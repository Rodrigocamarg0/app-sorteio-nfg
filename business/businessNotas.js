const persistenceNotas = require('../persistence/persistenceNotas');
const persistenceUsuario = require('../persistence/persistenceUsuario');


exports.computarNota = async (nota) => {
    try {


        const usuario = await persistenceUsuario.consultaCPF(nota.cpf);
        if (usuario && usuario.length > 0) {
            nota.usuarioId = usuario[0].usuario_id
            console.log(nota)
            const notaComputada = await persistenceNotas.computarNota(nota);
            if (notaComputada) {
                return notaComputada;
            }
            else {
                let erro = new Error();
                erro.message = "Nota já cadastrada!";
                erro.status = 404;
                throw erro;
            }
        }
        else {
            let erro = new Error();
            erro.message = "CPF não encontrado!";
            erro.cpf = nota.cpf;
            erro.status = 404;
            throw erro;
        }
    } catch (err) {
        throw err;
    }
}