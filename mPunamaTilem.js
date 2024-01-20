
const BD = require('balinese-date-js-lib');



function cekPunamaTilem() {
    
    const tgl = new Date();
    tgl.setDate(tgl.getDate() + 1)
    const now = new BD.BalineseDate(tgl);
    return now.sasihDayInfo.name;
}


function cekPunamaTilemNow() {
    
    const tgl = new Date();
    // tgl.setDate(tgl.getDate() + 1)
    const now = new BD.BalineseDate(tgl);
    return now;
}

module.exports = {
    cekPunamaTilem, cekPunamaTilemNow,
  };