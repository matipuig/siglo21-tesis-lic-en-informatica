export type FileTextExtractionProcessStateType =
  | 'NOT_STARTED'
  | 'EXTRACTING_TEXT'
  | 'WAITING_OCR'
  | 'EXECUTING_OCR'
  | 'ERRORED'
  | 'FINISHED';

export type FileTextExtractionProcessType = {
  fileId: number;
  state: FileTextExtractionProcessStateType;
  errorDescription: string | null;
};

export type DBFileTextExtractionProcessType = FileTextExtractionProcessType & {
  id: number;
};
