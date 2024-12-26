import { exec } from "child_process"
import path from "path"
import fs from "fs"

import { resolveResult } from "./resolve-result"
import { AvastScanResult } from "./types"

export function findWindowsAvastPath() {
  const possiblePaths = [
    process.env.AVAST_CLI_PATH!,
    "C:\\Program Files (x86)\\Avast Software\\Avast",
  ]

  for (const possiblePath of possiblePaths) {
    const ashCmdPath = path.join(possiblePath, "ashCmd.exe")
    if (fs.existsSync(ashCmdPath)) {
      return ashCmdPath
    }
  }
  return null
}

const resolveScan = async (filePath: string): Promise<string> => {
  const avastPath = findWindowsAvastPath()

  //console.error(`Scanning file ${filePath} with Avast at ${avastPath}`);

  //return `Scanning file ${filePath} with Avast at ${avastPath}`;

  return new Promise((resolve, reject) => {
    const command = `"${avastPath}" /_ "${filePath}"`

    //console.error(`Running command: ${command}`);

    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(`Error scanning file: ${stderr}`)
        return
      }
      resolve(stdout)
    })
  })
}

export const avast = {
  scanFile: async (
    filePath: string,
    hash: string,
  ): Promise<AvastScanResult | string> => {
    //const filePath = path.resolve(__dirname, "file-to-scan.txt");

    try {
      const scanResult = await resolveScan(filePath)
      //console.log("Log:", scanResult)

      return resolveResult(scanResult, hash)
    } catch (error) {
      console.error("Error:", error)
      return "Error scanning file"
    }
  },
}
