
const { google } = require("googleapis");
const businessSefaz = require('../business/businessSefaz');
const businessGoogle = require('../business/businessGoogle');


async function getAuthSheets() {
    const auth = new google.auth.GoogleAuth({
        keyFile: "controller/usgurisefaz-c736040454f6.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

    const client = await auth.getClient();

    const googleSheets = google.sheets({
        version: "v4",
        auth: client,
    });

    const spreadsheetId = "13S-QXgGxc4rPCN-ra6gcHCR-Fm5EOJCINdgTcV5TR7A";

    return {
        auth,
        client,
        googleSheets,
        spreadsheetId,
    };
}


exports.pegarValor = async (req, res) => {
    const idNFe = req.params.id;    
    
    try{
        const compra = await businessSefaz.listar(idNFe);
        maoe = await getAuthSheets()
        const createRow = await businessGoogle.create(compra, await getAuthSheets());
        console.log(compra)
        res.json(compra);                
    }
    catch (err) {
        console.log(err)
        if(err.status) {
            res.status(err.status).json(err);
        }
        else {
            res.status(500).json({message: "Erro nao identificado"});            
        }
    }
}


exports.getNota = async (req, res) => {
    const idNFe = req.params.id;    
    
    try{
        const nota = await businessSefaz.getNFe(idNFe);
        res.json({html: nota});                
    }
    catch (err) {
        console.log(err)
        if(err.status) {
            res.status(err.status).json(err);
        }
        else {
            res.status(500).json({message: "Erro nao identificado"});            
        }
    }
}

