/**
 * @packageDocumentation
 * @module API/Validator
 * How the textractor requests should be validated in the input.
 */

const FROM_BASE_64 = {
  type: 'object',
  additionalProperties: false,
  properties: {
    base64: {
      type: 'string',
      minLength: 3,
      pattern: '^[A-Za-z0-9./=+]*$',
    },
  },
  required: ['base64'],
};

export default { FROM_BASE_64 };
