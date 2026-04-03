// credits : kasan
// improved by : Partner Coding

const axios = require('axios');

const handler = async (m, { conn }) => {
    // Mengambil API Key dari konfigurasi global atau environment variables
    const APIKEY = global.rumahotp || process.env.RUMAHOTP_APIKEY;

    if (!APIKEY) return m.reply('[!] APIKEY belum diset. Silakan hubungi Owner!');

    let status = "OFFLINE";
    let apiPing = 0;

    try {
        // Mulai menghitung waktu (ping) API
        const start = Date.now();
        const res = await axios.get('https://www.rumahotp.io/api/v2/services', {
            headers: {
                "x-apikey": APIKEY,
                "Accept": "application/json"
            },
            timeout: 10000 // Batas waktu koneksi 10 detik
        });
        
        // Menghitung selisih waktu untuk Ping API
        apiPing = Date.now() - start;

        // Mengecek apakah respon dari server sukses
        if (res.data?.success) {
            status = "ONLINE";
        }
    } catch (e) {
        status = "OFFLINE";
    }

    // Teks balasan super simpel
    const txt = `Status: ${status}\nPing: ${apiPing} ms`;

    // Mengirimkan pesan status ke pengguna
    await conn.reply(m.chat, txt, m);
};

// Pengaturan Command Bot
handler.help = ['status'];
handler.tags = ['info'];
handler.command = /^(status|cekstatus)$/i;

module.exports = handler;