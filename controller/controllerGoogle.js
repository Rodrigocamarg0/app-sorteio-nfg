

const businessGoogle = require('../business/businessGoogle');


exports.create = async (req, res) => {
    const newRow = req.params.id;    
    
    try{
        const compra = await businessGoogle.create(newRow);
        res.json(compra);                
    }
    catch (err) {
        if(err.status) {
            res.status(err.status).json(err);
        }
        else {
            res.status(500).json({message: "Erro nao identificado"});            
        }
    }
}