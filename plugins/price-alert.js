//kasanvx

const axios = require('axios')

const APIKEY = global.rumahotp || process.env.RUMAHOTP_APIKEY
const OWNER = '6287767510608@s.whatsapp.net'
const TARGET_GC = '120363424770471912@g.us'
const SERVICE_ID = 13 // WhatsApp
const PROFIT = 500
const CHECK_INTERVAL = 5 * 60 * 1000 // 5 menit

function rupiah(x) {
  return 'Rp' + Number(x || 0).toLocaleString('id-ID')
}

async function api(path, params = {}) {
  const res = await axios.get(`https://www.rumahotp.com/api${path}`, {
    headers: {
      'x-apikey': APIKEY,
      'Accept': 'application/json'
    },
    params,
    timeout: 30000
  })
  return res.data
}

function pickBestPricelist(pricelist = []) {
  let list = pricelist
    .filter(v => v && v.provider_id && Number(v.price) > 0 && v.available !== false)
    .map(v => ({
      provider_id: String(v.provider_id),
      price: Number(v.price || 0),
      rate: Number(v.rate || 0),
      stock: Number(v.stock || 0)
    }))
    .sort((a, b) => {
      if (b.rate !== a.rate) return b.rate - a.rate
      if (b.stock !== a.stock) return b.stock - a.stock
      return a.price - b.price
    })

  return list[0] || null
}

function formatDate() {
  return new Date().toLocaleString('id-ID', {
    timeZone: 'Asia/Jakarta',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function ensureDB() {
  global.db.data.priceAlert ||= {}
  global.db.data.priceAlert.enabled ||= false
  global.db.data.priceAlert.lastCheck ||= 0
  global.db.data.priceAlert.whatsapp ||= {}
}

async function checkWhatsappPriceAlert(conn) {
  try {
    if (!APIKEY) return
    ensureDB()

    if (!global.db.data.priceAlert.enabled) return
    if (Date.now() - global.db.data.priceAlert.lastCheck < CHECK_INTERVAL) return

    global.db.data.priceAlert.lastCheck = Date.now()

    let res = await api('/v2/countries', { service_id: SERVICE_ID })
    if (!res.success || !Array.isArray(res.data)) return

    let oldData = global.db.data.priceAlert.whatsapp || {}
    let newData = {}
    let turun = []
    let naik = []

    for (let v of res.data) {
      if (!v || !Array.isArray(v.pricelist) || !v.pricelist.length) continue

      let best = pickBestPricelist(v.pricelist)
      if (!best) continue

      let country = String(v.name || '').trim()
      if (!country) continue

      let currentPrice = Number(best.price || 0) + PROFIT
      newData[country] = currentPrice

      if (typeof oldData[country] === 'number') {
        if (currentPrice < oldData[country]) {
          turun.push({
            country,
            oldPrice: oldData[country],
            newPrice: currentPrice
          })
        }

        if (currentPrice > oldData[country]) {
          naik.push({
            country,
            oldPrice: oldData[country],
            newPrice: currentPrice
          })
        }
      }
    }

    global.db.data.priceAlert.whatsapp = newData

    if (!turun.length && !naik.length) return

    let txt = `📊 *PRICE ALERT WHATSAPP*\n\n`

    if (turun.length) {
      txt += `📉 *Harga Turun*\n`
      turun.slice(0, 20).forEach((v, i) => {
        txt += `${i + 1}. ${v.country}\n`
        txt += `   ${rupiah(v.oldPrice)} → ${rupiah(v.newPrice)}\n`
      })
      txt += `\n`
    }

    if (naik.length) {
      txt += `📈 *Harga Naik*\n`
      naik.slice(0, 20).forEach((v, i) => {
        txt += `${i + 1}. ${v.country}\n`
        txt += `   ${rupiah(v.oldPrice)} → ${rupiah(v.newPrice)}\n`
      })
      txt += `\n`
    }

    txt += `🕒 Update: ${formatDate()} WIB`

    await conn.sendMessage(TARGET_GC, { text: txt })
  } catch {}
}

function ensureScheduler(conn) {
  if (global.__priceAlertScheduler) return

  global.__priceAlertScheduler = setInterval(() => {
    checkWhatsappPriceAlert(conn).catch(() => {})
  }, 15000)
}

let handler = async (m, { conn, args }) => {
  ensureDB()
  ensureScheduler(conn)

  let mode = String(args[0] || 'info').toLowerCase()

  if (m.sender !== OWNER) {
    return m.reply('Khusus owner.')
  }

  if (mode === 'on') {
    global.db.data.priceAlert.enabled = true
    return m.reply(`✅ Price Alert WhatsApp diaktifkan.\nTarget GC: ${TARGET_GC}`)
  }

  if (mode === 'off') {
    global.db.data.priceAlert.enabled = false
    return m.reply(`✅ Price Alert WhatsApp dimatikan.`)
  }

  if (mode === 'test') {
    global.db.data.priceAlert.lastCheck = 0
    await checkWhatsappPriceAlert(conn)
    return m.reply('✅ Price Alert dicek manual.')
  }

  return m.reply(
`📉 *PRICE ALERT WHATSAPP*
Status : ${global.db.data.priceAlert.enabled ? 'AKTIF' : 'NONAKTIF'}
Target : ${TARGET_GC}
Interval : 5 menit

Perintah:
.pricealert on
.pricealert off
.pricealert test`
  )
}

handler.before = async function (m, { conn }) {
  ensureDB()
  ensureScheduler(conn)
}

handler.help = ['pricealert on', 'pricealert off', 'pricealert test']
handler.tags = ['owner']
handler.command = /^(pricealert)$/i
handler.owner = true

module.exports = handler