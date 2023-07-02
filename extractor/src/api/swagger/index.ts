/**
 *  @packageDocumentation
 *  @module API/Swagger
 *  Contains the swagger documentation.
 *  It parses the YAML and make a JSON with the new content.
 */

import fs from 'fs';
import Handlebars from 'handlebars';
import path from 'path';
import yamljs from 'yamljs';

import ROUTES from '~/constants/routes';
import ERROR_CODES from '~/errors/codes';

const { API } = ROUTES;
type SwaggerDocs = Record<string, unknown>;

const docPath = path.join(__dirname, 'swagger.yml');
if (!fs.existsSync(docPath)) {
  throw new Error('File "swagger.yml" doesn\'t exist');
}

let swaggerDoc: SwaggerDocs = {};

try {
  const yaml = fs.readFileSync(docPath, { encoding: 'utf8' });
  const yamlForHB = yaml.replace(/\$\{/gi, '{{').replace(/\}/gi, '}}');
  const yamlCompiled = Handlebars.compile(yamlForHB);
  const yamlReplaced = yamlCompiled({ ROUTES, API, ERROR_CODES });
  swaggerDoc = yamljs.parse(yamlReplaced);
} catch (error) {
  throw new Error(`Error with Swagger files: ${error.message}`);
}

export default { ...swaggerDoc };
