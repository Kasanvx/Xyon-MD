let fetch = require('node-fetch')
let handler = async (m, { text, usedPrefix, command }) => {
    if (!text) throw `contoh:\n${usedPrefix + command} erlanrahmat_14`
    try {
        let api = await fetch(`https://api.betabotz.eu.org/api/stalk/ig?username=${text}&apikey=${lann}`)
        let response = await api.json()
        if (response.status) {
            let { photoUrl, postsCount, followers, following, bio, fullName, username } = response.result;
            let capt = `⚡ *I N S T A G R A M  S T A L K* ⚡\n⚡━━━━━━━━━━⚡\n\n`;
            capt += `⬡ *Username* » ${username}\n`;
            capt += `⬡ *Full Name* » ${fullName}\n`;
            capt += `⬡ *Bio* » ${bio}\n`;
            capt += `⬡ *Followers* » ${followers}\n`;
            capt += `⬡ *Following* » ${following}\n`;
            capt += `⬡ *Total Post* » ${postsCount}\n`;
            capt += `\n⚡━━━━━━━━━━⚡\n_` + global.wm + ` • ` + global.footer + `_`;
            return conn.sendFile(m.chat, photoUrl, 'pp.png', capt, m)
        } else {
            throw 'Sistem Sedang Bermasalah!'
        }
    } catch (e) {
        m.reply('Sistem Sedang Bermasalah!')
    }
}

handler.help = ['igstalk <username>']
handler.tags = ['stalk']
handler.command = /^(igstalk)$/i
handler.limit = true

module.exports = handler
