// ────────── code made by kasan | WM GROUP : https://chat.whatsapp.com/LknsianRgX9KVNtyTChwZc?mode=gi_t ──────────

const axios    = require('axios')
const GROUP_WM = 'https://chat.whatsapp.com/LknsianRgX9KVNtyTChwZc?mode=gi_t'

function rupiah(x) { return 'Rp' + Number(x || 0).toLocaleString('id-ID') }

let handler = async (m, { conn }) => {
  try {
    global.db.data.users[m.sender] ||= {}
    const user = global.db.data.users[m.sender]

    if (!user.nokos?.id) {
      return m.reply(
        `❌ *Tidak ada order aktif.*\n\n` +
        `❓ Masih bingung? Ketik */tutorial*`
      )
    }

    const elapsed   = Date.now() - Number(user.nokos.time || 0)
    const minCancel = 2.5 * 60 * 1000  // 2,5 menit

    if (elapsed < minCancel) {
      const sisaMs    = minCancel - elapsed
      const sisaMenit = Math.floor(sisaMs / 60000)
      const sisaDetik = Math.ceil((sisaMs % 60000) / 1000)
      return m.reply(
        `⏳ *Belum bisa dibatalkan!*\n\n` +
        `Minimal *2,5 menit* setelah order.\n` +
        `Tunggu *${sisaMenit}m ${sisaDetik}s* lagi.\n\n` +
        `❓ Masih bingung? Ketik */tutorial*`
      )
    }

    await m.reply('⏳ Membatalkan order...')

    try {
      await axios.get(
        `https://www.rumahotp.io/api/v1/orders/set_status`,
        {
          headers: { 'x-apikey': global.rumahotp, 'Accept': 'application/json' },
          params:  { order_id: user.nokos.id, status: 'cancel' },
          timeout: 30000
        }
      )
    } catch {}

    const refund  = Number(user.nokos.price || 0)
    const orderId = user.nokos.id
    user.saldo   += refund
    user.nokos    = null

    return m.reply(
      `✅ *Order Berhasil Dibatalkan*\n\n` +
      `🆔 Order ID : ${orderId}\n` +
      `💰 Refund   : *${rupiah(refund)}*\n` +
      `👛 Saldo    : *${rupiah(user.saldo)}*\n\n` +
      `❓ Masih bingung? Ketik */tutorial*`
    )

  } catch (e) {
    console.error('cancel error:', e)
    m.reply(`Yahh fiturnya lagi error 😿\n\nSilakan lapor ke group:\n${GROUP_WM}`)
  }
}

handler.command = /^cancel$/i
handler.tags    = ['store']
handler.help    = ['cancel']

module.exports = handler