let fetch = require('node-fetch')

let timeout = 100000
let poin = 10000
const wm = global.wm
let handler = async (m, { conn, usedPrefix }) => {
    conn.fisika = conn.fisika ? conn.fisika : {}
    let id = m.chat
    if (id in conn.fisika) {
        conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.fisika[id][0])
        throw false
    }
    // di sini dia ngambil data dari api
    let src = await (await fetch(`https://api.betabotz.eu.org/api/game/fisika?apikey=${lann}`)).json()
    let json = src
    // buat caption buat di tampilin di wa
    let options = json.pilihan.map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt}`).join('\n')
    let caption = `⚡ *T E B A K   F I S I K A* ⚡
⚡━━━━━━━━━━⚡

⬡ *Timeout* » ${(timeout / 1000).toFixed(2)} detik
⬡ *Prefix* » ${usedPrefix}
⬡ *Bonus* » ${poin} money
⬡ *Cara* » Balas/reply soal ini

⚡━━━━━━━━━━⚡
_` + global.wm + ` • ` + global.footer + `_`.trim();
    conn.fisika[id] = [
        await conn.reply(m.chat, caption, m),
        json, poin,
        setTimeout(() => {
            if (conn.fisika[id]) {
                conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.fisika[id][0])
                delete conn.fisika[id]
            }
        }, timeout)
    ]
}
handler.help = ['fisika']
handler.tags = ['game']
handler.command = /^fisika/i
handler.register = false
handler.group = true

module.exports = handler

// tested di bileys versi 6.5.0 dan sharp versi 0.30.5
// danaputra133