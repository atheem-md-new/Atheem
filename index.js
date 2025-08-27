const makeWASocket = require("@whiskeysockets/baileys").default;
const {
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    makeInMemoryStore,
} = require("@whiskeysockets/baileys");
const P = require("pino");

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("./session");
    const { version } = await fetchLatestBaileysVersion();
    const store = makeInMemoryStore({ logger: P().child({ level: "silent", stream: "store" }) });

    const sock = makeWASocket({
        version,
        printQRInTerminal: true, // hapa ndiyo inachapisha QR code
        auth: state,
        logger: P({ level: "silent" }),
    });

    store.bind(sock.ev);

    // Listener wa pairing code
    sock.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            console.log("\n💡 Scan hii QR code kwenye WhatsApp yako:");
        }

        if (connection === "open") {
            console.log("✅ WhatsApp Bot imeunganishwa!");
        } else if (connection === "close") {
            console.log("⚠️ Connection imefungwa, inajaribu kuungana tena...");
            startBot();
        }
    });

    sock.ev.on("creds.update", saveCreds);

    // mfano wa command rahisi
    sock.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message) return;

        const from = msg.key.remoteJid;
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text;

        if (text === ".menu") {
            await sock.sendMessage(from, { text: "👋 Karibu! Hii ni menu ya ATHEEM MD BOT" });
        }
    });

    // Pairing code (manual)
    if (!sock.authState.creds.registered) {
        const phoneNumber = process.env.NUMBER || "255742233117"; // andika namba yako hapa
        const code = await sock.requestPairingCode(phoneNumber);
        console.log(`📲 Pairing code ya ${phoneNumber} ni: ${code}`);
    }
}

startBot();