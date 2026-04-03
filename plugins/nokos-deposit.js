// credits : kasan
const axios = require('axios')

const TARGET_GC = '120363424770471912@g.us'
const APIKEY = global.rumahotp || process.env.RUMAHOTP_APIKEY
const MIN_DEPOSIT = 2000
const CHECK_INTERVAL = 10000

function userData(id) {
    global.db.data.users[id] ||= {}
    let user = global.db.data.users[id]
    if (typeof user.saldo !== 'number') user.saldo = 0
    if (!user.deposit) user.deposit = null
    return user
}

function rupiah(x) {
    return 'Rp' + Number(x || 0).toLocaleString('id-ID')
}

function formatDate(ts) {
    return new Date(ts).toLocaleString('id-ID', {
        timeZone: 'Asia/Jakarta',
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    })
}

async function api(path, params = {}) {
    const res = await axios.get(`https://www.rumahotp.io/api${path}`, {
        headers: { 'x-apikey': APIKEY, 'Accept': 'application/json' },
        params,
        timeout: 30000
    })
    return res.data
}

async function notifGC(conn, tipe, data = {}) {
    try {
        let text = ''
        if (tipe === 'success') {
            text = `╔══════════════════════╗\n║  💰 *DEPOSIT MASUK* ║\n╚══════════════════════╝\n\n👤 *User:* ${data.user}\n🆔 *ID:* ${data.id}\n💵 *Nominal:* ${rupiah(data.diterima)}\n💳 *Fee:* ${rupiah(data.fee)}\n💰 *Saldo Sekarang:* ${rupiah(data.saldo)}\n\n📆 *Tanggal:* ${formatDate(Date.now())}`
        } else if (tipe === 'cancel') {
            text = `╔══════════════════════╗\n║  ❌ *DEPOSIT GAGAL* ║\n╚══════════════════════╝\n\n👤 *User:* ${data.user}\n🆔 *ID:* ${data.id}\n💵 *Nominal:* ${rupiah(data.total)}\n📌 *Status:* Dibatalkan / Expired\n\n📆 *Tanggal:* ${formatDate(Date.now())}`
        } else if (tipe === 'expired') {
            text = `╔═══════════════════════╗\n║  ⏰ *DEPOSIT EXPIRED* ║\n╚═══════════════════════╝\n\n👤 *User:* ${data.user}\n🆔 *ID:* ${data.id}\n💵 *Nominal:* ${rupiah(data.total)}\n📌 *Status:* Waktu habis\n\n📆 *Tanggal:* ${formatDate(Date.now())}`
        }
        if (text) await conn.sendMessage(TARGET_GC, { text })
    } catch (e) {}
}

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!APIKEY) return m.reply('API RumahOTP belum diset.')
    global.db.data.depositClaims ||= {}
    let user = userData(m.sender)

    if (/^deposit$/i.test(command)) {
        if (!args[0] || isNaN(args[0])) {
            return m.reply(`*DEPOSIT QRIS*\n\nContoh:\n${usedPrefix}deposit 5000\n\nMinimal deposit: ${rupiah(MIN_DEPOSIT)}`)
        }
        let nominal = parseInt(args[0])
        if (nominal < MIN_DEPOSIT) return m.reply(`Minimal deposit ${rupiah(MIN_DEPOSIT)}`)
        if (user.deposit && user.deposit.status === 'pending') {
            return m.reply(`Kamu masih punya deposit pending.\n\nID: ${user.deposit.id}\nTotal: ${rupiah(user.deposit.total)}\n\nKetik:\n${usedPrefix}cekdeposit\natau\n${usedPrefix}depositcancel`)
        }
        await m.reply('Sedang membuat QRIS...')
        try {
            let res = await api('/v2/deposit/create', { amount: nominal, payment_id: 'qris' })
            if (!res.success || !res.data) return m.reply(`Gagal membuat deposit.\n${res?.error?.message || ''}`)
            let d = res.data
            let qrImage = String(d.qr_image || '')
            let imgRes = await axios.get(qrImage, { responseType: 'arraybuffer' })
            let buffer = Buffer.from(imgRes.data, 'binary')
            let total = Number(d.total || nominal)
            let expired = Number(d.expired_at_ts || 0)
            let sent = await conn.sendMessage(m.chat, {
                image: buffer,
                caption: `*DEPOSIT QRIS*\n\nID: ${d.id}\nTotal bayar: ${rupiah(total)}\nFee: ${rupiah(d.fee || 0)}\nSaldo masuk: ${rupiah(d.diterima || nominal)}\nExpired: ${expired ? new Date(expired).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }) + ' WIB' : '-'}\n\nSetelah bayar, saldo akan masuk otomatis.\nCek manual: ${usedPrefix}cekdeposit`
            }, { quoted: m })
            user.deposit = {
                id: String(d.id),
                total,
                fee: Number(d.fee || 0),
                diterima: Number(d.diterima || nominal),
                expired,
                created: Date.now(),
                status: 'pending',
                chat: m.chat,
                msgKey: sent?.key || null,
                userJid: m.sender
            }
            if (!global.depositWatcherStarted) {
                global.depositWatcherStarted = true
                setInterval(async () => {
                    if (!global.conn || !global.db?.data?.users || !APIKEY) return
                    let users = global.db.data.users
                    global.db.data.depositClaims ||= {}
                    for (let jid in users) {
                        let u = users[jid]
                        if (!u?.deposit || u.deposit.status !== 'pending') continue
                        const userName = u.deposit.userJid ? u.deposit.userJid.split('@')[0] : jid.split('@')[0]
                        try {
                            let st = await api('/v2/deposit/get_status', { deposit_id: u.deposit.id })
                            if (!st.success || !st.data) continue
                            let status = String(st.data.status || '').toLowerCase()
                            if (status === 'success') {
                                if (global.db.data.depositClaims[u.deposit.id]) {
                                    u.deposit = null
                                    continue
                                }
                                global.db.data.depositClaims[u.deposit.id] = true
                                u.saldo += Number(u.deposit.diterima || 0)
                                try {
                                    if (u.deposit.msgKey) await global.conn.sendMessage(u.deposit.chat, { delete: u.deposit.msgKey })
                                } catch {}
                                await global.conn.sendMessage(u.deposit.chat, { text: `*DEPOSIT BERHASIL*\n\nID: ${u.deposit.id}\nSaldo masuk: ${rupiah(u.deposit.diterima)}\nSaldo sekarang: ${rupiah(u.saldo)}` })
                                await notifGC(global.conn, 'success', { user: userName, id: u.deposit.id, diterima: u.deposit.diterima, fee: u.deposit.fee, saldo: u.saldo })
                                u.deposit = null
                                continue
                            }
                            if (status === 'cancel') {
                                try {
                                    if (u.deposit.msgKey) await global.conn.sendMessage(u.deposit.chat, { delete: u.deposit.msgKey })
                                } catch {}
                                await global.conn.sendMessage(u.deposit.chat, { text: `*DEPOSIT EXPIRED / DIBATALKAN*\n\nID: ${u.deposit.id}\nSilakan buat deposit baru lagi.` })
                                await notifGC(global.conn, 'cancel', { user: userName, id: u.deposit.id, total: u.deposit.total })
                                u.deposit = null
                                continue
                            }
                            if (u.deposit.expired && Date.now() > Number(u.deposit.expired) + 15000) {
                                try {
                                    if (u.deposit.msgKey) await global.conn.sendMessage(u.deposit.chat, { delete: u.deposit.msgKey })
                                } catch {}
                                await global.conn.sendMessage(u.deposit.chat, { text: `*DEPOSIT EXPIRED*\n\nID: ${u.deposit.id}\nSilakan buat deposit baru lagi.` })
                                await notifGC(global.conn, 'expired', { user: userName, id: u.deposit.id, total: u.deposit.total })
                                u.deposit = null
                                continue
                            }
                        } catch {}
                    }
                }, CHECK_INTERVAL)
            }
        } catch (e) {
            return m.reply('Terjadi kesalahan server.')
        }
    }

    if (/^(cekdeposit|depositcek)$/i.test(command)) {
        if (!user.deposit) return m.reply('Tidak ada deposit pending.')
        try {
            let res = await api('/v2/deposit/get_status', { deposit_id: user.deposit.id })
            if (!res.success || !res.data) return m.reply('Gagal cek deposit.')
            let d = res.data
            let status = String(d.status || '').toLowerCase()
            if (status === 'success') {
                global.db.data.depositClaims ||= {}
                if (global.db.data.depositClaims[user.deposit.id]) {
                    user.deposit = null
                    return m.reply('Deposit ini sudah pernah diklaim.')
                }
                global.db.data.depositClaims[user.deposit.id] = true
                user.saldo += Number(user.deposit.diterima || 0)
                try {
                    if (user.deposit.msgKey) await conn.sendMessage(user.deposit.chat || m.chat, { delete: user.deposit.msgKey })
                } catch {}
                let masuk = Number(user.deposit.diterima || 0)
                let id = user.deposit.id
                user.deposit = null
                return m.reply(`*DEPOSIT BERHASIL*\n\nID: ${id}\nSaldo masuk: ${rupiah(masuk)}\nSaldo sekarang: ${rupiah(user.saldo)}`)
            }
            if (status === 'cancel') {
                let id = user.deposit.id
                try {
                    if (user.deposit.msgKey) await conn.sendMessage(user.deposit.chat || m.chat, { delete: user.deposit.msgKey })
                } catch {}
                user.deposit = null
                return m.reply(`Deposit ${id} dibatalkan / expired.`)
            }
            return m.reply(`Status deposit: ${status}`)
        } catch {
            return m.reply('Terjadi kesalahan saat cek deposit.')
        }
    }

    if (/^depositcancel$/i.test(command)) {
        if (!user.deposit) return m.reply('Tidak ada deposit pending.')
        try {
            let res = await api('/v1/deposit/cancel', { deposit_id: user.deposit.id })
            if (!res.success) return m.reply('Gagal membatalkan deposit dari server.')
            let id = user.deposit.id
            let total = user.deposit.total
            try {
                if (user.deposit.msgKey) await conn.sendMessage(user.deposit.chat || m.chat, { delete: user.deposit.msgKey })
            } catch {}
            user.deposit = null
            await m.reply(`Deposit ${id} berhasil dibatalkan.`)
            await notifGC(conn, 'cancel', { user: m.sender.split('@')[0], id, total })
        } catch {
            return m.reply('Terjadi kesalahan saat membatalkan deposit.')
        }
    }
}

handler.help = ['deposit <nominal>', 'cekdeposit', 'depositcancel']
handler.tags = ['nokos']
handler.command = /^(deposit|depositcek|cekdeposit|depositcancel)$/i

module.exports = handler