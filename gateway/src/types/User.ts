export type UserType = {
  user: string;
  password: string;
  name: string;
};

export type DBUserType = UserType & {
  id: number;
};
