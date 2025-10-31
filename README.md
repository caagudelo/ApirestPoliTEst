
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

## Ejecutar con Docker (MySQL + API)

### Requisitos

- Docker y Docker Compose instalados
- Copiar el archivo `.env.example` a `.env` y ajustar valores sensibles (contraseñas, JWT, etc.)

### Pasos rápidos (PowerShell)

```powershell
# 1. Clonar el repositorio (si no lo tienes)
git clone https://github.com/caagudelo/ApirestPoliTEst.git
cd ApirestPoliTEst

# 2. Crear archivo .env basado en .env.example
Copy-Item .env.example .env
notepad .env  # Ajusta valores si deseas

# 3. Levantar servicios (API + MySQL)
docker compose up -d --build

# 4. Ver logs de la API
docker compose logs -f api

# 5. Parar servicios
docker compose down
```

### Estructura de servicios

- `api`: Contenedor Node.js con la API (puerto 3211 interno)
- `mysql`: Base de datos MySQL 8 inicializada con el script `database_script.sql`

### Datos iniciales

El archivo `database_script.sql` se monta en el contenedor MySQL y se ejecuta automáticamente al crear el volumen por primera vez. Incluye tablas, algunos inserts de ejemplo, vistas y procedimientos almacenados.

### Variables relevantes para MySQL

- `MYSQL_HOST=mysql` (nombre del servicio en la red interna Docker)
- `MYSQL_PORT=3306`
- `MYSQL_DATABASE` Nombre de la base
- `MYSQL_USER` Usuario de aplicación
- `MYSQL_PASSWORD` Contraseña del usuario de aplicación
- `MYSQL_ROOT_PASSWORD` Contraseña del usuario root (sólo en contenedor)

### Cambiar el puerto expuesto

Por defecto se expone el puerto externo igual al interno (`3211`). Puedes cambiarlo editando `docker-compose.yml`:

```yaml
ports:
	- "8080:3211"
```

Luego reinicia:

```powershell
docker compose up -d --build
```

### Reconstruir sin usar cache
```powershell
docker compose build --no-cache
docker compose up -d
```

### Limpiar volumen de datos MySQL (¡Destruye datos!)
```powershell
docker compose down -v
docker compose up -d --build
```

### Healthcheck
El servicio MySQL incluye un healthcheck para asegurar que la API sólo arranque cuando la base esté lista.

### Notas
Si usas también MongoDB, establece `ENGINE_DB=nosql` y asegúrate de que `DB_URI` apunte a tu instancia.



## Authors

CAMILO ANDRES AGUDELO
