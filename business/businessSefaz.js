const axios = require('axios');
const cheerio = require('cheerio');
const xpath = require("xpath-html");


exports.listar = async (idNFe) => {
    try {
        let compra = {}

        await axios
        .get(`https://www.sefaz.rs.gov.br/ASP/AAE_ROOT/NFE/SAT-WEB-NFE-NFC_QRCODE_1.asp?p=${idNFe}`)
        .then(res => {
            let cpf, nome
            
            $ = cheerio.load(res.data);
            
            const groupCompra = xpath.fromPageSource($.html()).findElement("//div[@id='nfce']");
            const nodesCompra = xpath.fromNode(groupCompra).findElements("//td[@class='NFCDetalhe_Item']");
            const nodesLoja = xpath.fromNode(groupCompra).findElements("//td[@class='NFCCabecalho_SubTitulo']");
            
            const nome_cpf = nodesLoja[6].getText()
            const valor_pago = parseFloat(nodesCompra[nodesCompra.length-7].getText().replace(',','.'))
            const valor_descontos = parseFloat(nodesCompra[nodesCompra.length-5].getText().replace(',','.'))
            const valor_total = (valor_pago - valor_descontos).toFixed(2)

            const cpf_name_regex = /\s*CPF:\s*(\d{3}\.\d{3}\.\d{3}-\d{2})\s*-\s*([^\n]+)/;
            const match = nome_cpf.match(cpf_name_regex);

            if (match) {
            cpf = match[1];
            nome = match[2].trim().replace(/\s+/g, ' ');
            console.log('CPF:', cpf);
            console.log('Nome:', nome);
            }

            compra = {
                valor_total: valor_total,
                loja: nodesLoja[0].getText(),                 
                data: nodesLoja[2].getText().substring(nodesLoja[2].getText().length - 19),
                cpf: cpf,
                nome: nome
            }
        })
        .catch(error => {
            console.error(error);
        });
       
        return compra;
        
    }
    catch(err) {
        throw err;
    }
}

exports.getNFe = async (idNFe) => {
    try {
        let respNFe = "";
        console.log(idNFe);
        await axios
        .get(`https://www.sefaz.rs.gov.br/ASP/AAE_ROOT/NFE/SAT-WEB-NFE-NFC_QRCODE_1.asp?p=${idNFe}`)
        .then(res => {
            $ = cheerio.load(res.data);
            const groupCompra = xpath.fromPageSource($.html()).findElement("//div[@id='nfce']");
            const nodesCompra = xpath.fromNode(groupCompra).findElements("//table[@id='respostaWS']");
            respNFe = nodesCompra
            //groupCompra = xpath.fromNode(groupCompra).findElements("//td[@class='NFCDetalhe_Item']");
            
        })
        .catch(error => {
            console.error(error);
        });
       
        return respNFe.toString();
        
    }
    catch(err) {
        throw err;
    }
}

