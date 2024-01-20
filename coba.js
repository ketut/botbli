const { SadWara } = require('balinese-date-js-lib');
const { cekPunamaTilemNow } = require('./mPunamaTilem.js');

const hasil = cekPunamaTilemNow();
console.info(hasil);

function tgl(tanggal) {
    const currentDate = tanggal;
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; 
    const day = currentDate.getDate();
    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return formattedDate;
}

const tanggal = tgl(hasil.date);
console.info(tanggal);
console.info(`Wuku: ${hasil.wuku.name}\n${hasil.saptaWara.name} ${hasil.triWara.name} ${hasil.sadWara.name}`);
console.log('ini tes');