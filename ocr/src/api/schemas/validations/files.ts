/**
 * @packageDocumentation
 * @module API/Validator
 * How the files requests should be validated in the input.
 */

const HASHES = {
  type: 'object',
  additionalProperties: false,
  properties: {
    hashes: {
      type: 'array',
      additionalItems: false,
      minItems: 1,
      maxItems: 1000,
      items: {
        type: 'string',
        minLength: 3,
        pattern: '^[A-Za-z0-9./=+]*$',
      },
    },
  },
  required: ['hashes'],
};

export default { HASHES };
