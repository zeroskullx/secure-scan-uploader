import {prisma} from "#/lib/prisma";
import {File} from "@prisma/client";

export async function searchFileHash(
  hash: string,
  currentFileName: string
): Promise<File | null> {
  const fileRecord = await prisma.file.findUnique({
    where: {hash},
  });

  if (!fileRecord) {
    return null;
  }

  return {
    id: fileRecord?.id,
    originalFileName: currentFileName,
    status: fileRecord?.status,
    hash: fileRecord?.hash,
    ownerIp: fileRecord?.ownerIp,
    scannedAt: fileRecord?.scannedAt,
  };
}

export async function insertFileRecord(props: {
  currentFileName: string;
  hash: string;
  status: string;
  ownerIp: string;
}): Promise<File> {
  const {hash, status, currentFileName, ownerIp} = props;

  const fileRecord = await prisma.file.create({
    data: {
      hash,
      status,
      originalFileName: currentFileName,
      ownerIp,
    },
  });

  return {
    id: fileRecord.id,
    originalFileName: fileRecord.originalFileName,
    status: fileRecord.status,
    hash: fileRecord.hash,
    ownerIp: fileRecord.ownerIp,
    scannedAt: fileRecord.scannedAt,
  };
}
