/**
 *  @packageDocumentation
 *  @module API/Validator
 *  Contain all the possible validation for schemas.
 */

import FILES from './files';
import TEXTRACTOR from './textractor';

const validationList = {
  HASHES: FILES.HASHES,
  FROM_BASE_64: TEXTRACTOR.FROM_BASE_64,
};

export default validationList;
