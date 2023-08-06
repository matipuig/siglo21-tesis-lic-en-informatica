export type ColumnsType = {
  year: number[];
  subject: string[];
};

export type ResultType = {
  id: number;
  fileName: string;
  year: number;
  subject: string;
};

export type SearchParamsType = {
  include?: string;
  exclude?: string;
  year?: number;
  subject?: string;
};
