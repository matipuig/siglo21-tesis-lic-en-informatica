export type FileType = {
  documentId: number;
  fileName: string;
  fileExtension: string;
  fileHash: string;
  textContent: string | null;
};

export type DBFileType = FileType & {
  id: number;
};
