import apiUtils from '~/api/apiUtils';
import schemas from '~/api/schemas';
import extractor from '~/controller/extractor';

class ExtractorHandler {
  async extract(req: any, res: any, next: any): Promise<boolean> {
    try {
      const body = await schemas.validate(req.body as Record<string, string>, 'EXTRACTOR');
      const result = await extractor.extractFromBase64(<string>body.base64);
      return apiUtils.sendResponse(res, { textContent: result });
    } catch (error) {
      next(error);
      return false;
    }
  }
}

export default new ExtractorHandler();
