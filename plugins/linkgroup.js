//kasanvx

let handler = async (m, { conn, isAdmin, isOwner, botAdmin }) => {
  if (!m.isGroup) return m.reply('Fitur ini hanya bisa digunakan di dalam group.')
  if (!(isAdmin || isOwner)) return m.reply('Khusus admin group.')
  if (!botAdmin) return m.reply('Bot harus menjadi admin terlebih dahulu.')

  try {
    let code = await conn.groupInviteCode(m.chat)
    let link = 'https://chat.whatsapp.com/' + code

    await m.reply(
`🔗 *LINK GROUP*

${link}`
    )
  } catch (e) {
    await m.reply('❌ Gagal mengambil link group.')
  }
}

handler.help = ['getlinkgroup']
handler.tags = ['group']
handler.command = /^(getlinkgroup|getlink|linkgc|linkgroup)$/i

module.exports = handler