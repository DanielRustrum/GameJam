import { spawn } from "child_process";
import path from "path";
import os from "os";

const BIN_DIR = path.resolve(".itch", "bin");
const BUTLER_EXE = path.join(BIN_DIR, os.platform() === "win32" ? "butler.exe" : "butler");

export function runButlerCommand(args = []) {
  return new Promise((resolve, reject) => {
    const child = spawn(BUTLER_EXE, args, {
      stdio: "inherit",
      shell: false, // important!
    });

    child.on("exit", code => {
      if (code !== 0) {
        reject(new Error(`Butler exited with code ${code}`));
      } else {
        resolve();
      }
    });

    child.on("error", err => {
      reject(err);
    });
  });
}
