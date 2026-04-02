// ============================================
//   BOT SETTINGS - SEMUA ADA DI SINI
// ============================================

// OWNER
global.owner = ['6287767510608']
global.mods = ['6287767510608']
global.prems = ['6287767510608']
global.nameowner = 'Lann'
global.numberowner = '6287767510608'
global.mail = 'support@tioprm.eu.org'
global.gc = 'https://chat.whatsapp.com/FDjn5WA234v8J6jMcb0zei'
global.gcId = '120363424770471912@g.us' // JID grup syarat join
global.instagram = 'https://instagram.com/erlanrahmat_14'

// BRANDING
global.wm = '© Kasan'
global.footer = 'khasan.site'
global.packname = 'Made With'
global.author = 'khasan.site'
global.botname = 'Saxia Botz'
global.scUrl = 'https://khasan.site'

// MENU
global.menuImg = 'https://telegra.ph/file/3a34bfa58714bdef500d9.jpg'
global.menuBefore = `⚡ *S A X I A  B O T Z* ⚡
⚡━━━━━━━━━━⚡

⬡ *Uptime* » %uptime
⬡ *Tanggal* » %date
⬡ *Waktu* » %time
⬡ *Prefix* » [ %_p ]

⚡━━━━━━━━━━⚡
_Halo %name, ada yang bisa dibantu?_`
global.menuAfter = `⚡━━━━━━━━━━⚡
⬡ Ketik *%_phelp <nama fitur>* untuk detail
⬡ Contoh: *%_phelp ttstalk*
⚡━━━━━━━━━━⚡`

// SISTEM
global.wait = '_*Tunggu sedang di proses...*_'
global.eror = '_*Server Error*_'
global.stiker_wait = '*⫹⫺ Stiker sedang dibuat...*'
global.maxwarn = '2'
global.antiporn = true

// PREFIX
global.prefix = './#'

// API KEY (WAJIB DIISI)
global.lann = 'Kasan.7'
global.aksesKey = ''
// Daftar: https://api.betabotz.eu.org

global.APIs = {
  lann: 'https://api.betabotz.eu.org',
}
global.APIKeys = {
  'https://api.betabotz.eu.org': global.lann,
}

// ============================================

let fs = require('fs')
let chalk = require('chalk')
let file = require.resolve(__filename)
fs.watchFile(file, () => {
  fs.unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  delete require.cache[file]
  require(file)
})
