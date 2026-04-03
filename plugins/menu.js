// credits : kasan 
// improved by : Partner Coding

const GROUP_WM = 'https://chat.whatsapp.com/LknsianRgX9KVNtyTChwZc?mode=gi_t';

/**
 * Fungsi untuk mendapatkan Waktu, Tanggal, dan Ucapan (Pagi/Siang/Sore/Malam)
 */
function getClockAndGreeting() {
  const d = new Date();
  
  const date = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta' });
  const time = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' });
  const currentHour = parseInt(d.toLocaleString('en-US', { hour: 'numeric', hour12: false, timeZone: 'Asia/Jakarta' }));
  
  let greeting = 'Selamat Malam 🌙';
  if (currentHour >= 4 && currentHour < 11) {
    greeting = 'Selamat Pagi 🌅';
  } else if (currentHour >= 11 && currentHour < 15) {
    greeting = 'Selamat Siang ☀️';
  } else if (currentHour >= 15 && currentHour < 18) {
    greeting = 'Selamat Sore 🌇';
  }

  return { date, time, greeting };
}

const handler = async (m, { conn }) => {
  const user = `@${m.sender.split('@')[0]}`;
  const { date, time, greeting } = getClockAndGreeting();

  // Teks menu dengan gaya "Modern & Rapi" (Box Style)
  const text = `
┌───「 *XYON OTP* 」
│ 👋 ${greeting}, ${user}!
│ 📅 ${date}
│ ⏰ ${time} WIB
└──────────────

┌───「 *NOKOS & OTP* 」
│ ◦ 📲 /nokos
│ ◦ 🔑 /otp
│ ◦ ❌ /cancel
│ ◦ 💳 /deposit <nominal>
│ ◦ 💰 /saldo
│ ◦ 🔎 /ceksaldo
│ ◦ ➕ /addsaldo
│ ◦ 🔄 /resetsaldo
│ ◦ 📖 /tutorial
└──────────────

┌───「 *MAIN* 」
│ ◦ 🎁 /donasi <nominal>
│ ◦ 📜 /donasiku
│ ◦ 🏆 /donasitop
│ ◦ 📋 /menu
└──────────────

┌───「 *GROUP* 」
│ ◦ 🟢 /enable <option>
│ ◦ 🔴 /disable <option>
│ ◦ 🔗 /getlinkgroup
└──────────────

┌───「 *OWNER* 」
│ ◦ 🧩 /getplugin [filename]
│ ◦ 🔔 /notif on
│ ◦ 🔕 /notif off
│ ◦ ℹ️ /notif info
│ ◦ 🧪 /notif test
│ ◦ 🔄 /notif reset
│ ◦ 💸 /tfsaldo @user/nomor <nominal>
│ ◦ 📝 /sf <teks>
│ ◦ 📈 /pricealert on
│ ◦ 📉 /pricealert off
│ ◦ 🛠️ /pricealert test
│ ◦ 👤 /profil
│ ◦ 📊 /stats
│ ◦ 📋 /tarik list
│ ◦ 🏧 /tarik <kode> <nohp> <nominal>
└──────────────

┌───「 *ADVANCED* 」
│ ◦ ⌨️ /> 
│ ◦ 🖥️ /=> 
│ ◦ 💲 /$
└──────────────

┌───「 *TOOLS & INFO* 」
│ ◦ 💳 /saldoadmin
│ ◦ 📡 /getip
│ ◦ 🏓 /ping
│ ◦ 📊 /status
└──────────────

┌───「 *XP & DAFTAR* 」
│ ◦ 📝 /daftar <nama>.<umur>
│ ◦ 📝 /reg <nama>.<umur>
│ ◦ 📝 /register <nama>.<umur>
└──────────────

🆘 _Butuh bantuan?_
👉 ${GROUP_WM}
  `.trim();

  await conn.sendMessage(m.chat, {
    text: text,
    mentions: [m.sender]
  }, { quoted: m });
};

handler.command = /^(menu|help)$/i;
handler.tags = ['main'];
handler.help = ['menu'];
handler.register = true;

module.exports = handler;