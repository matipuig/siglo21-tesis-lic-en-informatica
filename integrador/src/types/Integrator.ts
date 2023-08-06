export type ContentHashResult = {
  sourceId: number;
  sourceDocumentIdentifier: string;
  contentHash: string | null;
};

export type NewDocumentType = {
  source: string;
  sourceDocumentIdentifier: string;
  contentHash: string;
  metadata:
    | {
        subject: string;
        year: number;
      }
    | string;
  file: {
    fileName: string;
    base64: string;
  };
};
