const validationList = {
  LOGIN: {
    type: 'object',
    additionalProperties: false,
    properties: {
      user: {
        type: 'string',
      },
      password: {
        type: 'string',
      },
    },
    required: ['user', 'password'],
  },
};

export default validationList;
