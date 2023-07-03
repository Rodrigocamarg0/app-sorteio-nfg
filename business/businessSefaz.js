const axios = require('axios');
const cheerio = require('cheerio');
const xpath = require("xpath-html");
const businessGoogle = require('../business/businessGoogle');
const businessNotas = require('../business/businessNotas');


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
                const valor_pago = parseFloat(nodesCompra[nodesCompra.length - 7].getText().replace(',', '.'))
                const valor_descontos = parseFloat(nodesCompra[nodesCompra.length - 5].getText().replace(',', '.'))
                const valor_total = (valor_pago - valor_descontos).toFixed(2)

                const cpf_name_regex = /\s*CPF:\s*(\d{3}\.\d{3}\.\d{3}-\d{2})\s*-\s*([^\n]+)/;
                const match = nome_cpf.match(cpf_name_regex);

                if (match) {
                    cpf = match[1].replaceAll(".", "").replaceAll("-", "");
                    nome = match[2].trim().replace(/\s+/g, ' ');
                    console.log('CPF:', cpf);
                    console.log('Nome:', nome);
                }

                compra = {
                    valor_total: valor_total,
                    loja: nodesLoja[0].getText(),
                    data: nodesLoja[2].getText().substring(nodesLoja[2].getText().length - 19),
                    cpf: cpf,
                    nome: nome,
                    nota_id: idNFe
                }
            })
            .catch(error => {
                console.error(error);
            });

        return compra;

    }
    catch (err) {
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
    catch (err) {
        throw err;
    }
}


exports.cadastrarNota = async (idNFe) => {
    try {
        let compra = {}

        await axios
            .get(`https://www.sefaz.rs.gov.br/ASP/AAE_ROOT/NFE/SAT-WEB-NFE-NFC_QRCODE_1.asp?p=${idNFe}`)
            .then(res => {
                let cpf,nome = "NÃO ENCONTRADO"

                $ = cheerio.load(res.data);

                const groupCompra = xpath.fromPageSource($.html()).findElement("//div[@id='nfce']");
                const nodesCompra = xpath.fromNode(groupCompra).findElements("//td[@class='NFCDetalhe_Item']");
                const nodesLoja = xpath.fromNode(groupCompra).findElements("//td[@class='NFCCabecalho_SubTitulo']");

                const nome_cpf = nodesLoja[6].getText()
                const valor_pago = parseFloat(nodesCompra[nodesCompra.length - 7].getText().replace(',', '.'))
                const valor_descontos = parseFloat(nodesCompra[nodesCompra.length - 5].getText().replace(',', '.'))
                const valor_total = (valor_pago - valor_descontos).toFixed(2)

                const regex = /(\d{3}\.\d{3}\.\d{3}-\d{2})/;
                
                let match

                console.log(nome_cpf)

                try {
                    match = nome_cpf.match(regex);
                    console.log(match)
                    if (match) {
                      cpf = match[0];
                      cpf = cpf.replace(/\./g, "");
                      cpf = cpf.replace(/-/g, "");
                    }
                    nome = nome_cpf.replace(/^.*-\s*/, '').trim().replace(/\s+/g, ' ');
                  } catch (error) {
                    console.log('Erro ao processar a string:', error);
                  }
                  console.log('CPF:', cpf);
                  console.log('Nome:', nome);
               

                compra = {
                    valor_total: valor_total,
                    valor: valor_total,
                    loja: nodesLoja[0].getText(),
                    // data: '26/07/2023 22:58:28',
                    data: nodesLoja[2].getText().substring(nodesLoja[2].getText().length - 19),
                    cpf: cpf,
                    nome: nome,
                    codigo: idNFe.split("|")[0] + 12312332
                }
            })
            .catch(error => {
                console.error(error);
            });

        if (compra.cpf) {
            const notaComputada = await businessNotas.computarNota(compra);
            console.log(notaComputada)
            return compra
        }
        else {
            let erro = new Error();
            erro.message = "CPF não encontrado";
            erro.status = 404;
            throw erro;
        }

    }


    catch (err) {
        throw err;
    }
}