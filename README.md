
<div align="center">

# API REST Clínica (Node.js + MySQL/MongoDB)

API académica para la gestión de pacientes, citas e historias clínicas. Diseñada como proyecto para el Poli demostrando buenas prácticas de diseño REST, documentación con OpenAPI/Swagger y despliegue en contenedores Docker.

</div>

## 🎯 Objetivo del Proyecto
Proveer una plataforma base para: 
1. Registrar y autenticar usuarios (JWT). 
2. Administrar pacientes y sus historias clínicas. 
3. Gestionar citas médicas. 

## 🧱 Arquitectura y Capas
- `app.js`: Punto de entrada, carga middlewares, rutas y documentación (`/documentacion`).
- `routes/`: Define endpoints agrupados por dominio (auth, pacientes, citas, contact...).
- `controllers/`: Lógica de negocio directa para cada recurso.
- `models/`: Dos implementaciones (MySQL vía Sequelize y MongoDB vía Mongoose) seleccionadas según `ENGINE_DB`.
- `middleware/`: Reglas transversales (roles, sesión, cabeceras personalizadas, validaciones).
- `docs/swagger.js`: Genera especificación OpenAPI 3 dinámica según las rutas activas.
- Logging: `morgan-body` + stream a `handleLogger` para registrar sólo errores (>=400).

## 🗄️ Motores de Base de Datos
La API puede trabajar con:
- MySQL (relacional) usando Sequelize (`ENGINE_DB=mysql`).
- MongoDB (NoSQL) usando Mongoose (`ENGINE_DB=nosql`).

La selección se hace en tiempo de arranque leyendo `ENGINE_DB` y conectando con `config/mysql.js` o `config/mongo.js`.

## 🔐 Seguridad
- Autenticación: JWT (secreto definido en `JWT_SECRET`).
- Validaciones: `express-validator` en la capa de rutas y validators.
- Manejo de errores centralizado mediante un middleware global.
- Slack Webhook opcional (`SLACK_WEBHOOK`) para notificación de errores críticos (requiere implementación adicional en utils si se activa).

## 📄 Documentación Interactiva
Disponible en: `http://localhost:<PUERTO>/documentacion` (Swagger UI). 
`PUBLIC_URL` permite definir la URL base pública para generar correctamente los servidores en OpenAPI.

## 📦 Principales Dependencias
- express, cors, dotenv
- mongoose / sequelize + mysql2
- jsonwebtoken, bcryptjs
- express-validator, morgan-body
- swagger-jsdoc, swagger-ui-express

Para actualizar versiones:
```powershell
npm install -g npm-check-updates
ncu --upgrade
npm install
```

## 🔑 Variables de Entorno (.env)
| Variable | Descripción |
|----------|-------------|
| PORT | Puerto de la API (interno contenedor 3211 por defecto) |
| PUBLIC_URL | URL pública (sin slash final) para documentación |
| ENGINE_DB | "mysql" o "nosql" para seleccionar motor |
| DB_URI | URI de conexión a MongoDB (si ENGINE_DB=nosql) |
| MYSQL_HOST | Host MySQL (en Docker usar nombre del servicio: mysql) |
| MYSQL_DATABASE | Nombre base de datos MySQL |
| MYSQL_USER | Usuario aplicación MySQL |
| MYSQL_PASSWORD | Contraseña usuario aplicación |
| MYSQL_ROOT_PASSWORD | Contraseña root (solo contenedor) |
| JWT_SECRET | Secreto para firmar tokens JWT |

## 🚀 Flujo de Inicialización
1. Se carga configuración y middlewares básicos.
2. Se registra documentación Swagger (`/documentacion`).
3. Se montan rutas dinámicas desde `routes/index.js`.
4. Se establece conexión según `ENGINE_DB`.
5. Logger captura y almacena errores (>=400).

## 🐳 Despliegue en Docker
El proyecto incluye `Dockerfile` y `docker-compose.yml` para levantar una pila con la API y MySQL.

### Código del Dockerfile
```dockerfile
# Imagen base ligera con Node.js 20
FROM node:20-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia archivos de dependencias primero para aprovechar cache de capas
COPY package*.json ./

# Instala TODAS las dependencias (prod + dev) -> nodemon disponible
RUN npm install

# Copia el resto del código fuente
COPY . .

# Expone el puerto interno que usa la app (definido en compose)
EXPOSE 3211

# Comando por defecto: modo desarrollo con recarga automática
CMD ["npm", "run", "dev"]
```

#### Explicación por instrucción
| Instrucción | Propósito |
|-------------|-----------|
| FROM node:20-alpine | Usa una imagen oficial optimizada (Alpine) para reducir tamaño. |
| WORKDIR /app | Establece el directorio donde se ejecutarán comandos posteriores. |
| COPY package*.json ./ | Copia manifestos para instalar dependencias antes del código (mejor cache). |
| RUN npm install | Instala dependencias declaradas. Incluye devDependencies para nodemon. |
| COPY . . | Lleva el código al contenedor. |
| EXPOSE 3211 | Documenta el puerto usado (no publica por sí solo). |
| CMD ["npm", "run", "dev"] | Arranca la aplicación en modo desarrollo. |

> Para producción podrías cambiar el CMD a `node app.js` y usar `npm ci` para instalaciones determinísticas.

### Código de docker-compose.yml
```yaml
services:
  api:
    build: .
    container_name: apirestpolitest_api
    env_file: .env
    ports:
      - "3211:${PORT:-3211}"
    depends_on:
      mysql:
        condition: service_healthy
    volumes:
      - .:/app
      - /app/node_modules
    networks:
      - apirest_net
    restart: unless-stopped

  mysql:
    image: mysql:8.0
    container_name: apirestpolitest_mysql
    command: --default-authentication-plugin=mysql_native_password --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD:-rootpass}
      MYSQL_DATABASE: ${MYSQL_DATABASE}
      MYSQL_USER: ${MYSQL_USER}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
    ports:
      - "${MYSQL_PORT:-3306}:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./database_script.sql:/docker-entrypoint-initdb.d/database_script.sql:ro
    healthcheck:
      test: ["CMD-SHELL", "mysqladmin ping -h localhost -uroot -p${MYSQL_ROOT_PASSWORD:-rootpass} || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s
    networks:
      - apirest_net
    restart: unless-stopped

networks:
  apirest_net:
    driver: bridge

volumes:
  mysql_data:
```

#### Explicación de la configuración
| Elemento | Explicación |
|----------|------------|
| build: . | Construye la imagen de la API usando el Dockerfile actual. |
| env_file: .env | Inyecta variables de entorno sin hardcodearlas. |
| ports: "3211:${PORT:-3211}" | Mapea el puerto host 3211 al interno definido en PORT (fallback 3211). |
| depends_on + healthcheck | Garantiza que la API arranque sólo cuando MySQL responde. |
| volumes código | Monta el código local para desarrollo con live reload. |
| volumen node_modules | Evita sobrescribir dependencias instaladas dentro del contenedor. |
| command MySQL | Ajusta plugin de autenticación y colación para compatibilidad y soporte UTF-8 completo. |
| environment MySQL | Configura credenciales y base inicial usando variables dinámicas. |
| init script | Ejecuta `database_script.sql` al crear el volumen inicial (automatiza esquema). |
| healthcheck MySQL | Comprueba disponibilidad ejecutando `mysqladmin ping`. |
| restart: unless-stopped | Reinicia contenedores ante fallos, salvo detención manual. |
| network bridge | Aísla tráfico interno entre servicios y expone sólo lo necesario. |
| volume mysql_data | Persiste datos entre reinicios. |

#### Escenarios de Uso
| Escenario | Acción |
|----------|--------|
| Desarrollo con recarga | Mantener CMD actual y volumen del código. |
| Producción básica | Cambiar CMD a `node app.js` y remover volumen del código. |
| Regenerar base de datos | `docker compose down -v && docker compose up -d --build`. |
| Cambio de puerto externo | Editar sección `ports` en servicio api. |

#### Mejora Opcional (Producción)
Separar archivo `docker-compose.prod.yml` con:
```yaml
api:
  build: .
  command: ["node", "app.js"]
  ports:
    - "80:3211"
  volumes: []
  restart: always
```
Y ejecutar:
```powershell
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

---

### 1. Requisitos Previos
- Docker y Docker Compose instalados.
- Archivo `.env` configurado (puedes copiar desde `.env.example`).

### 2. Estructura de Servicios (docker-compose)
| Servicio | Rol | Puerto |
|----------|-----|--------|
| api | Contenedor Node.js (Express) | 3211 interno (mapeado) |
| mysql | Base de datos MySQL 8 | 3306 |

`database_script.sql` se monta y ejecuta la primera vez creando tablas y datos de ejemplo.

### 3. Build + Up (Modo rápido)
```powershell
docker compose up -d --build
```
Esto: 
1. Construye la imagen de la API. 
2. Crea contenedor MySQL con volumen persistente. 
3. Ejecuta script inicial si el volumen es nuevo.

### 4. Ver Logs
```powershell
docker compose logs -f api
```

### 5. Reconstruir sin caché
```powershell
docker compose build --no-cache
docker compose up -d
```

### 6. Cambiar Puerto Externo
Edita en `docker-compose.yml`:
```yaml
ports:
  - "8080:3211"
```
Luego:
```powershell
docker compose up -d --build
```

### 7. Limpiar Volúmenes (BORRA DATOS)
```powershell
docker compose down -v
docker compose up -d --build
```

### 8. Healthcheck
MySQL incluye un healthcheck para iniciar la API cuando el motor está listo.

### 9. Usar MongoDB en lugar de MySQL
Este compose está orientado a MySQL. Para usar MongoDB:
1. Lanza un contenedor `mongo` externo o servicio administrado.
2. Ajusta `.env`: `ENGINE_DB=nosql` y `DB_URI=mongodb://<host>:27017/<db>`.
3. Reinicia la API (`docker compose up -d --build`).

## 🧪 Desarrollo Local sin Docker
```powershell
npm install
npm run dev
```
Requiere MySQL o MongoDB corriendo localmente. Ajusta `.env` en consecuencia.

## 🔄 Principales Endpoints (Resumen)
- `POST /api/auth/login` / `POST /api/auth/register`
- `GET /api/pacientes` / `POST /api/pacientes`
- `GET /api/citas` / `POST /api/citas`
- `GET /api/historiaClinica` / `POST /api/historiaClinica`
- Documentación: `GET /documentacion`

> Para especificación completa consulta Swagger.

## ♻️ Extensión y Buenas Prácticas
- Añadir nuevo recurso: crear modelo (ambos motores si aplica), controlador, ruta y schema en Swagger.
- Mantener validaciones centralizadas en `validators/`.
- Manejo de errores consistente retornando JSON con mensaje y código.
- Uso de variables de entorno para evitar datos sensibles en el código.

## 🛠 Scripts NPM
| Script | Descripción |
|--------|-------------|
| start | Ejecuta producción (node app.js) |
| dev | Desarrollo con recarga (nodemon) |

## 👤 Autor
Camilo Andrés Agudelo


