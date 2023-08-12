const fs = require('fs');
const excel = require('./excelUtils.js');

module.exports = {
    // Nr.:             0
    // Feldbezeichnung: FINUM
    // Verwendung:      Firmennummer
    // TYP:             NUMBER
    // MAX_LENGTH:      7
    // Muss-Feld:       Ja
    // Excel-Zelle:     B2
    readFirmennummer: function (cellCoordinate = 'B2') {
        let firmennummer = excel.readCell(cellCoordinate, 'number');
        if (firmennummer === undefined) {
            console.log(`Firmennummer (Zelle ${cellCoordinate}) ist leer!`);
        } else {
            console.log(`Firmennummer: ${firmennummer}`);
        }
        return firmennummer;
    },
    // Nr.:             1
    // Feldbezeichnung: PERSNR
    // Verwendung:      Personalnummer
    // TYP:             NUMBER
    // MAX_LENGTH:      8
    // Muss-Feld:       Ja
    // Excel-Zelle:     A5
    readPersonalnummer: function (cellCoordinate = 'A5') {
        let personalnummer = excel.readCell(cellCoordinate, 'string');
        if (personalnummer === undefined) {
            console.log(`Personalnummer (Zelle ${cellCoordinate}) ist leer!`);
        } else {
            personalnummer = personalnummer.padStart(6, '0');
            console.log(`Personalnummer: ${personalnummer}`);
        }
        return personalnummer;
    },

    // Nr.:             2
    // Feldbezeichnung: LOHNART
    // Verwendung:      Lohnart
    // TYP:             NUMBER
    // MAX_LENGTH:      4
    // Muss-Feld:       Ja
    // Excel-Zelle:     C4
    readLohnart: function (cellCoordinate = 'C4') {
        let lohnart = excel.readCell(cellCoordinate, 'number');
        if (lohnart === undefined) {
            console.log(`Lohnart (Zelle ${cellCoordinate}) ist leer!`);
        } else {
            console.log(`Lohnart: ${lohnart}`);
            // \d+ -> match one or more digits
            // [0] -> get the first match
            lohnart = lohnart.match(/\d+/)[0];
        }
        return lohnart;
    },

    // Nr.:             3
    // Feldbezeichnung: KOSTENST
    // Verwendung:      Kostenstelle
    // TYP:             NUMBER
    // MAX_LENGTH:      8
    // Muss-Feld:       Nein
    // Excel-Zelle:     ???

    // Nr.:             4
    // Feldbezeichnung: KOSTENTR
    // Verwendung:      Kostenträger
    // TYP:             NUMBER
    // MAX_LENGTH:      8
    // Muss-Feld:       Nein
    // Excel-Zelle:     ???

    // Nr.:             5
    // Feldbezeichnung: AbrechnungsTag
    // Verwendung:      Abrechnungstag
    // TYP:             NUMBER
    // MAX_LENGTH:      2
    // Muss-Feld:       Nein
    // Excel-Zelle:     ???

    // Nr.:             6
    // Feldbezeichnung: AbrechnungsZeitraum
    // Verwendung:      Abrechnungszeitraum
    // TYP:             DATE
    // MAX_LENGTH:      tt.mm.jjjj oder ttmmjjjj
    // Muss-Feld:       Ja
    // Excel-Zelle:     B3
    readAbrechnungsZeitraum: function (cellCoordinate = 'B3') {
        let abrechnungsZeitraum = excel.readCell(cellCoordinate, 'date');
        if (abrechnungsZeitraum === undefined) {
            console.log(`Abrechnungszeitraum (Zelle ${cellCoordinate}) ist leer!`);
        } else {
            const day = abrechnungsZeitraum.d.toString().padStart(2, '0');
            const month = abrechnungsZeitraum.m.toString().padStart(2, '0');
            const year = abrechnungsZeitraum.y.toString();
            abrechnungsZeitraum = day + '.' + month + '.' + year;
            console.log(`Abrechnungszeitraum: ${abrechnungsZeitraum}`);
        }
        return abrechnungsZeitraum;
    },

    // Nr.:             7
    // Feldbezeichnung: LSATZ
    // Verwendung:      Lohnsatz
    // TYP:             NUMBER
    // MAX_LENGTH:      8(2)
    // Muss-Feld:       Nein
    // Excel-Zelle:     ???

    // Nr.:             8
    // Feldbezeichnung: PSATZ
    // Verwendung:      Prozentsatz
    // TYP:             NUMBER
    // MAX_LENGTH:      6(3)
    // Muss-Feld:       Nein

    // Nr.:             9
    // Feldbezeichnung: ANZTAGE
    // Verwendung:      Anzahl Tage
    // TYP:             NUMBER
    // MAX_LENGTH:      4(2)
    // Muss-Feld:       Nein
    // Excel-Zelle:     ???

    // Nr.:             10
    // Feldbezeichnung: ANZSTUNDEN
    // Verwendung:      Anzahl Stunden
    // TYP:             NUMBER
    // MAX_LENGTH:      6(2)
    // Muss-Feld:       Nein
    // Excel-Zelle:     ???

    // Nr.:             11
    // Feldbezeichnung: BETRAG
    // Verwendung:      Betrag
    // TYP:             NUMBER
    // MAX_LENGTH:      8(2)
    // Muss-Feld:       Nein
    // Excel-Zelle:     ???
}