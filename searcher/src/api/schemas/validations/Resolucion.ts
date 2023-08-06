const validationList = {
  SEARCH: {
    type: 'object',
    additionalProperties: false,
    properties: {
      include: {
        type: 'string',
      },
      exclude: {
        type: 'string',
      },
      year: {
        type: 'number',
        minimum: 1900,
        maximum: 2100,
      },
      subject: {
        type: 'string',
      },
      page: {
        type: 'number',
        default: 1,
      },
      itemsPerPage: {
        type: 'number',
        default: 25,
      },
    },
    required: [],
  },
  RESOLUCION: {
    type: 'object',
    additionalProperties: false,
    properties: {
      sourceId: {
        type: 'string',
      },
      fileName: {
        type: 'string',
      },
      base64: {
        type: 'string',
      },
      textContent: {
        type: 'string',
      },
      metadata: {
        type: 'object',
        additionalProperties: false,
        properties: {
          year: {
            type: 'number',
            minimum: 1900,
            maximum: 2100,
          },
          subject: {
            type: 'string',
          },
        },
        required: ['year', 'subject'],
      },
    },
    required: ['sourceId', 'fileName', 'base64', 'textContent', 'metadata'],
  },
};

export default validationList;
