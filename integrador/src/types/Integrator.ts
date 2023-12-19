export type ContentHashResult = {
  sourceId: number;
  sourceDocumentIdentifier: string;
  contentHash: string | null;
};

export type NewDocumentType = {
  source: string;
  sourceDocumentIdentifier: string;
  contentHash: string;
  metadata: Record<string, string> | string,
    file: {
    fileName: string;
    base64: string;
  };
};
