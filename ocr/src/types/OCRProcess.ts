export type OCRProcessType = {
  hash: string;
  metadata: string;
  state: string;
  error?: string;
  text?: string;
};

export type DBOCRProcessType = OCRProcessType & {
  id: number;
};
