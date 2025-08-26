const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys");

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send(`
    <h2>📱 WhatsApp Session Generator</h2>
    <form action="/pair" method="get">
      <label>Weka namba yako ya WhatsApp (mfano 2557xxxxxx):</label><br/>
      <input type="text" name="number" placeholder="2557XXXXXXX" required />
      <button type="submit">Tengeneza Pairing Code</button>
    </form>
  `);
});

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
      res.send(`
        ✅ Pairing code ya ${number} ni: <b>${code}</b><br/>
        Nenda WhatsApp → Linked Devices → Link with phone number.
      `);
    } else {
      res.send("✅ Session tayari ipo kwa namba hii.");
    }

    sock.ev.on("creds.update", saveCreds);
  } catch (e) {
    console.error("❌ Error:", e);
    res.send("❌ Imeshindikana kutengeneza code. Hakikisha Baileys iko updated na namba sahihi.");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server inakimbia http://localhost:${PORT}`);
});