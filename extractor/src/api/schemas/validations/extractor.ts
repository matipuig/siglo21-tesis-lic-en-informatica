const validationList = {
  EXTRACTOR: {
    type: 'object',
    additionalProperties: false,
    properties: {
      base64: {
        type: 'string',
      },
    },
    required: ['base64'],
  },
};

export default validationList;
