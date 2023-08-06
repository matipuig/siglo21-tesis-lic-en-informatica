export type DocumentStateType = 'NOT_STARTED' | 'TEXT_EXTRACTED' | 'ERRORED' | 'FINISHED';

export type DocumentType = {
  sourceId: number;
  sourceDocumentIdentifier: string;
  metadata: string;
  contentHash: string;
  state: DocumentStateType;
  errorDescription: string | null;
};

export type DBDocumentType = DocumentType & {
  id: number;
};

export type NewDocumentType = {
  sourceId: number;
  sourceDocumentIdentifier: string;
  metadata: string;
  contentHash: string;
};

export type IncomingDocumentType = Omit<NewDocumentType, 'sourceId'> & {
  source: string;
  file: {
    fileName: string;
    base64: string;
  };
};
