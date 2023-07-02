/**
 *  It creates swagger documentation.
 */

import fs from 'fs';
import Handlebars from 'handlebars';
import { cloneDeep, isObject, isNull } from 'lodash';
import path from 'path';
import yamljs from 'yamljs';

import ROUTES from '../src/constants/routes';
import ERROR_CODES from '../src/errors/codes';

type SwaggerPaths = Record<string, unknown>;

const { API } = ROUTES;

const RAW_LOCATION = '../src/api/swagger/swagger.yml';
const DOCS_LOCATION = '../docs/api/swagger/content.js';

const rawPath = path.join(__dirname, RAW_LOCATION);
const docsPath = path.join(__dirname, DOCS_LOCATION);

/**
 *  Controls the files are OK to do the docs.
 *  Throws an error if don't.
 */
const controlFiles = function controlFiles(): boolean {
  if (!fs.existsSync(rawPath)) {
    throw new Error('File "swagger.yml" doesn\'t exist');
  }
  if (fs.existsSync(docsPath)) {
    fs.unlinkSync(docsPath);
  }
  return true;
};

/**
 * Receives an Express path (with :id) and returns a swagger path (with {id}).
 */
const changeExpressPathToSwaggerPath = function changeExpressPathToSwaggerPath(
  expressPath: string,
): string {
  const pathParts = expressPath.split('/');
  const modifiedParts = pathParts.map((part) => {
    if (!part.startsWith(':')) {
      return part;
    }
    const newPart = part.replace(':', '');
    return `{${newPart}}`;
  });
  return modifiedParts.join('/');
};

/**
 * Converts express notations from "express" (:something) to "swagger" ({something}).
 */
const convertExpressToSwagger = function convertExpressToSwagger(
  swaggerDocs: Record<string, unknown>,
) {
  if (!isObject(swaggerDocs.paths) || isNull(swaggerDocs.paths)) {
    return swaggerDocs;
  }
  const docs = cloneDeep(swaggerDocs);
  const paths: SwaggerPaths = <SwaggerPaths>docs.paths;
  let tmpNewKey = '';
  Object.keys(paths).forEach((key) => {
    tmpNewKey = changeExpressPathToSwaggerPath(key);
    if (tmpNewKey === key) {
      return;
    }
    paths[tmpNewKey] = paths[key];
    delete paths[key];
  });
  docs.paths = paths;
  return docs;
};

/**
 *  Generate API docs.
 */
const generateDocs = function generateDocs() {
  controlFiles();
  try {
    const yaml = fs.readFileSync(rawPath, { encoding: 'utf8' });
    const yamlForHB = yaml.replace(/\$\{/gi, '{{').replace(/\}/gi, '}}');
    const yamlCompiled = Handlebars.compile(yamlForHB);
    const yamlReplaced = yamlCompiled({ ROUTES, ERROR_CODES, API });
    const swaggerDoc = yamljs.parse(yamlReplaced);
    const paramsChangedDocs = convertExpressToSwagger(swaggerDoc);

    const stringifiedDoc = JSON.stringify(paramsChangedDocs);
    const fileContent = `var swaggerContent = ${stringifiedDoc};`;
    fs.writeFileSync(docsPath, fileContent, { encoding: 'utf8' });
  } catch (error) {
    throw new Error(`Error with Swagger files: ${error.message}`);
  }
};

console.log('Generating API docs.');
generateDocs();
console.log('API docs generated.');
