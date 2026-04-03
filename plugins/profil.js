// ────────── code made by kasan | WM GROUP : https://chat.whatsapp.com/LknsianRgX9KVNtyTChwZc?mode=gi_t ──────────

const axios    = require('axios')
const OWNER    = '6287767510608@s.whatsapp.net'
const GROUP_WM = 'https://chat.whatsapp.com/LknsianRgX9KVNtyTChwZc?mode=gi_t'
const BASE     = 'https://yogateway.id/api.php'

const failText = (alasan = 'lagi error') =>
  `Yahh fiturnya lagi ${alasan} 😿\n\nSilakan lapor ke group:\n${GROUP_WM}`

function getKey() { return global.yosec || '' }
function rupiah(x) { return 'Rp' + Number(x || 0).toLocaleString('id-ID') }

let handler = async (m) => {
  try {
    if (m.sender !== OWNER) return m.reply('❌ Khusus owner.')
    if (!getKey()) return m.reply('❌ API Key belum diset.')

    await m.reply('⏳ Mengambil data profil...')

    const res = await axios.get(BASE, {
      params: { action: 'check_profile', apikey: getKey() },
      timeout: 15000
    })

    if (!res.data?.status || !res.data?.data) {
      return m.reply(failText('gagal ambil profil'))
    }

    const d = res.data.data

    return m.reply(
      `👤 *PROFIL MERCHANT*\n` +
      `━━━━━━━━━━━━━━━━━━\n\n` +
      `🏢 Nama Project : ${d.project_name || '-'}\n` +
      `👤 Username     : Snx7\n` + 
      `💰 Saldo        : *${rupiah(d.current_balance)}*\n` +
      `📌 Status       : ${d.is_active ? '✅ Aktif' : '❌ Nonaktif'}`
    )

  } catch (e) {
    console.error('profil error:', e)
    m.reply(failText('lagi error: ' + e.message))
  }
}

handler.command = /^(profil|ceksaldomerchant)$/i
handler.tags    = ['owner']
handler.help    = ['profil']
handler.owner   = true

module.exports = handler