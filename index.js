const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys")
const readline = require("readline")

// Function ya kusafisha namba
function cleanNumber(number, countryCode = "255") {
    let cleaned = number.replace(/\D/g, "") // ondoa vitu visivyo namba

    if (cleaned.startsWith("0")) {
        cleaned = countryCode + cleaned.substring(1) // badilisha 0 mwanzo
    } else if (!cleaned.startsWith(countryCode)) {
        cleaned = countryCode + cleaned // ongeza countryCode kama haipo
    }

    return cleaned
}

// Kusoma namba ya simu kutoka terminal
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("session")

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true
    })

    // Hii inahakikisha creds zina-save
    sock.ev.on("creds.update", saveCreds)

    rl.question("Ingiza namba ya simu yako (mfano: 0742233117 au 742233117 au 255742233117): ", (number) => {
        const formattedNumber = cleanNumber(number)
        console.log(`✅ Namba yako imebadilishwa kuwa: ${formattedNumber}`)
        console.log("Sasa unaweza kutumia pairing code kwa namba hii...")

        // Hapa unaweza kuweka function ya ku-generate pairing code kwa formattedNumber
        // Mfano (kama unayo):
        // sock.requestPairingCode(formattedNumber).then(code => {
        //     console.log("Pairing Code:", code)
        // })

        rl.close()
    })
}

startBot()