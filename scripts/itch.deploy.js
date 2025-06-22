import config from "../gamejam.config.json" with { type: "json" };
import { runButlerCommand } from "./itch.run-butler.js";
import { installButler } from './itch.install-butler.js'

if (config.itchIO?.enabled) {
  await installButler()
  
  console.log("🚀 Deploying to itch.io...");
  const target = `${config.itchIO.user}/${config.itchIO.project}:${config.itchIO.channel}`;
  const zipName = "release/build.zip"

  await runButlerCommand(["login"])
  await runButlerCommand(["push", zipName, target])
}
