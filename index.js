// index.js
const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ PAGE YA FRONTEND (Homepage)
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>ATHEEM BOT</title>
      <style>
        body {
          margin: 0;
          font-family: Arial, sans-serif;
          background: linear-gradient(135deg, #4facfe, #00f2fe);
          color: white;
          text-align: center;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        h1 {
          font-size: 3rem;
          margin-bottom: 10px;
          text-shadow: 2px 2px 5px rgba(0,0,0,0.3);
        }
        p {
          font-size: 1.2rem;
          margin-bottom: 30px;
        }
        .btn {
          display: inline-block;
          padding: 15px 30px;
          margin: 10px;
          border-radius: 30px;
          text-decoration: none;
          color: white;
          font-weight: bold;
          background: rgba(0,0,0,0.3);
          transition: 0.3s;
        }
        .btn:hover {
          background: rgba(0,0,0,0.6);
        }
        footer {
          position: absolute;
          bottom: 10px;
          font-size: 0.9rem;
          opacity: 0.8;
        }
      </style>
    </head>
    <body>
      <h1>🤖 ATHEEM BOT</h1>
      <p>Karibu! Chagua sehemu unayotaka 👇</p>

      <a href="https://whatsapp.com/channel/0029Vb3RbBsKbYMSx7LsBU24" class="btn">📢 Channel</a>
      <a href="https://chat.whatsapp.com/CBcA1YIkgDoICCbXMG2mt6?mode=ac_t" class="btn">👥 Group</a>
      <a href="https://wa.me/message/3OTPW7PRF3RVL1" class="btn">🛠️ Developer Help</a>
      <a href="https://github.com/atheem-md-new/Atheem-MD" class="btn">💻 GitHub Repo</a>
      <a href="/session" class="btn">🔑 Session Generator</a>

      <footer>© 2025 ATHEEM | Powered by Render</footer>
    </body>
    </html>
  `);
});

// ✅ PAGE YA SESSION GENERATOR (Form)
app.get("/session", (req, res) => {
  res.send(`
    <h2>📱 WhatsApp Session Generator</h2>
    <form action="/pair" method="get">
      <label>Weka namba yako ya WhatsApp (mfano 2557xxxxxx):</label><br/>
      <input type="text" name="number" placeholder="2557XXXXXXX" required />
      <button type="submit">Tengeneza Pairing Code</button>
    </form>
  `);
});

// ✅ ENDPOINT YA KUTENGENEZA PAIRING CODE
app.get("/pair", async (req, res) => {
  const number = req.query.number;
  if (!number) return res.send("⚠️ Tafadhali weka namba ya WhatsApp!");

  try {
    const { state, saveCreds } = await useMultiFileAuthState("auth_" + number); 
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
      version,
      auth: state,
      printQRInTerminal: false
    });

    if (!sock.authState.creds.registered) {
      const code = await sock.requestPairingCode(number);
      console.log(`🔑 Pairing Code kwa ${number}: ${code}`);
      res.send(`✅ Pairing code ya <b>${number}</b> ni: <b>${code}</b><br/>
                Nenda WhatsApp → Linked Devices → Link with phone number.`);
    } else {
      res.send("✅ Session tayari ipo kwa namba hii.");
    }

    sock.ev.on("creds.update", saveCreds);
  } catch (e) {
    console.error(e);
    res.send("❌ Imeshindikana kutengeneza code. Hakikisha namba iko sahihi.");
  }
});

// ✅ START SERVER
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
