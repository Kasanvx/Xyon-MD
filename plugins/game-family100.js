let fs = require('fs')
let fetch = require('node-fetch')
let winScore = 500
let rewardAmount = 100 

async function handler(m) {
    conn.family = conn.family ? conn.family : {}
    let id = m.chat
    if (id in conn.family) {
        if (conn.family[id].id !== undefined) return conn.reply(m.chat, 'Masih ada kuis yang belum terjawab di chat ini' + '\nTunggu 3 menit untuk mengakhiri', conn.family[id].msg)
        delete conn.family[id]
        throw false
    }
    conn.family[id] = {}
    let src = await (await fetch(`https://api.betabotz.eu.org/api/game/family100-2?apikey=${lann}`)).json()
    let json = src

    let caption = `⚡ *F A M I L Y   1 0 0* ⚡
⚡━━━━━━━━━━⚡

⬡ *Timeout* » ${(timeout / 1000).toFixed(2)} detik
⬡ *Prefix* » ${usedPrefix}
⬡ *Bonus* » ${poin} money
⬡ *Cara* » Balas/reply soal ini

⚡━━━━━━━━━━⚡
_` + global.wm + ` • ` + global.footer + `_`.trim()
    conn.family[id] = {
        id,
        msg: await m.reply(caption),
        ...json,
        terjawab: Array.from(json.jawaban, () => false),
        winScore,
        rewardAmount, 
        timeout: setTimeout(() => {
            if (conn.family[id]) {
                let allAnswers = conn.family[id].jawaban.map((jawaban, index) => `(${index + 1}) ${jawaban}`).join('\n')
                conn.reply(m.chat, `Waktu habis! Game berakhir.\n\nJawaban yang benar:\n${allAnswers}`, conn.family[id].msg)
                delete conn.family[id]
            }
        }, 180000) // 3 minutes
    }
}
handler.help = ['family100']
handler.tags = ['game']
handler.group = true
handler.command = /^family100$/i

handler.nyerah = async function (m) {
    let id = m.chat
    if (id in conn.family) {
        conn.reply(m.chat, 'Permainan berakhir karena menyerah.', conn.family[id].msg)
        clearTimeout(conn.family[id].timeout)
        delete conn.family[id]
    } else {
        conn.reply(m.chat, 'Tidak ada permainan yang sedang berlangsung.', m)
    }
}

module.exports = handler

//danaputra_133