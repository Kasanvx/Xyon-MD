// ────────── code made by kasan | WM GROUP : https://chat.whatsapp.com/LknsianRgX9KVNtyTChwZc?mode=gi_t ──────────

const axios    = require('axios')
const GROUP_WM = 'https://chat.whatsapp.com/LknsianRgX9KVNtyTChwZc?mode=gi_t'
const TARGET_GC = '120363424770471912@g.us'

function rupiah(x) { return 'Rp' + Number(x || 0).toLocaleString('id-ID') }
function formatDate(ts) {
  return new Date(ts).toLocaleString('id-ID', {
    timeZone: 'Asia/Jakarta',
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}
function maskPhone(phone) {
  const s = String(phone)
  if (s.length <= 5) return s
  return s.slice(0, 3) + '*'.repeat(s.length - 6) + s.slice(-2)
}

let handler = async (m, { conn }) => {
  try {
    global.db.data.users[m.sender] ||= {}
    const user = global.db.data.users[m.sender]

    if (!user.nokos?.id) {
      return m.reply(
        `❌ *Tidak ada order aktif.*\n\n` +
        `Beli dulu: */nokos*\n` +
        `❓ Panduan: */tutorial*`
      )
    }

    await m.reply('⏳ Mengecek OTP...')

    const res = await axios.get(
      `https://www.rumahotp.io/api/v1/orders/get_status`,
      {
        headers: { 'x-apikey': global.rumahotp, 'Accept': 'application/json' },
        params:  { order_id: user.nokos.id },
        timeout: 30000
      }
    )

    const raw    = res.data
    if (!raw?.success || !raw?.data) return m.reply('❌ Gagal cek OTP. Coba lagi.')

    const d      = raw.data
    const status = String(d.status || '').toLowerCase()
    const otp    = String(d.otp_code || '')
    const phone  = String(d.phone_number || user.nokos.phone || '')
    const tgl    = formatDate(Date.now())
    const pcJid  = user.nokos.userJid || m.sender

    if (otp && otp !== '-') {
      // Kirim nomor full ke PC
      try {
        await conn.reply(pcJid,
`📞 *Nomor Kamu (Private)*

📱 Layanan : ${user.nokos.service}
🌍 Negara  : ${user.nokos.country}
📶 Operator: ${user.nokos.operator || 'any'}
🆔 Order ID: ${user.nokos.id}

📞 *Nomor Lengkap:*
${phone}

🔐 *Kode OTP:* *${otp}*
💰 Harga   : ${rupiah(user.nokos.price)}
📆 Tanggal : ${tgl}`, null)
      } catch (e) { console.error('[OTP] Gagal kirim PC:', e.message) }

      // Kirim OTP ke GC + tag user
      try {
        await conn.sendMessage(TARGET_GC, {
          text:
`📢 *OTP Manual Dicek*

@${pcJid.split('@')[0]} OTP pesanan kamu sudah masuk!

📱 *Layanan*  : ${user.nokos.service}
🌍 *Negara*   : ${user.nokos.country}
📶 *Operator* : ${user.nokos.operator || 'any'}

🆔 *Order ID* : ${user.nokos.id}
📞 *Nomor*    : ${maskPhone(phone)}
🔐 *Kode OTP* : *${otp}*
💰 *Harga*    : ${rupiah(user.nokos.price)}

📆 *Tanggal*  : ${tgl}`,
          mentions: [pcJid]
        })
      } catch (e) { console.error('[OTP] Gagal kirim GC:', e.message) }

      user.nokos = null
      return m.reply('✅ OTP berhasil dikirim ke private chat dan group!')
    }

    if (status === 'canceled' || status === 'expiring') {
      user.saldo += Number(user.nokos.price || 0)
      user.nokos  = null
      return m.reply(
        `❌ *Order sudah dibatalkan/expired.*\n\n` +
        `💰 Saldo dikembalikan: ${rupiah(user.nokos?.price || 0)}`
      )
    }

    return m.reply(
      `⏳ *OTP belum masuk.*\n\n` +
      `🆔 Order ID : ${user.nokos.id}\n` +
      `📱 Layanan  : ${user.nokos.service}\n` +
      `📌 Status   : ${status || 'waiting'}\n\n` +
      `Coba lagi beberapa saat.\n` +
      `❌ Batalkan: */cancel*`
    )

  } catch (e) {
    console.error('otp error:', e)
    m.reply(`❌ Gagal cek OTP: ${e.message}\n\nSilakan lapor ke group:\n${GROUP_WM}`)
  }
}

handler.command = /^otp$/i
handler.tags    = ['store']
handler.help    = ['otp']

module.exports = handler