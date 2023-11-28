const excel = require('./excel.js');
const felder = require('./felder.js');
const fileHandler = require('./utils/fileHandler.js');
const Metric = require('./utils/metric.js');

const FIXED_COLUMNS = 2;
const KALENDARIUM_FIXED_COLUMNS = 3;
const LOHNART_ROW = 3;
const DATA_START_ROW = 5;
let metric = undefined;

function transformToCSV(excelFile) {
    console.log('transformToCSV');

    if (hasSeveralSheets(excelFile) === true) {
        console.log('File IS a Kalendarium Excel file');
        return transformKalendariumToTxt(excelFile);
    } else {
        console.log('File IS NOT a Kalendarium Excel file');
        return transformLohnabrechnungToTxt(excelFile);
    }
}

function hasSeveralSheets(excelFile) {
    // console.log('excelFileIsKalendarium');
    const workBook = excel.getWorkBook(excelFile);
    // console.log('File IS a Kalendarium Excel file');
    // console.log('workBook.SheetNames.length', workBook.SheetNames.length);
    return workBook.SheetNames.length > 1;
}

function transformLohnabrechnungToTxt(excelFile) {
    metric = new Metric();

    let workSheet = excel.initExcelFile(excelFile, sheetNumber = 0);

    let firmennummer = felder.readFirmennummer(); // 00
    let abrechnungszeitraum = felder.readAbrechnungsZeitraum(); // 06

    /*Check for error in header*/
    felder.readPersonalnummer(cellCoordinate = 'A4'); // 01

    let allLines = "";

    let lastDataRow = excel.getNumberOfLastDataRow();

    metric.setRowCount(lastDataRow - DATA_START_ROW);

    for (let row = DATA_START_ROW; row <= lastDataRow; row++) {

        let personalnummer = felder.readPersonalnummer(cellCoordinate = ('A' + row)); // 01
        let colCount = excel.getColCount();
        metric.setColCount(colCount);

        for (let col = FIXED_COLUMNS; col < colCount; col++) {
            if (excel.cellExists(workSheet[excel.getCellCoordinate(col, row)])) {
                let headerCellContent = workSheet[excel.getCellCoordinate(col, LOHNART_ROW + 1)].v;
                let feld = replaceDots(excel.readCell(excel.getCellCoordinate(col, row), 'number'));
                allLines += createOneLine(firmennummer, abrechnungszeitraum, personalnummer, headerCellContent, feld);
            }
        }
    }
    fileHandler.deleteUploadedFiles();
    metric.writeMetric();
    return fileHandler.writeTxtFile(allLines);
}

function transformKalendariumToTxt(excelFile) {
    metric = new Metric();
    let allLines = "";

    for (let sheetNumber = 1; sheetNumber < excel.getNumberOfSheets(); sheetNumber++) {
        let workSheet = excel.initExcelFile(excelFile, sheetNumber );
        
        let lastDataRow = excel.getNumberOfLastDataRow();
        let colCount = excel.getColCount();
        metric.setRowCount(lastDataRow - DATA_START_ROW);
        metric.setColCount(colCount);

        let firmennummer = felder.readFirmennummer(); // 00
        let abrechnungszeitraum = felder.readAbrechnungsZeitraum(); // 06
        // Check existance of personalnummer header
        felder.readPersonalnummer(cellCoordinate = 'A4'); // 01
        let personalnummer = felder.readPersonalnummer(cellCoordinate = ('A' + DATA_START_ROW)); // 01
        
        for (let col = KALENDARIUM_FIXED_COLUMNS; col < colCount; col++) {
            let colSum = 0;
            if (excel.cellExists(workSheet[excel.getCellCoordinate(col, DATA_START_ROW)]) !== undefined) {
                colSum = getSumOfColumn(workSheet, col, DATA_START_ROW, lastDataRow);
            }
            if (colSum !== "0,00") {
                let headerCellContent = workSheet[excel.getCellCoordinate(col, LOHNART_ROW + 1)].v;
                allLines += createOneLine(firmennummer, abrechnungszeitraum, personalnummer, headerCellContent, colSum);
            }
        }
    }

    fileHandler.deleteUploadedFiles();
    metric.writeMetric();
    return fileHandler.writeTxtFile(allLines);

}

function getSumOfColumn(workSheet, col, startRow, endRow) {
    let sum = 0;
    for (let row = startRow; row <= endRow; row++) {
        if (excel.cellExists(workSheet[excel.getCellCoordinate(col, row)])) {
            let feld = excel.readCell(excel.getCellCoordinate(col, row), 'number');
            sum = sum + feld;
        }
    }
    if (sum % 1 === 0 || sum.toString().includes('.')) {
        sum = replaceDots(sum);
    }
    return sum;
}

function findCellsWithContent(workSheet, startRow, endRow, col) {
    for (let row = startRow; row <= endRow; row++) {
        if (excel.cellExists(workSheet[excel.getCellCoordinate(col, row)])) {
            return true;
        }
    }
    return false;
}


function replaceDots(feld) {
    try { feld = feld.toFixed(2).toString().replace('.', ','); }
    catch (error) { console.log(error); }
    return feld;
}

function createOneLine(firmennummer, abrechnungszeitraum, personalnummer, headerCellContent, feld) {
    // Folgende Felder werden aktuell nicht einbezogen
    let kostenstelle = '';
    let kostentraeger = '';
    let abrechnungstag = '';
    let lohnsatz = '';
    let prozentsatz = '';

    return `${firmennummer};` +
        `${personalnummer};` +
        `${felder.readLohnart(headerCellContent)};` + // 02

        `${kostenstelle};` +
        `${kostentraeger};` +
        `${abrechnungstag};` +

        `${abrechnungszeitraum};` +

        `${lohnsatz};` +
        `${prozentsatz};` +

        `${felder.setAnzahlTage(headerCellContent, feld)};` +
        `${felder.setAnzahlStunden(headerCellContent, feld)};` +
        `${felder.setBetrag(headerCellContent, feld)}` +
        '\n'
}

exports.transformToCSV = transformToCSV;
exports.timestamp = this.timestamp;