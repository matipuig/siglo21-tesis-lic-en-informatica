import apiUtils from '~/api/apiUtils';
import schemas from '~/api/schemas';
import OCRController from '~/controller/ocr';

class OCRHandler {
  async extract(req: any, res: any, next: any): Promise<boolean> {
    try {
      const { base64, metadata } = await schemas.validate(
        req.body as Record<string, string>,
        'OCR',
      );
      const result = await OCRController.extract(base64 as string, metadata as string);
      return apiUtils.sendResponse(res, { textContent: result });
    } catch (error) {
      next(error);
      return false;
    }
  }
}

export default new OCRHandler();
