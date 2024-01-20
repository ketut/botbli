const fetch = require('node-fetch');
//import fetch from "node-fetch";
async function rekuesTbn(data_enc){
   // Import the fetch library
  const headerku = {
        "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Im5hbWEiOiJLb21hbmcgQmFndXMgUGF3YXN0cmEgU0UsIE1ULixNQSIsImVtYWlsIjoia29tYW5nQGJwcy5nby5pZCIsInVzZXJuYW1lIjoia29tYW5nIiwibmlwIjoiMzQwMDE1NzkxIiwibmlwX2JhcnUiOiIxOTc2MDIxMzE5OTkwMTEwMDEiLCJrb2RlX29yZ2FuaXNhc2kiOiI1MTAyMDAwOTI4MDAiLCJrb2RlX3Byb3ZpbnNpIjoiNTEiLCJrb2RlX2thYnVwYXRlbiI6IjAyIiwiYWxhbWF0X2thbnRvciI6Ii0iLCJwcm92aW5zaSI6IkJhbGkiLCJrYWJ1cGF0ZW4iOiJLYWIuIFRhYmFuYW4iLCJnb2xvbmdhbiI6IklWXC9iIiwiamFiYXRhbiI6IktlcGFsYSBCUFMgS2FidXBhdGVuXC9Lb3RhIiwiZm90byI6Imh0dHBzOlwvXC9jb21tdW5pdHkuYnBzLmdvLmlkXC9pbWFnZXNcL2F2YXRhclwvMzQwMDE1NzkxXzIwMjEwNjIxMDA1MTE0LmpwZyIsImVzZWxvbiI6IjMiLCJrZG9yZyI6IjkyODAwIiwia2RfcHJvdiI6IjUxIiwibmlwbGFtYSI6IjM0MDAxNTc5MSIsImplbmlzIjoicGVnYXdhaSJ9fQ.CwiPKZwrMJ9A5YjTqxjj_kVkTWyNw88EcLzQvgdt6UM",
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
    var key = '6526bbb7ffec3a78e44a9fcf555fd28e674084b5';
    passphrase = "6526bbb7ffec3a78e44a9fcf555fd28e674084b5"

    const json_payload = JSON.stringify(data)
    const payload = CryptoJS.AES.encrypt(json_payload, key, {format: crypt_format}).toString();
    base64String = Buffer.from(payload).toString('base64');
    return base64String;
}

function cekPresensiTbn(tanggal = null, bulan = null) {
  // const nip = niplama
  if ((tanggal === null & bulan === null) || (tanggal === undefined & bulan === undefined)) {
    const tanggalan = new Date();
    const bln = tanggalan.getMonth() + 1;
    const tgl = tanggalan.getDate();
    data = {'data': {'kdprop': '51', 'kdkab': '02', 'subkdorg': '92', 'tahun': '2024', 'bulan': `${bln}`, 'tanggal': `${tgl}`}}
    const data_enc = enkripsi(data);
    return data_enc;

  } else if (bulan === null || bulan === undefined){
    const tanggalan = new Date();
    const bln = tanggalan.getMonth() + 1;
    data = {'data': {'kdprop': '51', 'kdkab': '02', 'subkdorg': '92', 'tahun': '2024', 'bulan': `${bln}`, 'tanggal': `${tanggal}`}}
    const data_enc = enkripsi(data);
    return data_enc;

  } else {
    data = {'data': {'kdprop': '51', 'kdkab': '02', 'subkdorg': '92', 'tahun': '2024', 'bulan': `${bulan}`, 'tanggal': `${tanggal}`}}
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
  cekPresensiTbn, rekuesTbn,
};
