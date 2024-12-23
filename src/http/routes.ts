import { FastifyInstance } from "fastify";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import { avast } from "#/vendor/avast";
import { insertFileRecord, searchFileHash } from "./controller/file";

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB

// Simulate __dirname
const __dirname = path.resolve();

// Helper function to calculate file hash
const calculateHash = async (filePath: string): Promise<string> => {
  const hash = crypto.createHash("sha256");
  const fileBuffer = await fs.promises.readFile(filePath);
  hash.update(fileBuffer);
  return hash.digest("hex");
};

export async function appRoutes(app: FastifyInstance): Promise<void> {
  app.post("/upload", async (req, res) => {
    // Verifica o tamanho do arquivo
    const contentLength = req.headers["content-length"];
    if (contentLength && parseInt(contentLength) > MAX_FILE_SIZE) {
      return res
        .status(400)
        .send({ error: "File size exceeds the 1MB limit." });
    }

    try {
      const data = await req.file();

      if (!data) {
        return res.status(400).send({ error: "No file uploaded." });
      }

      const uploadDir = path.join(__dirname, process.env.FILE_UPLOAD_DIR!);

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Create a temporary file to calculate the hash
      const tempFilePath = path.join(uploadDir, `temp_${data.filename}`);
      const tempFileStream = fs.createWriteStream(tempFilePath, {
        mode: 0o600,
      });

      await new Promise<void>((resolve, reject) => {
        data.file.pipe(tempFileStream);
        data.file.on("end", resolve);
        data.file.on("error", reject);
      });

      // Calculate the file hash
      const fileHash = await calculateHash(tempFilePath);

      // Check if the hash already exists in the database
      let fileRecord = await searchFileHash(fileHash, data.filename);
      if (fileRecord) {
        // Remove the temporary file
        await fs.promises.unlink(tempFilePath);

        return res.status(200).send({
          message: "File already scanned.",
          //data: fileRecord,
          scanResult: fileRecord.status,
        });
      }

      // Rename the file with the hash name
      const newFileName = `${fileHash}${path.extname(data.filename)}`;
      const newFilePath = path.join(uploadDir, newFileName);

      await fs.promises.rename(tempFilePath, newFilePath);

      // Scan the file with vendor Avast
      const avastResult = await avast.scanFile(newFilePath, fileHash);

      if (typeof avastResult === "string") {
        return res.status(500).send({ error: "Error scanning file." });
      }

      // Save the file record in the database
      fileRecord = await insertFileRecord({
        hash: fileHash,
        currentFileName: data.filename,
        status: avastResult.infectedFiles > 0 ? "infected" : "clean",
        ownerIp: req?.ip || "unknown",
      });

      return res.status(201).send({
        message: "File scanned successfully.",
        //data: fileRecord,
        scanResult: fileRecord.status,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: "Internal server error..." });
    }
  });
}
