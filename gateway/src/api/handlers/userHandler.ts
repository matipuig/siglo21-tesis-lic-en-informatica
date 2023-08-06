import apiUtils from '~/api/apiUtils';
import schemas from '~/api/schemas';
import users from '~/controller/users';
import userSearchersDAO from '~/model/actions/userSearchersDAO';

class UserHandler {
  async isLoggedIn(req: any, res: any, next: any): Promise<boolean> {
    try {
      const result = typeof req.session?.id === 'number';
      return apiUtils.sendResponse(res, { result });
    } catch (error) {
      next(error);
      return false;
    }
  }

  async login(req: any, res: any, next: any): Promise<boolean> {
    try {
      const { user, password } = await schemas.validate(req.body, 'LOGIN');
      const result = await users.getByUserAndPassword(user as string, password as string);
      if (!result) {
        req.session = {};
        req.session.destroy();
        return apiUtils.sendError(req, res, new Error('USER_NOT_LOGGED_IN'), 402);
      }
      req.session = result;
      return apiUtils.sendResponse(res, result);
    } catch (error) {
      next(error);
      return false;
    }
  }

  async rejectIfNotAuthorized(req: any, res: any, next: any): Promise<void> {
    try {
      const { searcherName } = req.params;
      const userId = req.session?.id;
      if (!userId) {
        apiUtils.sendError(req, res, new Error('USER_NOT_LOGGED_IN'), 402);
        return;
      }
      const authorizedSearchers = await userSearchersDAO.getUserAuthorizedSearcherNames(userId);
      if (!authorizedSearchers.includes(searcherName)) {
        apiUtils.sendError(req, res, new Error('USER_NOT_LOGGED_IN'), 402);
        return;
      }
      next();
    } catch (error) {
      next(error);
    }
  }

  async logout(req: any, res: any, next: any): Promise<boolean> {
    try {
      req.session.destroy();
      return res.send(res, { result: true });
    } catch (error) {
      next(error);
      return false;
    }
  }
}

export default new UserHandler();
