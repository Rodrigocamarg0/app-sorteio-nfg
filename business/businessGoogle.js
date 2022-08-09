

exports.metadata = async (getAuthSheets) => {
    try {
        const { googleSheets, auth, spreadsheetId } = getAuthSheets;

        const metadata = await googleSheets.spreadsheets.get({
            auth,
            spreadsheetId,
        });
        return metadata;
    }
    catch (err) {
        throw err;
    }
}

exports.getRows = async (getAuthSheets) => {
    try {
        const { googleSheets, auth, spreadsheetId } = getAuthSheets;

        const getRows = await googleSheets.spreadsheets.values.get({
            auth,
            spreadsheetId,
            range: "Página1",
            valueRenderOption: "UNFORMATTED_VALUE",
            dateTimeRenderOption: "FORMATTED_STRING",
        });
        return getRows;
    }
    catch (err) {
        throw err;
    }
}



exports.create = async (newRow, getAuthSheets) => {
    try {
        const { googleSheets, auth, spreadsheetId } = getAuthSheets;


        const row = await googleSheets.spreadsheets.values.append({
            auth,
            spreadsheetId,
            range: "Compras!A2:C2",
            valueInputOption: "USER_ENTERED",
            resource: {
                values: [[newRow.loja,newRow.valor_total,newRow.data]],
            },
        });

        return row;

    }
    catch (err) {
        throw err;
    }
}
