const JavaScriptObfuscator = require('javascript-obfuscator')

const wm = global.wm
let handler = async (m, { conn, text }) => {
if (!text) throw `[!] Masukan textnya`
let res = JavaScriptObfuscator.obfuscate(text)
conn.reply(m.chat, res.getObfuscatedCode(), m)
}
handler.help = ['enc']
handler.tags = ['tools']
handler.command = /^enc$/i

module.exports = handler
