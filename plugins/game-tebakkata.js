let fetch = require('node-fetch')

let timeout = 100000
let poin = 10000
const wm = global.wm
let handler = async (m, { conn, usedPrefix }) => {
    conn.tbkata = conn.tbkata ? conn.tbkata : {}
    let id = m.chat
    if (id in conn.tbkata) {
        conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tbkata[id][0])
        throw false
    }
    // di sini dia ngambil data dari api
    let src = await (await fetch(`https://api.betabotz.eu.org/api/game/tebakkata?apikey=${lann}`)).json()
    let json = src
    // buat caption buat di tampilin di wa
    let caption = `⚡ *T E B A K   K A T A* ⚡
⚡━━━━━━━━━━⚡

⬡ *Timeout* » ${(timeout / 1000).toFixed(2)} detik
⬡ *Prefix* » ${usedPrefix}
⬡ *Bonus* » ${poin} money
⬡ *Cara* » Balas/reply soal ini

⚡━━━━━━━━━━⚡
_` + global.wm + ` • ` + global.footer + `_`.trim()
    conn.tbkata[id] = [
        await conn.reply(m.chat, caption, m),
        json, poin,
        setTimeout(() => {
            if (conn.tbkata[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.tbkata[id][0])
            delete conn.tbkata[id]
        }, timeout)
    ]
}
handler.help = ['tebakkata']
handler.tags = ['game']
handler.command = /^tebakkata/i
handler.register = false
handler.group = true

module.exports = handler

// tested di bileys versi 6.5.0 dan sharp versi 0.30.5
// danaputra133