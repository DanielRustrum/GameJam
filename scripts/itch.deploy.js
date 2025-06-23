import config from "../gamejam.config.json" with { type: "json" };
import { runButlerCommand } from "./itch.run-butler.js";
import { installButler } from './itch.install-butler.js'

if (config.itchIO?.enabled) {
  console.log("\n")
  await installButler()
  
  console.log("🚀 Deploying to itch.io...");
  console.log("\n")

  const target = `${config.itchIO.user}/${config.itchIO.project}:${config.itchIO.channel}`;
  const zipName = "release/build.zip"

  await runButlerCommand(["login"])
  await runButlerCommand(["push", zipName, target])
}
