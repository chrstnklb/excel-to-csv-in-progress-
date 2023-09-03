const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const excel = require('./excel.js');
const felder = require('./felder.js');
const fileHandler = require('./utils/fileHandler.js');
const time = require('./utils/time.js');

const TARGET_FILENAME = "Imp_lbw.txt";

const fixedColumns = 2;
const lohnartRow = 3;
const dataStartRow = 4;
let timestamp = '';

function transformToCSV(excelFile) {

    let statistics = {
        'timestamp': '',
        'colCount': 0,
        'rowCount': 0,
        'calculation-time-in-ms': 0,
    };
    let start = new Date().getTime();

    let workSheet = excel.initExcelFile(excelFile);

    let firmennummer = felder.readFirmennummer(); // 00
    let abrechnungszeitraum = felder.readAbrechnungsZeitraum(); // 06

    let allLines = "";

    // iterate over all rows
    let rowCount = excel.getRowCount();
    statistics.rowCount = rowCount;
    for (let row = dataStartRow + 1; row <= rowCount; row++) {
        let personalnummer = felder.readPersonalnummer(cellCoordinate = ('A' + row)); // 01
        let colCount = excel.getColCount();
        statistics.colCount = colCount;
        for (let col = fixedColumns; col < colCount; col++) {
            let lohnart = '';
            let kostenstelle = '';
            let kostentraeger = '';
            let abrechnungstag = '';
            let lohnsatz = '';
            let prozentsatz = '';
            let anzahlTage = '';
            let anzahlStunden = '';
            let betrag = '';
            let cellCoordinate = xlsx.utils.encode_col(col) + row;
            let cell = workSheet[cellCoordinate];
            if (cell !== undefined) {

                let cellCoordinate = xlsx.utils.encode_col(col) + (lohnartRow + 1);
                let headerCellContent = workSheet[cellCoordinate].v;

                let feld = excel.readCell(cellCoordinate = (xlsx.utils.encode_col(col) + row), 'number');
                feld = feld.toFixed(2).toString().replace('.', ',');

                lohnart = felder.readLohnart(headerCellContent); // 02

                if (headerCellContent.includes('KOSTENST')) anzahlStunden = feld; // 03
                if (headerCellContent.includes('KOSTENTR')) betrag = feld; // 04
                if (headerCellContent.includes('Abrechnungstag')) anzahlTage = feld; // 05

                if (headerCellContent.includes('LSATZ')) anzahlStunden = feld; // 07
                if (headerCellContent.includes('PSATZ')) betrag = feld; // 08
                if (headerCellContent.includes('ANZTAGE')) anzahlTage = feld; // 09
                if (headerCellContent.includes('ANZSTD')) anzahlStunden = feld; // 10
                if (headerCellContent.includes('BETRAG')) betrag = feld; // 11

                allLines += `${firmennummer};` +
                    `${personalnummer};` +
                    `${lohnart};` +
                    `${kostenstelle};` +
                    `${kostentraeger};` +
                    `${abrechnungstag};` +
                    `${abrechnungszeitraum};` +
                    `${lohnsatz};` +
                    `${prozentsatz};` +
                    `${anzahlTage};` +
                    `${anzahlStunden};` +
                    `${betrag}` +
                    '\n';
            }
        }
    }

    statistics.timestamp = time.getActualTimeStampYYYYMMDDhhmmss();

    let end = new Date().getTime();
    statistics['calculation-time-in-ms'] = end - start;

    timestamp = time.getActualTimeStampYYYYMMDDhhmmss();
    deleteUploadedFiles(excelFile, timestamp);
    writeStatistics(statistics);
    return writeTxtFile(allLines, timestamp);
}

function deleteUploadedFiles() {
    fileHandler.deleteFiles(path.join(__dirname, '../exchange/uploads/'));
}

function writeTxtFile(content, timestamp) {
    const folder = path.join(__dirname, '../../src/exchange/downloads/' + timestamp);
    return fileHandler.writeToFile(folder, TARGET_FILENAME, content);
}

function writeStatistics(statistics) {
    let statFolder = path.join(__dirname, 'statistics/');
    let statFilename = 'statistic-' + statistics.timestamp + '.json';
    let statData = JSON.stringify(statistics);
    fileHandler.writeToFile(statFolder, statFilename, statData);
}

exports.transformToCSV = transformToCSV;
exports.timestamp = this.timestamp;