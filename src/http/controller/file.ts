import {prisma} from "#/lib/prisma";

export async function searchFileHash(hash: string, currentFileName: string) {
  const fileRecord = await prisma.file.findUnique({
    where: {hash},
  });

  if (!fileRecord) {
    return null;
  }

  return {
    id: fileRecord?.id,
    fileName: currentFileName,
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
}) {
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
    fileName: fileRecord.originalFileName,
    status: fileRecord.status,
    hash: fileRecord.hash,
    ownerIp: fileRecord.ownerIp,
    scannedAt: fileRecord.scannedAt,
  };
}
