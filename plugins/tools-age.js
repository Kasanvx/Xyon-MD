const uploadImage = require('../lib/uploadImage');
const fetch = require('node-fetch');
let handler = async (m, { 
  conn, 
  usedPrefix, 
  command 
}) => {
  var q = m.quoted ? m.quoted : m;
  var mime = (q.mimetype || q.mediaType || '');
  
  if (/image/g.test(mime) && !/webp/g.test(mime)) {
    await conn.reply(m.chat, wait, m);
    
    try {
      const img = await q.download?.();
      let out = await uploadImage(img);
      let old = new Date();
      let res = await fetch(`https://api.betabotz.eu.org/api/search/agedetect?url=${out}&apikey=${lann}`);
      let convert = await res.json();   
                                                          let txt = `⚡ *A G E   D E T E C T I O N* ⚡
⚡━━━━━━━━━━⚡

`;
    txt += `⬡ *Score* » ${convert.result.score}
`;
    txt += `⬡ *Age* » ${convert.result.age}
`;
    txt += `⬡ *Gender* » ${convert.result.gender}
`;
    txt += `⬡ *Expression* » ${convert.result.expression}
`;
    txt += `⬡ *Face Shape* » ${convert.result.faceShape}
`;
    txt += `
⚡━━━━━━━━━━⚡
_` + global.wm + ` • ` + global.footer + `_`;
    await conn.sendFile(m.chat, out, 'age.png', txt, m)
    } catch (e) {
      console.log(e);
      m.reply(`[ ! ] Identifikasi Wajah Gagal.`);
    }
  } else {
    m.reply(`Kirim gambar dengan caption *${usedPrefix + command}* atau tag gambar yang sudah dikirim`);
  }
};

handler.help = handler.command = ['age', 'agedetect', 'agedetector'];
handler.tags = ['tools'];
handler.premium = false;
handler.limit = true;

module.exports = handler;
