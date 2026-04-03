//kasanvx

const os = require('os')
const { performance } = require('perf_hooks')

let handler = async (m, { conn }) => {
  const start = performance.now()

  let old = process.memoryUsage()
  let cpus = os.cpus() || []

  let totalMem = os.totalmem()
  let freeMem = os.freemem()
  let usedMem = totalMem - freeMem

  let cpuModel = cpus[0]?.model || 'Unknown CPU'
  let cpuSpeed = cpus[0]?.speed || 0

  let uptime = process.uptime() * 1000
  let platform = `${os.platform()} ${os.arch()}`
  let hostname = os.hostname()

  let botMode = global.opts?.self ? 'Self Mode' : 'Public Mode'

  let pingMsg = await conn.reply(m.chat, '🏓 *Sedang mengecek performa bot...*', m)
  const end = performance.now()
  const latency = (end - start).toFixed(2)

  let text = `
╭━〔 *P I N G   B O T* 〕━⬣
┃ 🤖 *Status* : Online
┃ ⚡ *Kecepatan* : ${latency} ms
┃ 🕒 *Runtime* : ${clockString(uptime)}
┃ 🌐 *Mode* : ${botMode}
╰━━━━━━━━━━━━━━━━⬣

╭━〔 *S E R V E R* 〕━⬣
┃ 🖥 *Host* : ${hostname}
┃ 🧩 *Platform* : ${platform}
┃ 💻 *CPU* : ${cpuModel}
┃ 🚀 *Clock* : ${cpuSpeed} MHz
╰━━━━━━━━━━━━━━━━⬣

╭━〔 *M E M O R Y* 〕━⬣
┃ 📦 *RAM Total* : ${formatBytes(totalMem)}
┃ 📉 *RAM Used* : ${formatBytes(usedMem)}
┃ 📈 *RAM Free* : ${formatBytes(freeMem)}
┃ 🧠 *Heap Used* : ${formatBytes(old.heapUsed)}
┃ 🗃 *Heap Total* : ${formatBytes(old.heapTotal)}
╰━━━━━━━━━━━━━━━━⬣

╭━〔 *I N F O* 〕━⬣
┃ 📍 *Node.js* : ${process.version}
┃ 🔄 *PID* : ${process.pid}
┃ 👑 *Owner* : 6285185032092
╰━━━━━━━━━━━━━━━━⬣
`.trim()

  await conn.reply(m.chat, text, m)
}

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => String(v).padStart(2, '0')).join(':')
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i]
}

handler.help = ['ping']
handler.tags = ['info']
handler.command = /^(ping)$/i

module.exports = handler