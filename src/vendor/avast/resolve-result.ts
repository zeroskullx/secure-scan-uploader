import path from "node:path"
import fs from "node:fs"

import { AvastScanResult } from "./types"

const initAvastScanResult: AvastScanResult = {
  processedFiles: 0,
  //processedFolders: 0,
  infectedFiles: 0,
  scannedBytes: 0,
  virusDefinitions: "",
  scanTime: "",
}

const __dirname = path.resolve()

export const resolveResult = async (text: string, fileHash: string) => {
  const uploadDir = path.join(__dirname, "uploads/logs")

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
  }

  const fileName = `avast_${fileHash}_log.txt`

  const tempFilePath = path.join(uploadDir, fileName)
  const utf8Text = Buffer.from(text, "utf-8").toString()
  fs.writeFileSync(tempFilePath, utf8Text)

  // Read line by line
  const lines = fs.readFileSync(tempFilePath, "utf-8").split("\n")

  // Remove the first 2 lines
  lines.shift()
  lines.shift()

  const result: AvastScanResult = { ...initAvastScanResult }

  const values = lines
    .map((line) => line.replace(/\s+$/g, "").split(":")[1]?.trim())
    .filter((value) => value !== undefined && value !== "")

  if (values.length === 6) {
    result.processedFiles = parseInt(values[0])
    //result.processedFolders = parseInt(values[1]);
    result.infectedFiles = parseInt(values[2])
    result.scannedBytes = parseInt(values[3])
    result.virusDefinitions = values[4]
    result.scanTime = values[5]
  }

  console.log("Result:", { lines, values, result })

  return result
}
