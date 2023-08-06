export type NewResolucionType = {
  sourceId: string;
  fileName: string;
  year: number;
  subject: string;
  base64: string;
  textContent: string;
};

export type ResolucionType = {
  sourceId: string;
  fileName: string;
  fileHash: string;
  year: number;
  subject: string;
  textContent: string;
};

export type DBResolucionType = ResolucionType & {
  id: number;
};

export type SearchType = Partial<{
  include: string;
  exclude: string;
  subject: string;
  year: number;
  page: number;
  itemsPerPage: number;
}>;

export type ResolucionWithNoTextContentType = Omit<ResolucionType, 'textContent'>;
