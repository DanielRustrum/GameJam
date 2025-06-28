import fs from "fs"
import os from "os"
import path from "path"
import followRedirects from "follow-redirects"
const { https } = followRedirects
import unzipper from "unzipper"

const PLATFORM = os.platform()
const BASE_DIR = path.resolve(".itch")
const BIN_DIR = path.join(BASE_DIR, "bin")
const BUTLER_EXE = path.join(BIN_DIR, PLATFORM === "win32" ? "butler.exe" : "butler")

const DOWNLOAD_URL = {
    win32: "https://broth.itch.ovh/butler/windows-amd64/LATEST/butler.zip",
    linux: "https://broth.itch.ovh/butler/linux-amd64/LATEST/butler.tar.gz", // Not implemented here
    darwin: "https://broth.itch.ovh/butler/darwin-amd64/LATEST/butler.tar.gz" // Not implemented here
}[PLATFORM]

async function downloadButlerZip(url, destPath) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(destPath)
        const req = https.get(url, {
            headers: { "User-Agent": "Node Butler Installer" }
        }, res => {
            if (res.statusCode !== 200) {
                reject(new Error(`Download failed. Status code: ${res.statusCode}`))
                return
            }
            res.pipe(file)
            file.on("finish", () => {
                file.close(resolve)
            })
        })

        req.on("error", err => {
            fs.unlinkSync(destPath)
            reject(err)
        })
    })
}

async function extractButlerZip(zipPath, outDir) {
    await fs.createReadStream(zipPath)
        .pipe(unzipper.Extract({ path: outDir }))
        .promise()
}

export async function installButler() {
    try {
        if ( fs.existsSync(BUTLER_EXE) ) {
            console.log(`✅ Butler executable already installed at ${BIN_DIR}`)
            return
        }

        fs.mkdirSync(BIN_DIR, { recursive: true })

        const zipPath = path.join(BASE_DIR, "butler.zip")
        console.log(`⬇️ Downloading Butler from ${DOWNLOAD_URL}`)
        await downloadButlerZip(DOWNLOAD_URL, zipPath)

        console.log(`📦 Extracting to ${BIN_DIR}`)
        await extractButlerZip(zipPath, BIN_DIR)
        fs.unlinkSync(zipPath)

        if (!fs.existsSync(BUTLER_EXE)) {
            throw new Error("Butler executable not found after extraction.")
        }

        console.log(`✅ Butler installed at: ${BUTLER_EXE}`)

    } catch (err) {
        console.error("❌ Butler install failed:", err)
        process.exit(1)
    }
}