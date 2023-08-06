import http from 'http';

import app from './app';

const server = http.createServer(app);
const PORT = 8080;

server.listen(PORT).on('listening', () => {
  console.log(`Servidor escuchando en le puerto ${PORT}`);
});
