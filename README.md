
# API-REST-Nodejs
 API REST Nodejs desde cero usando MongoDB o MySQL

## Para Actualizar Paquetes 

- Instalar la herramienta: npm install -g npm-check-updates
- Verifique que su paquete.json esté registrado en el control de versiones (el siguiente comando sobrescribirá el paquete.json)
- Actualice el paquete.json: ncu --upgrade
- Valide los cambios en su paquete.json
- Instalar los nuevos paquetes: npm install

## Dependiencias

- Cors: npm i cors
- Express : npm i express
- dotenv para manejar variables de entorno: npm i dotenv
- multer es un paquete para carga y almacenamiento de archivos: npm i multer
- Paquete para gestionar bases de datos no relacional MongoDb : npm i mongoose
- Paquete util que reinicia la app cada que un archivo sufrre un cambio : npm i nodemon -g
- Este paquete se utiliza para realizar validaciones de los datos que ingresan: npm i express-validators
- Este paquete permite interceptar los datos   : npm i morgan-body -S
- Para poder conectarno a slack y enviarl los errores: npm i @slack/webhook -S
- Manejador de paquetes SQL bases de datos relacionales: npm i sequelize -S
- Paquete necesario para utilizar bases de datos MySQl: npm i mysql2 -S
- ENGINE_DB Puede ser nosql o mysql
- Las tablas en Mysql se deben de crear de manera manual (IMPORTANTE!)
- Nos ofrece un controlador de documentacion de la api : npm i swagger-ui-express -S
- Permite poder crear la documentacion de forma facil en base a los comentarios que se ponen a nivel de codigo : npm i swagger-jsdoc
- tesseract sirve para reconocimiento y extraccion de texto en imagenes : npm install tesseract.js -S


## Environment Variables

Para ejecutar este proyecto, deberá agregar las siguientes variables de entorno a su archivo .env

`PORT`

`DB_URI`

`PUBLIC_URL`

`JWT_SECRET`

`SLACK_WEBHOOK`

`MYSQL_DATABASE`

`MYSQL_USER`

`MYSQL_HOST`

`ENGINE_DB`=nosql / mysql

`MYSQL_PASSWORD`


## Authors

CAMILO ANDRES AGUDELO
