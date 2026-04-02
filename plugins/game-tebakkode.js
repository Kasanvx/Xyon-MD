let fetch = require('node-fetch')

let timeout = 100000
let poin = 10000
const wm = global.wm
let handler = async (m, { conn, usedPrefix }) => {
    conn.tebakkode = conn.tebakkode ? conn.tebakkode : {}
    let id = m.chat
    if (id in conn.tebakkode) {
        conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakkode[id][0])
        throw false
    }
    // di sini dia ngambil data dari api
    let src = await (await fetch(`https://api.betabotz.eu.org/api/game/tebakkode?apikey=${lann}`)).json()
    let json = src
    // buat caption buat di tampilin di wa
    let options = json.pilihan.map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt}`).join('\n')
    let caption = `⚡ *T E B A K   K O D E* ⚡
⚡━━━━━━━━━━⚡

⬡ *Timeout* » ${(timeout / 1000).toFixed(2)} detik
⬡ *Prefix* » ${usedPrefix}
⬡ *Bonus* » ${poin} money
⬡ *Cara* » Balas/reply soal ini

⚡━━━━━━━━━━⚡
_` + global.wm + ` • ` + global.footer + `_`.trim()
    conn.tebakkode[id] = [
        await conn.reply(m.chat, caption, m),
        json, poin,
        setTimeout(() => {
            if (conn.tebakkode[id]) {
                conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.tebakkode[id][0])
                delete conn.tebakkode[id] // Automatically delete the question
            }
        }, timeout)
    ]
}
handler.help = ['tebakkode']
handler.tags = ['game']
handler.command = /^tebakkode/i
handler.register = false
handler.group = true

module.exports = handler

// tested di bileys versi 6.5.0 dan sharp versi 0.30.5
// danaputra133