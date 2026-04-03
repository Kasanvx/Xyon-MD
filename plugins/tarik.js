// ────────── code made by kasan | WM GROUP : https://chat.whatsapp.com/LknsianRgX9KVNtyTChwZc?mode=gi_t ──────────

const axios    = require('axios')
const OWNER    = '6287767510608@s.whatsapp.net'
const GROUP_WM = 'https://chat.whatsapp.com/LknsianRgX9KVNtyTChwZc?mode=gi_t'
const BASE     = 'https://yogateway.id/api.php'

const failText = (alasan = 'lagi error') =>
  `Yahh fiturnya lagi ${alasan} 😿\n\nSilakan lapor ke group:\n${GROUP_WM}`

function getKey() { return global.yosec || '' }
function rupiah(x) { return 'Rp' + Number(x || 0).toLocaleString('id-ID') }

let _cache = null
let _cacheTime = 0

async function getEwallets() {
  if (_cache && Date.now() - _cacheTime < 10 * 60 * 1000) return _cache
  const res = await axios.get(BASE, {
    params: { action: 'get_withdrawal_methods', apikey: getKey() },
    timeout: 15000
  })
  if (!res.data?.status) throw new Error('Gagal ambil metode')
  _cache     = (res.data.data || []).filter(v => v.type === 'EWALLET' && v.is_active)
  _cacheTime = Date.now()
  return _cache
}

let handler = async (m, { conn, args, usedPrefix, command }) => {
  try {
    if (m.sender !== OWNER) return m.reply('❌ Khusus owner.')
    if (!getKey()) return m.reply('❌ API Key belum diset.')

    const sub  = String(args[0] || '').toLowerCase()
    const kode = String(args[1] || '').toUpperCase()
    const nohp = String(args[2] || '').replace(/[^0-9]/g, '')
    const nom  = parseInt(args[3])

    // ── LIST EWALLET ──
    if (!sub || sub === 'list') {
      await m.reply('⏳ Mengambil daftar e-wallet...')
      const list = await getEwallets()
      if (!list.length) return m.reply('❌ Tidak ada e-wallet aktif.')

      let txt = `📱 *DAFTAR E-WALLET*\n━━━━━━━━━━━━━━━━━━\n\n`
      list.forEach((v, i) => {
        txt += `*${i+1}.* \`${v.code}\` — ${v.name}\n`
      })
      txt += `\n━━━━━━━━━━━━━━━━━━\n`
      txt += `📌 Cara tarik:\n`
      txt += `*.tarik <kode> <nohp> <nominal>*\n\n`
      txt += `Contoh:\n`
      txt += `*.tarik DANA 081234567890 50000*`
      return m.reply(txt)
    }

    // ── TARIK ──
    if (!kode || !nohp || !nom || isNaN(nom)) {
      return m.reply(
        `❌ *Format salah!*\n\n` +
        `Format:\n` +
        `*.tarik <kode_ewallet> <nohp> <nominal>*\n\n` +
        `Contoh:\n` +
        `*.tarik DANA 081234567890 50000*\n\n` +
        `Lihat daftar: *.tarik list*`
      )
    }

    const list   = await getEwallets()
    const method = list.find(v => v.code === kode)
    if (!method) return m.reply(`❌ E-wallet *${kode}* tidak ditemukan.\n\nLihat daftar: *.tarik list*`)

    await m.reply(`⏳ Memproses penarikan ke *${method.name}*...`)

    const res = await axios.post(`${BASE}?action=request_withdrawal`, {
      apikey:     getKey(),
      bank_code:  kode,
      account_no: nohp,
      amount:     nom
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 20000
    })

    if (!res.data?.status) {
      return m.reply(`❌ *Penarikan Gagal*\n\n⚠️ ${res.data?.message || 'Terjadi kesalahan'}`)
    }

    const d = res.data.data

    return m.reply(
      `━━━━━━━━━━━━━━━━━━\n` +
      `💸 *PENARIKAN BERHASIL*\n` +
      `━━━━━━━━━━━━━━━━━━\n\n` +
      `📱 E-Wallet  : ${method.name}\n` +
      `📞 No. HP    : ${nohp}\n` +
      `💰 Nominal   : ${rupiah(d.amount_requested)}\n` +
      `💳 Admin Fee : ${rupiah(d.admin_fee)}\n` +
      `✅ Diterima  : *${rupiah(d.amount_received)}*\n` +
      `📌 Status    : ${d.status || 'PENDING'}\n` +
      `━━━━━━━━━━━━━━━━━━`
    )

  } catch (e) {
    console.error('tarik error:', e)
    m.reply(failText('lagi error: ' + e.message))
  }
}

handler.command = /^tarik$/i
handler.tags    = ['owner']
handler.help    = ['tarik list', 'tarik <kode> <nohp> <nominal>']
handler.owner   = true

module.exports = handler