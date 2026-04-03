const handler = async (m, { conn }) => {
    // Memastikan data pengguna dan saldo ada di dalam database
    global.db.data.users[m.sender] ||= {};
    global.db.data.users[m.sender].saldo ||= 0;

    // Mengambil data saldo saat ini
    const saldo = global.db.data.users[m.sender].saldo;

    // Memformat angka saldo menjadi format titik ribuan Rupiah (contoh: 50000 -> 50.000)
    const saldoFormat = saldo.toLocaleString('id-ID');

    // Mengambil nomor pengirim untuk di-mention
    const senderNumber = `@${m.sender.split('@')[0]}`;

    // Menyusun teks balasan dengan gaya Box Minimalis
    const txt = `
┌───「 INFO SALDO 」
│ Pengguna : ${senderNumber}
│ Saldo    : Rp ${saldoFormat}
└──────────────
    `.trim();

    // Mengirim pesan dengan mention agar nomor pengguna berubah menjadi tag biru
    await conn.sendMessage(m.chat, { 
        text: txt, 
        mentions: [m.sender] 
    }, { quoted: m });
};

// Pengaturan command
handler.help = ['saldo', 'ceksaldo'];
handler.tags = ['nokos'];
// Mendukung perintah /saldo atau /ceksaldo
handler.command = /^(saldo|ceksaldo)$/i; 

module.exports = handler;