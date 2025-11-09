const app = require('./app');
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('Tu app esta lista por http://localhost:' + port);
});

// Conexión a la base de datos
const ENGINE_DB = process.env.ENGINE_DB;
if (ENGINE_DB === 'nosql') {
  require('./config/mongo')();
} else {
  require('./config/mysql').dbConnectMySql();
}
