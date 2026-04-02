const wm = global.wm
let handler = async (m, { conn, usedPrefix }) => {
  let __timers = new Date() - global.db.data.users[m.sender].lastngewe;
  let _timers = 3600000 - __timers;
  let order = global.db.data.users[m.sender].ngewe
  let user = global.db.data.users[m.sender];
  let timers = clockString(_timers);
  let name = user.registered ? user.name : conn.getName(m.sender);
  let id = m.sender;
  let kerja = "openbo";
  conn.misi = conn.misi ? conn.misi : {};
  if (id in conn.misi) {
    conn.reply(
      m.chat,
      `Selesaikan Misi ${conn.misi[id][0]} Terlebih Dahulu`,
      m
    );
    throw false;
  }
  if (user.healt < 80) return m.reply(`Anda Harus Memiliki Minimal 80Healt`);
  if (user.stamina < 50)
    return m.reply(
      `Stamina Mu Tidak Cukup Cobalah Makan / minum Sesuatu .`.trim()
    );
  //if (user.kondom == 0)
    //return m.reply("Kamu Tidak Memiliki Kondom Beli Lah Terlebih Dahulu");
  if (new Date() - global.db.data.users[m.sender].lastngewe > 3600000) {
    let ngerok4 = Math.floor(Math.random() * 10);
    let ngerok5 = Math.floor(Math.random() * 10);

    let ngrk4 = ngerok4 * 100000;
    let ngrk5 = ngerok5 * 1000;

    let rokit = `📲 Orderan Masuk dari [ Om Teguh ]

ᴋᴀᴍᴜ ᴅᴀɴ ᴏᴍ ᴛᴇɢᴜʜ ᴍᴇᴍʙᴏᴏᴋɪɴɢ ʜᴏᴛᴇʟ
▒▒[ᴏʏᴏ]▒▒
▒▒▄▄▄▒▒ Kalian Berdua Masuk Ke kamar
▒█▀█▀█▒ kamu Membuka bh mu
░█▀█▀█░ Tete Mu diremas oleh om tgh
░█▀█▀█░  ( . )( . )
███████.  | 🤚 |


Om Teguh Mulai Memasukan Kelamin nya ke dalam vagina mu....
`.trim();

    let rokit2 = `Kamu Kesakitan ...

(_)(_)=====D \()/  

Rahim mu terasa hangat
`.trim();

    let rokit3 = `Om teguh pun crott 

()()=====D 💦💦💦   


✅ Orderan Selesai
`.trim();

    let rokit4 = `Om Teguh Memberimu Uang Lebih karena Goyanganmu Sangat unik 😝
`.trim();

    let hsl = `
*—[ Hasil Ngentot ${name} ]—*
➕ 💹 Uang = [ ${ngrk4} ]
➕ ✨ Exp = [ ${ngrk5} ]
➕ 😍 Order BO Selesai = +1
➕ 📥Total Bookingan : ${order}
`.trim();

    user.money += ngrk4;
    user.exp += ngrk5;
    user.warn += 1;
    user.ngewe += 1;
    user.healt -= 80;
    user.stamina -= 40;

    conn.misi[id] = [
      kerja,
      setTimeout(() => {
        delete conn.misi[id];
      }, 27000),
    ];

    setTimeout(() => {
      conn.reply(m.chat, hsl, m);
    }, 27000);

    setTimeout(() => {
      conn.reply(m.chat, rokit4, m);
    }, 25000);

    setTimeout(() => {
      conn.reply(m.chat, rokit3, m);
    }, 20000);

    setTimeout(() => {
      conn.reply(m.chat, rokit2, m);
    }, 15000);

    setTimeout(() => {
      conn.reply(m.chat, rokit, m);
    }, 10000);

    setTimeout(() => {
      conn.reply(m.chat, `🔍 ${name} Mencari Om Om.....`, m);
    }, 0);
    user.lastngewe = new Date() * 1;
  } else
    m.reply(
      `Silahkan Menunggu Selama ${timers}, Untuk Melakukan ngentot lagi`
    );
};
handler.help = ["ngentot"];
handler.tags = ["rpg"];
handler.command = /^(ngentot)$/i;
handler.register = true;
handler.group = true;
handler.level = 70;
handler.rpg = true;
module.exports = handler;

function clockString(ms) {
  let h = Math.floor(ms / 3600000);
  let m = Math.floor(ms / 60000) % 60;
  let s = Math.floor(ms / 1000) % 60;
  return [h, m, s].map((v) => v.toString().padStart(2, 0)).join(":");
}