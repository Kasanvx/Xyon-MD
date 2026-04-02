const fetch = require('node-fetch');

let handler = async (m, { text, usedPrefix, command }) => {
    if (!text) throw `Penggunaan:\n${usedPrefix + command} <teks>\n\nContoh:\n${usedPrefix + command} Jakarta`;
    try {
        let res = await fetch(`https://api.betabotz.eu.org/api/tools/cuaca?query=${encodeURIComponent(text)}&apikey=${lann}`);
        if (!res.ok) throw 'Lokasi tidak ditemukan';
        let json = await res.json();
        if (!json.status || json.code !== 200) throw eror;
        let result = json.result;
            let txt = `⚡ *I N F O   C U A C A* ⚡
⚡━━━━━━━━━━⚡

`;
    txt += `⬡ *Lokasi* » ${result.location}
`;
    txt += `⬡ *Negara* » ${result.country}
`;
    txt += `⬡ *Cuaca* » ${result.weather}
`;
    txt += `⬡ *Suhu Saat Ini* » ${result.currentTemp}
`;
    txt += `⬡ *Suhu Tertinggi* » ${result.maxTemp}
`;
    txt += `⬡ *Suhu Terendah* » ${result.minTemp}
`;
    txt += `⬡ *Kelembapan* » ${result.humidity}
`;
    txt += `⬡ *Angin* » ${result.windSpeed}
`;
    txt += `
⚡━━━━━━━━━━⚡
_` + global.wm + ` • ` + global.footer + `_`;
    m.reply(`Lokasi: ${result.location}\nNegara: ${result.country}\nCuaca: ${result.weather}\nSuhu saat ini: ${result.currentTemp}\nSuhu tertinggi: ${result.maxTemp}\nSuhu terendah: ${result.minTemp}\nKelembapan: ${result.humidity}\nAngin: ${result.windSpeed}`);
    } catch (error) {
        m.reply('Terjadi error saat mencari informasi cuaca, silakan coba lagi nanti');
    }
};

handler.help = ['cuaca'];
handler.tags = ['internet'];
handler.command = /^(cuaca|weather)$/i;

module.exports = handler;
