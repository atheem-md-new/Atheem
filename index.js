import makeWASocket, { useMultiFileAuthState, fetchLatestBaileysVersion } from "@whiskeysockets/baileys"
import express from "express"

const app = express()
const port = process.env.PORT || 3000

app.get("/", async (req, res) => {
    const { state, saveCreds } = await useMultiFileAuthState("session")
    const { version } = await fetchLatestBaileysVersion()
    
    const sock = makeWASocket({
        auth: state,
        version
    })

    sock.ev.on("creds.update", saveCreds)

    sock.ev.on("connection.update", (update) => {
        const { qr, pairingCode, connection } = update
        
        if (qr) {
            res.send(`<h2>Scan QR hii kwa WhatsApp</h2><img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${qr}"/>`)
        } else if (pairingCode) {
            res.send(`<h2>Pairing Code: ${pairingCode}</h2>`)
        } else if (connection === "open") {
            res.send("<h2>✅ Bot imeunganishwa kikamilifu!</h2>")
        }
    })
})

app.listen(port, () => {
    console.log(`Server inakimbia http://localhost:${port}`)
})