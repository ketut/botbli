const qrcode = require('qrcode-terminal');
const fs = require('fs');
const { Client, LocalAuth } = require('whatsapp-web.js');
const { cekPresensi, rekues } = require('./mPresensi.js');
const { cekPresensiTbn, rekuesTbn } = require('./mPresensiTabanan.js');
const { cekPunamaTilem } = require('./mPunamaTilem.js');
const client = new Client({
    puppeteer: {
		  args: ['--no-sandbox'],
	  },
    authStrategy: new LocalAuth()
});

client.on('loading_screen', (percent, message) => {
    console.log('LOADING SCREEN', percent, message);
});
client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('authenticated', () => {
    console.log('AUTHENTICATED');
});

client.on('auth_failure', msg => {
    // Fired if session restore was unsuccessful
    console.error('AUTHENTICATION FAILURE', msg);
});
client.on('ready', () => {
    console.log('Bot(^_*)Ready!');
});

const BotArena_gid = '120363166714489126@g.us';
const Admin_uid = '6285239072008@c.us';
const Kiss_gid = '120363065814974262@g.us';
const IPDS_gid = '6285647297022-1416895163@g.us';
const Ari_uid = '6281916146881@c.us';
const Kadek_uid = '6281246670570@c.us';
const Hevi_uid = '6289653186884@c.us';
const Deddy_uid = '6281318253672@c.us';
const Bali_uid = '6287860118566-1567049896@g.us';
const pesanRB = "Tujuan Reformasi Birokrasi (RB) adalah Menciptakan birokrasi pemerintah yang profesional dengan karakteristik, berintegrasi, berkinerja tinggi, bebas dan bersih KKN, mampu melayani publik, netral, sejahtera, berdedikasi, dan memegang teguh nilai-nilai dasar dan kode etik aparatur negara.";
const sedihku = "Don't worry too much, let me heal myself, I've healed before";


client.on('group_join', () => {
    client.sendMessage(Admin_uid, "bot added to newgroup");
    console.log("added to new group");
});

client.on('group_leave', () => {
    client.sendMessage(Admin_uid, "bot removed from group");
    console.log("added to new group");
});

client.on('message', async message => {
    //
    if (message.body === '!id'){
        client.sendMessage(Admin_uid, message.id._serialized);
        console.log(message.id);
    } 
    else if (message.hasMedia) {
        const media = await message.downloadMedia();
	try {
        if (media.mimetype === 'application/pdf') {
            console.log(media.filename);
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth() + 1; 
            const day = currentDate.getDate();
            const tanggal = `${year}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`;
            const hours = currentDate.getHours();
            const minutes = currentDate.getMinutes();
            const seconds = currentDate.getSeconds();
            const jam = `${hours.toString().padStart(2, '0')}${minutes.toString().padStart(2, '0')}${seconds.toString().padStart(2, '0')}`;
            // fs.writeFileSync(fileName, media)
            namafile = `${tanggal}`+`_`+`${jam}`+`_`+media.filename
            fs.writeFile(`${namafile}`,media.data,"base64", function (err) {
                if (err) {
                  console.log(err);
                } else {
                    uploadPdf(namafile);
                    client.sendMessage(Admin_uid,`${namafile}`+' has been uploaded to cloud');

                }
              });
        }
    } catch (exception) {
    // Handle the exception here
        console.error('An exception occurred:', exception);
    }
    }

       
	else if(message.from === Admin_uid && message.hasMedia) {
        const media = await message.downloadMedia();
        try{
            if (media.mimetype === 'application/pdf') {
                console.log(media.filename);
                const currentDate = new Date();
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth() + 1; 
                const day = currentDate.getDate();
                const tanggal = `${year}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`;
                const hours = currentDate.getHours();
                const minutes = currentDate.getMinutes();
                const seconds = currentDate.getSeconds();
                const jam = `${hours.toString().padStart(2, '0')}${minutes.toString().padStart(2, '0')}${seconds.toString().padStart(2, '0')}`;
                // fs.writeFileSync(fileName, media)
                namafile = `${tanggal}`+`_`+`${jam}`+`_`+media.filename
                fs.writeFile(`${namafile}`,media.data,"base64", function (err) {
                    if (err) {
                      console.log(err);
                    } else {
                        uploadPdf(namafile);
                        message.reply(Admin_uid, `${namafile}`+' has been uploaded to cloud');

                    }
                  });
            } else {
		    //
		    }
        }  catch (exception) {
    // Handle the exception here
        console.error('An exception occurred:', exception);
    }
	} else if (message.body === '!Up') {
        message.reply('Up my lord!');
  } else if (message.body === 'Cek') {
        message.reply('cek ok!');
  } else if (message.body === '!hari') {
        const hariini = hari();
        const tglini = tgl();
        const jamini = jam();
        console.log(hariini, tglini, jamini);
        message.reply(`${hariini}`+` - `+`${tglini}`+` - `+`${jamini}`);
        // , tglini, jamini);
        // , currentDate, currentTime);
  } else if (message.body === 'hugme' || 
        message.body === 'hug me' || 
        message.body === '!hug' ||
        message.body === '!hugme' || 
        message.body === 'Hugme' || 
        message.body === 'Hug me' || 
        message.body === '!Hugme') {
	    if (message.id.remote.slice(-4) === 'g.us') {
	    	client.sendMessage(message.id.participant,"(づ๑•ᴗ•๑)づ");
	    	console.log(message.id.participant);
	    } else {
	    	client.sendMessage(message.id.remote, "(づ๑•ᴗ•๑)づ");
	    	console.log(message.id.remote);
	    }
  } else if (message.body.startsWith('!addGombal')) {
        const gombalin = message.body.substring("!addGombal ".length);
        try {
            await insertGombalan(gombalin);
            message.reply("done");
        } catch (e) {
            msg.reply('Gombalan gagal ditambahkan.');
        }


  } else if (message.body.startsWith('/addPelukan')) {
      const gombalin = message.body.substring("/addPelukan ".length);
      try {
          await insertGombalan(gombalin);
          message.reply("done");
      } catch (e) {
          msg.reply('Kata puitis gagal ditambahkan.');
      }


  } else if (message.body === '!Ketut' || message.body === '!ketut') {
        if (message.from === Kiss_gid) {
            client.sendMessage(Kiss_gid, sedihku);
        } else {
        // 
        }
  } else if (message.body.startsWith('!presensi ')) {
      // console.log(message.body);
      niplama = message.body.split(' ')[1];
      tanggal = message.body.split(' ')[2];
      bulan = message.body.split(' ')[3];
      const data_presensi = cekPresensi(tanggal,bulan);
      
      rekues(data_presensi)
        .then(result => {
        const absen = JSON.parse(result);
        for (i=0; i<absen.length; i++) {
          if (absen[i]['Nipbps'] === niplama) {
          const nipbps = absen[i]['Nipbps'];
          const nama = absen[i]['Nama'];
          const jamdatang = absen[i]['Jamdatang'];
          const jampulang = absen[i]['Jampulang'];
          const status = absen[i]['Status'];
          const tanggalan = tgl();
          if (tanggal === undefined & bulan === undefined){
            const bulan = tanggalan.split('-')[1];
            const tanggal = tanggalan.split('-')[2];
            message.reply(`Info presensi ${tanggal}-${bulan}-2024\nNama: ${nama}\nNip: ${nipbps}\nJam datang: ${jamdatang}\nJam pulang: ${jampulang}\nStatus: ${status}`);
          } else if (bulan === undefined & tanggal !== undefined) {
            const bulan = tanggalan.split('-')[1];
            message.reply(`Info presensi ${tanggal}-${bulan}-2024\nNama: ${nama}\nNip: ${nipbps}\nJam datang: ${jamdatang}\nJam pulang: ${jampulang}\nStatus: ${status}`);
          } else {
            
            message.reply(`Info presensi ${tanggal}-${bulan}-2024\nNama: ${nama}\nNip: ${nipbps}\nJam datang: ${jamdatang}\nJam pulang: ${jampulang}\nStatus: ${status}`);
            // console.log(`Info presensi ${tanggal}-${bulan}-2023\nNama: ${nama}\nNip: ${nipbps}\nJam datang: ${jamdatang}\nJam pulang: ${jampulang}\nStatus: ${status}`);
          }
        }
      }
        // console.log(hasil_parsed);
        })
        .catch(error => {
        console.error('Error:', error);
      });

  } else if (message.body.startsWith('!p5102 ')) {
      // console.log(message.body);
      niplama = message.body.split(' ')[1];
      tanggal = message.body.split(' ')[2];
      bulan = message.body.split(' ')[3];
      const data_presensi = cekPresensiTbn(tanggal,bulan);
      
      rekuesTbn(data_presensi)
        .then(result => {
        const absen = JSON.parse(result);
        for (i=0; i<absen.length; i++) {
          if (absen[i]['Nipbps'] === niplama) {
          const nipbps = absen[i]['Nipbps'];
          const nama = absen[i]['Nama'];
          const jamdatang = absen[i]['Jamdatang'];
          const jampulang = absen[i]['Jampulang'];
          const status = absen[i]['Status'];
          const tanggalan = tgl();
          if (tanggal === undefined & bulan === undefined){
            const bulan = tanggalan.split('-')[1];
            const tanggal = tanggalan.split('-')[2];
            message.reply(`Info presensi ${tanggal}-${bulan}-2024\nNama: ${nama}\nNip: ${nipbps}\nJam datang: ${jamdatang}\nJam pulang: ${jampulang}\nStatus: ${status}`);
          } else if (bulan === undefined & tanggal !== undefined) {
            const bulan = tanggalan.split('-')[1];
            message.reply(`Info presensi ${tanggal}-${bulan}-2024\nNama: ${nama}\nNip: ${nipbps}\nJam datang: ${jamdatang}\nJam pulang: ${jampulang}\nStatus: ${status}`);
          } else {
            
            message.reply(`Info presensi ${tanggal}-${bulan}-2024\nNama: ${nama}\nNip: ${nipbps}\nJam datang: ${jamdatang}\nJam pulang: ${jampulang}\nStatus: ${status}`);
            // console.log(`Info presensi ${tanggal}-${bulan}-2023\nNama: ${nama}\nNip: ${nipbps}\nJam datang: ${jamdatang}\nJam pulang: ${jampulang}\nStatus: ${status}`);
          }
        }
      }
        // console.log(hasil_parsed);
        })
        .catch(error => {
        console.error('Error:', error);
      });

  } else if (message.body.startsWith('!siapa')) {
        pertanyaan = message.body.split(' ')[1];
        kata2 = message.body.split(' ')[2];
        kata3 = message.body.split(' ')[3];
        kata4 = message.body.split(' ')[4];
        if (pertanyaan === 'perjadin') {
          const data_presensi = cekPresensi();
          ygPerjadin = [];
          rekues(data_presensi)
          .then(result => {
          const absen = JSON.parse(result);
          for (i=0; i<absen.length; i++) {
            if (absen[i]['Status'] === 'PD*') {
            const nama = absen[i]['Nama'];
            ygPerjadin.push(nama);
                         // console.log(`Info presensi ${tanggal}-${bulan}-2023\nNama: ${nama}\nNip: ${nipbps}\nJam datang: ${jamdatang}\nJam pulang: ${jampulang}\nStatus: ${status}`);
           }
          } if (ygPerjadin.length>0) {
            message.reply(`Perjadin hari ini:\n${ygPerjadin}`);
          } else {
            message.reply(`Tidak ada yang perjadin hari ini`);
          }
          
          // console.log(hasil_parsed);
          })
          .catch(error => {
          console.error('Error:', error);
        });
        } else if (pertanyaan === 'cuti') {
          const data_presensi = cekPresensi();
          ygCuti = [];
          rekues(data_presensi)
          .then(result => {
          const absen = JSON.parse(result);
          for (i=0; i<absen.length; i++) {
            if (absen[i]['Status'] === 'CT*') {
            const nama = absen[i]['Nama'];
            ygCuti.push(nama);
                         // console.log(`Info presensi ${tanggal}-${bulan}-2023\nNama: ${nama}\nNip: ${nipbps}\nJam datang: ${jamdatang}\nJam pulang: ${jampulang}\nStatus: ${status}`);
           }
          }
          if (ygCuti.length > 0) {
            message.reply(`Cuti hari ini:\n${ygCuti}`);
          } else {
            message.reply(`Tidak ada yg cuti hari ini`);
          }
          
          // console.log(hasil_parsed);
          })
          .catch(error => {
          console.error('Error:', error);
        });
        } else if (pertanyaan === 'kn') {
          const data_presensi = cekPresensi();
          ygKN = [];
          rekues(data_presensi)
          .then(result => {
          const absen = JSON.parse(result);
          for (i=0; i<absen.length; i++) {
            if (absen[i]['Status'] === 'KN*') {
            const nama = absen[i]['Nama'];
            ygKN.push(nama);
                         // console.log(`Info presensi ${tanggal}-${bulan}-2023\nNama: ${nama}\nNip: ${nipbps}\nJam datang: ${jamdatang}\nJam pulang: ${jampulang}\nStatus: ${status}`);
           }
          }
          if (ygKN.length > 0) {
            message.reply(`KN* hari ini:\n ${ygKN}`);
          } else {
            message.reply(`Tidak ada KN* hari ini`);
          }
          
          // console.log(hasil_parsed);
          })
          .catch(error => {
          console.error('Error:', error);
        });
        // } else {
        //   message.reply("Kamu nanya?");
        // }
      } 

  } else if (message.body.startsWith("!lokasi")) {
        nama = message.body.split(' ')[1];
        if (nama = 'Ari' && message.id.participant === Admin_uid) {
          message.reply("Di hati");
        } else if (nama = 'Ari') {
          message.reply("Di hati Blitut");
        } else {
          message.reply("Aku tidak tahu, coba pakai GPS Magellan");
        }
        
  } else if (message.body === '!info') {
        let info = client.info;
        client.sendMessage(message.from, `
            *Connection info*
            User name: ${info.pushname}
            My number: ${info.wid.user}
            Platform: ${info.platform}
        `);
  } else if (message.body === '!berakhlak'){
          const berakhlak = randomBerAKHLAK();
          message.reply(berakhlak);

  } else if (message.body === '!punamatilem'){
        
        const hasilCekPunamaTilem = cekPunamaTilem();
        if (hasilCekPunamaTilem == 'Purnama') {
          message.reply("Besok Purnama, jangan lupa pakaian adat")
        } if (hasilCekPunamaTilem == 'Tilem') {
          message.reply("Besok Tilem, jangan lupa pakaian adat");
        } else {
          message.reply(`Besok ${hasilCekPunamaTilem}`);
        }

  } else if (message.body.startsWith('!')) {
          const gombalanmaut = randomGombalan();
          message.reply(gombalanmaut);
  } else {
        // 
    }
});

client.initialize();

async function aOa() {
    try {
        const response = await fetch("https://indodax.com/api/aoa_idr/ticker");
        if (!response.ok) {
            throw new Error(`Network response was not ok (${response.status} ${response.statusText})`);
        }
        const aoa_idr = await response.json();
        return aoa_idr;
    } catch (error) {
    console.error("An error occurred:", error);
    return null;
  }
}

function hari() {
    const currentDate = new Date();
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayOfWeekNumber = currentDate.getDay();
    const dayOfWeekName = daysOfWeek[dayOfWeekNumber];
    return dayOfWeekName;
}

function tgl() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; 
    const day = currentDate.getDate();
    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return formattedDate;
}

function jam() {
    const currentDate = new Date();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    return formattedTime;
}

function uploadPdf(namafile) {
    const fs = require('fs');
    const fetch = require('node-fetch');

    // const apiUrl = 'https://cloud.bpsbali.id/remote.php/dav/files/ketut//2023_personal/Pdf/';
    const apiUrl = 'https://cloud.bpsbali.id/remote.php/dav/files/ketut/Folder%20Tim%20IPDS/2023/PDF/';

    const username = 'ketut';
    const password = 'samuraiX';
    // CEK
    const pdfFilePath = namafile;
    const pdfData = fs.readFileSync(pdfFilePath);
    const base64PdfData = pdfData.toString('base64');
    const authHeader = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');
    // CEK
    const targetFilename = namafile;

    // Set up headers for the fetch request
    const headers = new fetch.Headers({
      'Authorization': authHeader,
      'Content-Type': 'application/octet-stream',
      'OCS-APIRequest': 'true',
    });

    fetch(apiUrl + targetFilename, {
      method: 'PUT',
      headers: headers,
      body: Buffer.from(base64PdfData, 'base64'),
    })
    .then(response => {
      console.log(`File uploaded successfully! Response: ${response.status} - ${response.statusText}`);
    })
    .catch(error => {
      console.error('An error occurred:', error);
    });
}


function randomGombalan() {
    const data = readDataFromFile();
    const values = Object.values(data);
    if (values.length === 0) {
      return null; 
    }
    const randomIndex = Math.floor(Math.random() * values.length);
    return values[randomIndex];
  }
  
  function insertGombalan(value) {
    const existingData = readDataFromFile();
    const key = Date.now().toString();
    existingData[key] = value;
    writeDataToFile(existingData);
    console.log(`Data inserted with key '${key}' and value '${value}'`);
  }
  
  function writeDataToFile(data) {
    fs.writeFileSync('data.json', JSON.stringify(data, null, 2), 'utf8');
  }
  
  function readDataFromFile() {
    try {
      const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
      return data;
    } catch (error) {
      return {}; 
    }
  }

function randomBerAKHLAK() {
  const data = readBerAKHLAK();
  const values = Object.values(data);
  if (values.length === 0) {
    return null; 
  }
  const randomIndex = Math.floor(Math.random() * values.length);
  return values[randomIndex];
}

function readBerAKHLAK() {
  try {
    const data = JSON.parse(fs.readFileSync('berakhlak.json', 'utf8'));
    return data;
  } catch (error) {
    return {}; 
  }
}

function checkTime() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const hari_ini = hari();

  if ((hari_ini === 'Monday' || hari_ini === 'Tuesday' || hari_ini === 'Wednesday' || hari_ini === 'Thursday' || hari_ini === 'Friday') && (hours === 15 && minutes === 0)) {
        const randomberakhlak = randomBerAKHLAK();
        client.sendMessage(Bali_uid, randomberakhlak);
      }
  if ((hari_ini === 'Monday' || hari_ini === 'Tuesday' || hari_ini === 'Wednesday' || hari_ini === 'Thursday' || hari_ini === 'Friday') && (hours === 15 && minutes === 0)) {
        const hasilCekPunamaTilem = cekPunamaTilem();
        if (hasilCekPunamaTilem == 'Purnama') {
          client.sendMessage(Bali_uid, "Informasi: Besok Purnama, jangan lupa pakaian adat")
        } if (hasilCekPunamaTilem == 'Tilem') {
          client.sendMessage(Bali_uid, "Informasi: Besok Tilem, jangan lupa pakaian adat");
        }
    }
}

setInterval(checkTime, 60000);
