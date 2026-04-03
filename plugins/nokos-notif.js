// ────────── code made by kasan | WM GROUP : https://chat.whatsapp.com/LknsianRgX9KVNtyTChwZc?mode=gi_t ──────────

const GROUP_WM = 'https://chat.whatsapp.com/LknsianRgX9KVNtyTChwZc?mode=gi_t'
const OWNER    = '6287767510608@s.whatsapp.net'
const TARGET_GC = '120363424770471912@g.us'

const failText = (alasan = 'lagi error') =>
  `Yahh fiturnya lagi ${alasan} 😿\n\nSilakan lapor ke group:\n${GROUP_WM}`

// ── Pesan ──
function msgStart() {
  return `╔══════════════════════════╗
║  🔧 *MAINTENANCE NOKOS*  ║
╚══════════════════════════╝

📢 *Pemberitahuan Maintenance & Restok*

Kami informasikan bahwa layanan *Nokos* sedang dalam proses maintenance untuk restok nomor dan peningkatan kualitas layanan.

🕒 *Waktu:* 23:00 – 00:20 WIB

⚠️ Selama maintenance berlangsung, layanan mungkin tidak dapat digunakan sementara. Setelah selesai, layanan akan kembali normal dengan stok yang diperbarui.

Mohon maaf atas ketidaknyamanannya. 🙏

— *Kasanvx*`
}

function msgEnd() {
  return `╔══════════════════════════╗
║  ✅ *MAINTENANCE SELESAI* ║
╚══════════════════════════╝

Alhamdulillah! Layanan *Nokos* sudah kembali normal. 🎉

📦 Stok sudah diperbarui dan siap digunakan kembali.

Terima kasih atas kesabaran dan pengertiannya. 🙏

— *Kasanvx*`
}

// ── Waktu WIB ──
function getWIBTime() {
  const utc = Date.now() + (new Date().getTimezoneOffset() * 60000)
  const wib = new Date(utc + 7 * 3600000)
  return {
    hour:   wib.getHours(),
    minute: wib.getMinutes(),
    date:   `${wib.getFullYear()}-${String(wib.getMonth()+1).padStart(2,'0')}-${String(wib.getDate()).padStart(2,'0')}`
  }
}

// ── DB Helper ──
function ensureDB() {
  global.db                               ??= { data: {} }
  global.db.data                          ??= {}
  global.db.data.settings                 ??= {}
  global.db.data.settings.nokosMaint      ??= {}

  const nm = global.db.data.settings.nokosMaint
  nm.auto          ??= false
  nm.lastStart     ??= ''
  nm.lastEnd       ??= ''
}

function nm() { return global.db.data.settings.nokosMaint }

// ── Kirim notif ──
async function checkAndSend(conn) {
  try {
    ensureDB()
    if (!nm().auto) return

    const { hour, minute, date } = getWIBTime()

    // Notif mulai — jam 23:00 WIB (toleransi 3 menit)
    if (hour === 23 && minute >= 0 && minute <= 2) {
      if (nm().lastStart !== date) {
        console.log(`[MAINT] Kirim notif mulai... (${date} 23:0${minute})`)
        await conn.sendMessage(TARGET_GC, { text: msgStart() })
        nm().lastStart = date
      }
    }

    // Notif selesai — jam 00:20 WIB
    // Tanggal berubah jadi +1, tapi lastStart masih kemarin → aman
    if (hour === 0 && minute >= 20 && minute <= 22) {
      if (nm().lastEnd !== date) {
        console.log(`[MAINT] Kirim notif selesai... (${date} 00:${minute})`)
        await conn.sendMessage(TARGET_GC, { text: msgEnd() })
        nm().lastEnd = date
      }
    }

  } catch (e) {
    console.error('[MAINT] checkAndSend error:', e.message)
  }
}

// ── Scheduler ──
function startScheduler(conn) {
  // Hentikan scheduler lama kalau ada
  if (global.__nokosMaintScheduler) {
    clearInterval(global.__nokosMaintScheduler)
    global.__nokosMaintScheduler = null
  }

  global.__nokosMaintConn = conn

  global.__nokosMaintScheduler = setInterval(async () => {
    // Selalu pakai conn terbaru
    const c = global.__nokosMaintConn || conn
    await checkAndSend(c)
  }, 60_000)

  console.log('[MAINT] ✅ Scheduler aktif (cek tiap 1 menit)')

  // Cek langsung setelah 3 detik (bukan 5 detik, lebih cepat)
  setTimeout(() => checkAndSend(conn), 3000)
}

function stopScheduler() {
  if (global.__nokosMaintScheduler) {
    clearInterval(global.__nokosMaintScheduler)
    global.__nokosMaintScheduler = null
    global.__nokosMaintConn = null
    console.log('[MAINT] ⛔ Scheduler dimatikan')
  }
}

// ── Status ──
function statusText() {
  ensureDB()
  const auto  = nm().auto ? '✅ AKTIF' : '❌ NONAKTIF'
  const sched = global.__nokosMaintScheduler ? '🟢 Berjalan' : '🔴 Mati'

  return `📌 *AUTO NOTIF MAINTENANCE NOKOS*
━━━━━━━━━━━━━━━━━━
*Status*     : ${auto}
*Scheduler*  : ${sched}
*Target GC*  : ${TARGET_GC}

*Jadwal Kirim:*
🔧 Mulai  → 23:00 WIB
✅ Selesai → 00:20 WIB

*Riwayat:*
📤 Terakhir mulai   : ${nm().lastStart || 'Belum pernah'}
📥 Terakhir selesai : ${nm().lastEnd   || 'Belum pernah'}

*Perintah:*
• .notif on          → Aktifkan
• .notif off         → Nonaktifkan
• .notif info        → Lihat status
• .notif test start  → Test notif mulai
• .notif test end    → Test notif selesai
• .notif reset       → Reset riwayat`
}

// ── Handler ──
let handler = async (m, { conn, args }) => {
  try {
    ensureDB()

    if (m.sender !== OWNER) {
      return m.reply('❌ *Akses ditolak!* Fitur ini hanya untuk owner.')
    }

    // Update conn terbaru setiap ada command
    global.__nokosMaintConn = conn

    const cmd  = String(args[0] || 'info').toLowerCase()
    const sub  = String(args[1] || '').toLowerCase()

    // Test
    if (cmd === 'test') {
      if (sub === 'start') {
        await conn.sendMessage(TARGET_GC, { text: msgStart() })
        return m.reply('✅ *Test notif mulai berhasil dikirim!*')
      }
      if (sub === 'end') {
        await conn.sendMessage(TARGET_GC, { text: msgEnd() })
        return m.reply('✅ *Test notif selesai berhasil dikirim!*')
      }
      return m.reply('❌ Gunakan: `.notif test start` atau `.notif test end`')
    }

    // Reset
    if (cmd === 'reset') {
      nm().lastStart = ''
      nm().lastEnd   = ''
      return m.reply('✅ *Riwayat notif maintenance direset!*')
    }

    // On / Off / Info
    switch (cmd) {
      case 'on':
        nm().auto = true
        startScheduler(conn)
        return m.reply(`✅ *Auto notif maintenance diaktifkan!*\n\n${statusText()}`)

      case 'off':
        nm().auto = false
        stopScheduler()
        return m.reply(`⛔ *Auto notif maintenance dimatikan!*\n\n${statusText()}`)

      case 'info':
      default:
        return m.reply(statusText())
    }

  } catch (e) {
    console.error('[MAINT] Handler error:', e)
    m.reply(failText('lagi error: ' + e.message))
  }
}

handler.command  = /^(notif|maintenance)$/i
handler.tags     = ['owner']
handler.help     = ['notif on', 'notif off', 'notif info', 'notif test', 'notif reset']
handler.owner    = true

// Before: jalan tiap ada pesan → pastikan scheduler tetap hidup
handler.before = async function (m, { conn }) {
  try {
    ensureDB()
    // Update conn terbaru
    if (conn) global.__nokosMaintConn = conn
    // Nyalakan ulang scheduler kalau mati padahal auto=true
    if (nm().auto && !global.__nokosMaintScheduler) {
      console.log('[MAINT] Scheduler mati tapi auto=true, restart...')
      startScheduler(conn)
    }
  } catch (e) {
    console.error('[MAINT] Before handler error:', e.message)
  }
}

module.exports = handler