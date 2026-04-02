let fetch = require('node-fetch')

let timeout = 100000
let poin = 10000
const wm = global.wm
let handler = async (m, { conn, usedPrefix }) => {
    conn.asahotak = conn.asahotak ? conn.asahotak : {}
    let id = m.chat
    if (id in conn.asahotak) {
        conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.asahotak[id][0])
        throw false
    }
    // di sini dia ngambil data dari api
    let src = await (await fetch(`https://api.betabotz.eu.org/api/game/asahotak?apikey=${lann}`)).json()
    let json = src
    // buat caption buat di tampilin di wa
    let caption = `⚡ *A S A   H O T A K* ⚡
⚡━━━━━━━━━━⚡

⬡ *Timeout* » ${(timeout / 1000).toFixed(2)} detik
⬡ *Keterangan* » Soal: ${json.soal}
⬡ *Prefix* » ${usedPrefix}
⬡ *Bonus* » ${poin} money
⬡ *Cara* » Balas/reply soal ini

⚡━━━━━━━━━━⚡
_` + global.wm + ` • ` + global.footer + `_`.trim()
    conn.asahotak[id] = [
        await conn.reply(m.chat, caption, m),
        json, poin,
        setTimeout(() => {
            if (conn.asahotak[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.asahotak[id][0])
            delete conn.asahotak[id]
        }, timeout)
    ]
}
handler.help = ['asahotak']
handler.tags = ['game']
handler.command = /^asahotak/i
handler.register = false
handler.group = true

module.exports = handler

// tested di bileys versi 6.5.0 dan sharp versi 0.30.5
// danaputra133