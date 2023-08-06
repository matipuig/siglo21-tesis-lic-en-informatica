const validationList = {
  NEW_DOCUMENT: {
    type: 'object',
    additionalProperties: false,
    properties: {
      source: {
        type: 'string',
        minLength: 1,
      },
      sourceDocumentIdentifier: {
        type: 'string',
        minLength: 1,
      },
      metadata: {
        type: 'string',
      },
      contentHash: {
        type: 'string',
      },
      file: {
        type: 'object',
        additionalProperties: false,
        properties: {
          fileName: {
            type: 'string',
            minLength: 1,
          },
          base64: {
            type: 'string',
          },
        },
        required: ['fileName', 'base64'],
      },
    },
    required: ['source', 'sourceDocumentIdentifier', 'metadata', 'file'],
  },
  GET_CONTENT_HASHES: {
    type: 'object',
    additionalProperties: false,
    properties: {
      source: {
        type: 'string',
        minLength: 1,
      },
      sourceDocumentIdentifiers: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'string',
        },
      },
    },
    required: ['source', 'sourceDocumentIdentifiers'],
  },
  SET_TEXT: {
    type: 'object',
    additionalProperties: false,
    properties: {
      textContent: {
        type: 'string',
      },
      metadata: {
        type: 'string',
      },
    },
    required: ['textContent', 'metadata'],
  },
};

export default validationList;
