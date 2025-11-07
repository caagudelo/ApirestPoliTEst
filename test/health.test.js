const http = require('http');

test('Servidor responde en /', done => {
  const req = http.request({ host: 'localhost', port: 3211, path: '/', method: 'GET' }, res => {
    expect([200,404]).toContain(res.statusCode);
    done();
  });
  req.on('error', done);
  req.end();
});