const jsonServer = require('json-server');

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);

// Simular delay
server.use((req, res, next) => {
  setTimeout(next, 1500);
});

// Simular erro
server.get('/users', (req, res, next) => {
  if (req.query.name_like === 'error') {
    return res.status(500).jsonp({
      message: 'Erro simulado'
    });
  }

  next();
});

server.use(router);

server.listen(3000, () => {
  console.log('JSON Server rodando');
});