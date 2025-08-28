const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("./session");

  const socket = makeWASocket({
    auth: state,
    printQRInTerminal: true,
  });

  socket.ev.on("creds.update", saveCreds);

  socket.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "open") {
      console.log("✅ Bot connected successfully!");

      // Hapa tunaweka notification message
      await socket.sendMessage(socket.user.id, {
        image: { url: "https://i.postimg.cc/90R1VDwP/IMG-20250730-WA0039-2.jpg" },
        caption: `🚀 *WELCOME TO THE FUTURE – ATHEEM MD* 🚀

🔐 *SESSION ID GENERATED SUCCESSFULLY*

⚠️ *KEEP IT SAFE – NEVER SHARE WITH ANYONE!*
✅ Use this Session ID ONLY to deploy your *ATHEEM MD* bot.

🤖 You are now part of the *ATHEEM MD NETWORK*  
Let the automation begin!

━━━━━━━━━━━━━━━
📢 *Official Channel:* https://whatsapp.com/channel/0029Vb3RbBsKbYMSx7LsBU24  
💬 *Support Group:* https://chat.whatsapp.com/CBcA1YIkgDoICCbXMG2mt6?mode=ac_t
━━━━━━━━━━━━━━━

🔧 Powered by *ATHEEM MD  BOT SYSTEM*`,
      });
    }
  });
}

startBot();