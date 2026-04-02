const { getDevice } = require('@adiwajshing/baileys')

const wm = global.wm
let handler = async (m) => {
	m.reply(await getDevice(m.quoted ? m.quoted.id : m.key.id))
}

handler.help = ['device']
handler.tags = ['tools']
handler.command = /^(device)$/i

module.exports = handler
