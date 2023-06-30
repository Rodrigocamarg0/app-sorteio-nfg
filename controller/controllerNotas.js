const businessNotas = require('../business/businessNotas');


exports.computarNota = async (req, res) => {
    const nota = req.body;
    try {
        const notaComputada = await businessNotas.computarNota(nota);
        res.status(200).json(notaComputada);
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