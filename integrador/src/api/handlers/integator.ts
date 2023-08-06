import { noop } from 'lodash';

import apiUtils from '~/api/apiUtils';
import integrator from '~/controller/integrator';

class IntegratorHandler {
  async start(req: any, res: any, next: any): Promise<boolean> {
    try {
      noop(req);
      const result = await integrator.start();
      return apiUtils.sendResponse(res, result);
    } catch (error) {
      next(error);
      return false;
    }
  }

  async stop(req: any, res: any, next: any): Promise<boolean> {
    try {
      noop(req);
      const result = await integrator.stop();
      return apiUtils.sendResponse(res, result);
    } catch (error) {
      next(error);
      return false;
    }
  }
}

export default new IntegratorHandler();
