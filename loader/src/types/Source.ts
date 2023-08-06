export type SourceType = {
  name: string;
  microserviceUrl: string;
};

export type DBSourceType = SourceType &  {
  id: number;
};
