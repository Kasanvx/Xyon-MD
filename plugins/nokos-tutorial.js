// improved by : Partner Coding

const handler = async (m, { conn }) => {
  // Menggunakan gaya Box Style agar konsisten dengan menu utama
  const txt = `
┌───「 *PANDUAN NOKOS* 」
│ Bot ini menyediakan layanan
│ pembelian *Nomor Virtual (Nokos)*
│ untuk verifikasi OTP berbagai
│ aplikasi (WhatsApp, Telegram, dll).
└──────────────

┌───「 *💰 1. Deposit Saldo* 」
│ ◦ Ketik: *.deposit <nominal>*
│   (Contoh: .deposit 5000)
│ ◦ Scan QRIS yang diberikan bot.
│ ◦ Saldo masuk otomatis tanpa
│   konfirmasi manual.
│ ◦ Cek saldo ketik: *.ceksaldo*
└──────────────

┌───「 *📱 2. Cara Order* 」
│ ◦ Ketik: *.nokos*
│ ◦ Balas pesan bot dengan angka
│   untuk memilih *Aplikasi*.
│ ◦ Pilih *Negara* dan *Operator*
│   sesuai instruksi di chat.
└──────────────

┌───「 *📞 3. Proses OTP* 」
│ ◦ Setelah sukses, bot akan
│   memberikan nomor virtual.
│ ◦ Masukkan nomor tersebut ke
│   aplikasi tujuan.
│ ◦ Kode OTP akan dikirim otomatis
│   oleh bot ke chat ini.
└──────────────

┌───「 *⚠️ Catatan Penting* 」
│ ◦ Jika OTP belum masuk otomatis,
│   silakan cek manual dengan
│   mengetik: */otp*
│ ◦ Jika OTP tidak masuk hingga batas
│   waktu habis, order dibatalkan &
│   saldo dikembalikan otomatis.
│ ◦ Jika WA bermasalah (seperti di
│   foto), ketik */cancel* untuk batal
│   lalu beli nomor baru.
│ ◦ Nomor hanya untuk 1x OTP.
│ ◦ Gunakan secepatnya setelah
│   nomor diterima!
└──────────────

✨ _Terima kasih telah menggunakan_
_layanan kami!_ 🙏
  `.trim();

  await conn.sendMessage(m.chat, { text: txt }, { quoted: m });
}

handler.help = ['tutorial'];
handler.tags = ['nokos'];
handler.command = /^(tutorial)$/i;
handler.register = false;

module.exports = handler;