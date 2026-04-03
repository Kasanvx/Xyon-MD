//kasanvx

let handler = async (m, { conn }) => {

let users = Object.values(global.db.data.users || {})

let totalUser = users.length
let totalSaldoUser = 0
let totalOrder = 0

for (let u of users) {
  if (u.saldo) totalSaldoUser += u.saldo
  if (u.totalOrder) totalOrder += u.totalOrder
}

let stat = global.db.data.stats || {}

let income = stat.income || 0        // uang masuk (deposit / pembayaran user)
let expense = stat.expense || 0      // biaya beli OTP ke provider
let profit = income - expense

let uptime = process.uptime() * 1000

let text = `📊 *STATISTIK BOT OTP*

👥 Total User : ${totalUser}

━━━━━━━━━━━━━━━━━━
💰 *KEUANGAN (ALL TIME)*

Pendapatan : Rp${income.toLocaleString('id-ID')}
Pengeluaran : Rp${expense.toLocaleString('id-ID')}

Profit Bersih : Rp${profit.toLocaleString('id-ID')}

━━━━━━━━━━━━━━━━━━
📦 *TRANSAKSI*

Total Order : ${totalOrder}

━━━━━━━━━━━━━━━━━━
👛 *SALDO USER*

Total Saldo User : Rp${totalSaldoUser.toLocaleString('id-ID')}

━━━━━━━━━━━━━━━━━━
⚙️ *BOT*

Runtime : ${clockString(uptime)}
Status : Online`

conn.reply(m.chat, text, m)

}

function clockString(ms) {
let h = Math.floor(ms / 3600000)
let m = Math.floor(ms / 60000) % 60
let s = Math.floor(ms / 1000) % 60
return [h, m, s].map(v => v.toString().padStart(2,'0')).join(':')
}

handler.help = ['stats']
handler.tags = ['owner']
handler.command = /^(stats)$/i
handler.owner = true

module.exports = handler