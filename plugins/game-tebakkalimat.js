let fetch = require('node-fetch')

let timeout = 100000
let poin = 500
const wm = global.wm
let handler = async (m, { conn, usedPrefix }) => {
    conn.tebakkalimat = conn.tebakkalimat ? conn.tebakkalimat : {}
    let id = m.chat
    if (id in conn.tebakkalimat) {
        conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakkalimat[id][0])
        throw false
    }
    // di sini dia ngambil data dari api
    let src = await (await fetch(`https://api.betabotz.eu.org/api/game/tebakkalimat?apikey=${lann}`)).json()
    let json = src
    // buat caption buat di tampilin di wa
    let caption = `⚡ *T E B A K   K A L I M A T* ⚡
⚡━━━━━━━━━━⚡

⬡ *Timeout* » ${(timeout / 1000).toFixed(2)} detik
⬡ *Prefix* » ${usedPrefix}
⬡ *Bonus* » ${poin} money
⬡ *Cara* » Balas/reply soal ini

⚡━━━━━━━━━━⚡
_` + global.wm + ` • ` + global.footer + `_`.trim()
    conn.tebakkalimat[id] = [
        await conn.reply(m.chat, caption, m),
        json, poin,
        setTimeout(() => {
            if (conn.tebakkalimat[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.tebakkalimat[id][0])
            delete conn.tebakkalimat[id]
        }, timeout)
    ]
}
handler.help = ['tebakkalimat']
handler.tags = ['game']
handler.command = /^tebakkalimat/i
handler.register = false
handler.group = true

module.exports = handler

// tested di bileys versi 6.5.0 dan sharp versi 0.30.5
// danaputra133