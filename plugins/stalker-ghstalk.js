let fetch = require('node-fetch')

let handler = async (m, { text, usedPrefix, command }) => {
    if (!text) throw `*Example:* ${usedPrefix + command} ERLANRAHMAT`   
    try {     
        let json = await fetch(`https://api.betabotz.eu.org/api/stalk/github?username=${text}&apikey=${lann}`).then(res => res.json());
        caption += `	◦  *Url* : ${json.result.user.githubUrl}\n`    
        let caption = `⚡ *G I T H U B  S T A L K* ⚡\n⚡━━━━━━━━━━⚡\n\n`;
        caption += `⬡ *Username* » ${json.result.user.username}\n`;
        caption += `⬡ *Followers* » ${json.result.user.followers}\n`;
        caption += `⬡ *Following* » ${json.result.user.following}\n`;
        caption += `⬡ *Bio* » ${json.result.user.bio}\n`;
        caption += `⬡ *Type* » ${json.result.user.type}\n`;
        caption += `⬡ *Company* » ${json.result.user.company}\n`;
        caption += `⬡ *Public Repos* » ${json.result.user.publicRepos}\n`;
        caption += `⬡ *Github URL* » ${json.result.user.githubUrl}\n`;
        caption += `\n⚡━━━━━━━━━━⚡\n_` + global.wm + ` • ` + global.footer + `_`;
        conn.relayMessage(m.chat, {
            extendedTextMessage: {
                text: caption,
                contextInfo: {
                    externalAdReply: {
                        title: global.wm,
                        mediaType: 1,
                        previewType: 0,
                        renderLargerThumbnail: true,
                        thumbnailUrl: json.result.user.avatarUrl,
                        sourceUrl: ''
                    }
                }, mentions: [m.sender]
            }
        }, {})
    } catch (e) {     
        throw `Error: ${eror}`
    }
}
handler.help = ['ghstalk <username>']
handler.tags = ['stalk']
handler.command = /^(ghstalk|githubstalk)$/i
handler.limit = true

module.exports = handler
