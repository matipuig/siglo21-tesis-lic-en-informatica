const validationList = {
  OCR: {
    type: 'object',
    additionalProperties: false,
    properties: {
      base64: {
        type: 'string',
      },
      metadata: {
        type: 'string',
      },
    },
    required: ['base64', 'metadata'],
  },
};

export default validationList;
