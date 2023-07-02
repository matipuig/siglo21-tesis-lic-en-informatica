/**
 *  @packageDocumentation
 *  @hidden
 *  Has the resources for all the translations in the app.
 */

/**
 *   Language resources.
 */
const resources = {
  es: {
    Home: {
      Example: 'Some sample text',
    },
    Error: {
      NOT_DEFINED: 'Ha ocurrido un error. Por favor, vuelve a intentarlo más tarde.',
      INVALID_PARAMS: 'Parámetros no válidos.',
      NOT_AUTHORIZED: 'No está autorizado.',

      // API.
      API_ONLY_HTTPS: 'Solo se admite a través de HTTPS.',
      API_METHOD_NOT_FOUND: 'No se ha encontrado el método buscado.',
      API_REQUESTS_TOO_OFTEN: 'Se están enviando consultas demasiado seguidas.',
      API_INVALID_PARAMS: 'Se han enviado parámetros no válidos.',

      // EXTRACTOR ERRORS.
      EXTRACTOR_DOCX_ERROR: 'Ha ocurrido un error obteniendo el contenido del documento docx.',
      EXTRACTOR_PDF_ERROR: 'Ha ocurrido un error obteniendo el contendio del documento pdf.',
      EXTRACTOR_URL_ERROR: 'Ha ocurrido un error obteniendo el contenido de la URL especificada.',
      EXTRACTOR_FILE_ERROR: 'Ha ocurrido un error leyendo el contenido del archivo.',
      EXTRACTOR_INVALID_URL: 'La URL enviada no es válida.',
      EXTRACTOR_URL_CODE_NOT_200: 'La URL ha enviado como codigo de respuesta ?.',
      EXTRACTOR_INVALID_TYPE: 'El tipo enviado al extractor no es valido.',
    },
  },
};

export default resources;
