import usersDAO, { NoPasswordUser } from '~/model/actions/usersDAO';

class Users {
  async set(user: string, rawPassword: string, name: string): Promise<NoPasswordUser> {
    return usersDAO.set(user, rawPassword, name);
  }

  async getByUserAndPassword(user: string, rawPassword: string): Promise<NoPasswordUser | null> {
    return usersDAO.getByUserAndPassword(user, rawPassword);
  }
}

export default new Users();
