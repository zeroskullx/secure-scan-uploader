export type AvastScanResult = {
  processedFiles: number;
  //processedFolders: number;
  infectedFiles: number;
  scannedBytes: number;
  virusDefinitions: string;
  scanTime: string;
};
