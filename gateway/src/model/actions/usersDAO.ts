import crypto from 'crypto';
import { omit } from 'lodash';

import handleError from '~/model/handleError';
import UserORM from '~/model/orm/User';
import { DBUserType } from '~/types/User';

export type NoPasswordUser = Omit<DBUserType, 'password'>;

class UsersDAO {
  async getByUserAndPassword(user: string, password: string): Promise<NoPasswordUser | null> {
    try {
      const hashedPassword = this._hashPassword(password);
      const dbUser = await UserORM.findOne({
        attributes: ['id', 'user', 'name'],
        where: { user, password: hashedPassword },
      });
      if (!dbUser) {
        return null;
      }
      const parsedUser = dbUser.get({ plain: true });
      return parsedUser as NoPasswordUser;
    } catch (error) {
      return handleError(error);
    }
  }

  async set(user: string, rawPassword: string, name: string): Promise<NoPasswordUser> {
    try {
      const existingUser = await UserORM.findOne({ where: { name } });
      const password = this._hashPassword(rawPassword);
      if (!existingUser) {
        const newUser = await UserORM.create({ user, password, name });
        const parsedUser = newUser.get({ plain: true });
        return omit(parsedUser, ['password']);
      }
      await UserORM.update({ password, name }, { where: { user } });
      return this.getByUserAndPassword(user, rawPassword) as unknown as NoPasswordUser;
    } catch (error) {
      return handleError(error);
    }
  }

  private _hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
  }
}

export default new UsersDAO();
