export type SearcherType = {
  name: string;
  microserviceUrl: string;
};

export type DBSearcherType = SearcherType & {
  id: number;
};

export type DBUserSearcher = {
  id: number;
  userId: number;
  searcherId: number;
};
