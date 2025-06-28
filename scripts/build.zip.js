import fs from "fs"
import archiver from "archiver"

const zipName = "build.zip"
const outputDir = "release/dist"

try{
  fs.mkdirSync("release")
} catch(e) {}
const output = fs.createWriteStream("release/" + zipName)
const archive = archiver("zip", { zlib: { level: 9 } })

output.on("close", () => {
  console.log(`✅ Created ${zipName} (${archive.pointer()} total bytes)`)
})

archive.on("error", err => {
  throw err
})

archive.pipe(output)
archive.directory(outputDir, false)
archive.finalize()
