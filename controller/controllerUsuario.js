const businessUsuario = require('../business/businessUsuario');


exports.consultartCPF = async (req, res) => {
    const cpf_usuario = req.params.cpf;

    try {
        const usuario = await businessUsuario.consultarCPF(cpf_usuario);
        res.status(200).json(usuario);
    }
    catch (err) {
        console.log(err)
        if (err.status) {
            res.status(err.status).json(err);
        }
        else {
            res.status(500).json({ message: "Erro nao identificado" });
        }
    }
}

exports.cadastro = async (req, res) => {
    const usuario = req.body;

    try {
        const usuario_cadastrado = await businessUsuario.cadastrarUsuario(usuario);
        res.status(200).json(usuario_cadastrado);
    }
    catch (err) {
        console.log(err)
        if (err.status) {
            res.status(err.status).json(err);
        }
        else {
            res.status(500).json({ message: "Erro nao identificado" });
        }
    }
}