const fetch = require('node-fetch');
//import fetch from "node-fetch";
async function rekues(data_enc){
   // Import the fetch library
  const headerku = {
        "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Im5hbWEiOiJFbmRhbmcgUmV0bm8gU3JpIFN1Yml5YW5kYW5pIFMuU2ksIE0uTS4iLCJlbWFpbCI6ImVyc3JpQGJwcy5nby5pZCIsInVzZXJuYW1lIjoiZXJzcmkiLCJuaXAiOiIzNDAwMTE4MTMiLCJuaXBfYmFydSI6IjE5NjQxMDIzMTk4ODAyMjAwMSIsImtvZGVfb3JnYW5pc2FzaSI6IjUxMDAwMDA5MjAwMCIsImtvZGVfcHJvdmluc2kiOiI1MSIsImtvZGVfa2FidXBhdGVuIjoiMDAiLCJhbGFtYXRfa2FudG9yIjoiSmwuIFJheWEgUHVwdXRhbiBOby4xIFJlbm9uIiwicHJvdmluc2kiOiJCYWxpIiwia2FidXBhdGVuIjoiUHJvdi4gQmFsaSIsImdvbG9uZ2FuIjoiSVZcL2QiLCJqYWJhdGFuIjoiS2VwYWxhIEJQUyBQcm92aW5zaSIsImZvdG8iOiJodHRwczpcL1wvY29tbXVuaXR5LmJwcy5nby5pZFwvaW1hZ2VzXC9hdmF0YXJcLzM0MDAxMTgxM18yMDE2MDkxMzEwNTIxMS5qcGciLCJlc2Vsb24iOiIyIiwia2RvcmciOiI5MjAwMCIsImtkX3Byb3YiOiI1MSIsIm5pcGxhbWEiOiIzNDAwMTE4MTMiLCJqZW5pcyI6InBlZ2F3YWkifX0.dyXd2tTPYz0xsd3LNNHoeIR6Nq06XoZHVp9fFUbpraw",
        "host": "presensi.bps.go.id",
        // "user-agent": "Dalvik/2.1.0 (Linux; U; Android 12; M2010J19CG Build/SKQ1.211202.001)",
        "content-type": "application/json"
    };

    const urlx = 'https://presensi.bps.go.id/presensi-bps-backend/attendance/monitoringharian';

  try {
    const response = await fetch(urlx, {
      method: 'POST',
      headers: headerku,
      body: data_enc
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const hasil = await response.text();
    return hasil;
  } catch (error) {
    console.error('Error:', error);
    throw error; // Propagate the error to the caller if needed
  }
}

function enkripsi(data) {
    var CryptoJS = require("crypto-js");
    var CryptoJSAesJson = require('./cryptojs-aes');
    var crypt_format = CryptoJSAesJson;
    var key = '99d3b9d8508d1d95e92880d5a829e7552c1815a5';
    passphrase = "99d3b9d8508d1d95e92880d5a829e7552c1815a5"

    const json_payload = JSON.stringify(data)
    const payload = CryptoJS.AES.encrypt(json_payload, key, {format: crypt_format}).toString();
    base64String = Buffer.from(payload).toString('base64');
    return base64String;
}

function cekPresensi(tanggal = null, bulan = null) {
  // const nip = niplama
  if ((tanggal === null & bulan === null) || (tanggal === undefined & bulan === undefined)) {
    const tanggalan = new Date();
    const bln = tanggalan.getMonth() + 1;
    const tgl = tanggalan.getDate();
    data = {'data': {'kdprop': '51', 'kdkab': '00', 'subkdorg': '92', 'tahun': '2024', 'bulan': `${bln}`, 'tanggal': `${tgl}`}}
    const data_enc = enkripsi(data);
    return data_enc;

  } else if (bulan === null || bulan === undefined){
    const tanggalan = new Date();
    const bln = tanggalan.getMonth() + 1;
    data = {'data': {'kdprop': '51', 'kdkab': '00', 'subkdorg': '92', 'tahun': '2024', 'bulan': `${bln}`, 'tanggal': `${tanggal}`}}
    const data_enc = enkripsi(data);
    return data_enc;

  } else {
    data = {'data': {'kdprop': '51', 'kdkab': '00', 'subkdorg': '92', 'tahun': '2024', 'bulan': `${bulan}`, 'tanggal': `${tanggal}`}}
    const data_enc = enkripsi(data);
    return data_enc;
  }
  // console.log(nip);
}

// const A = cekPresensi(340017408,8);
// rekues(A)
//     .then(result => {
//     // console.log('Response:', result);
//     hasil_parsed = JSON.parse(result);
//     console.log(hasil_parsed);
//     // return hasil_parsed;
//     })
//     .catch(error => {
//     console.error('Error:', error);
//   });


//export { cekPresensi, rekues };
module.exports = {
  cekPresensi, rekues,
};
