const swaggerJsdoc = require("swagger-jsdoc");
const fs = require("fs");
const path = require("path");
const PUBLIC_URL = process.env.PUBLIC_URL;

/**
 * API Config Info
 */

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Documentacion de mi API Trabajo poli",
    version: "1.0.0",
    contact: {
      email: "andres18160@gmail.com"
  }
  },
  servers: [
    {
      url: `${PUBLIC_URL}/api`,
    }
  ],
  components: {
    securitySchemes:{
        bearerAuth:{
            type:"http",
            scheme:"bearer"
        }
    },
    schemas: {
      authLogin: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: {
            type: "string",
          },
          password: {
            type: "string",
          },
        },
      },
      authRegister: {
        type: "object",
        required: ["email", "password", "age", "name"],
        properties: {
          name: {
            type: "string",
          },
          age: {
            type: "integer",
          },
          email: {
            type: "string",
          },
          password: {
            type: "string",
          },
        },
      },
      track: {
        type: "object",
        required: ["name", "album", "cover", "artist", "duration", "mediaId"],
        properties: {
          name: {
            type: "string",
          },
          album: {
            type: "string",
          },
          cover: {
            type: "string",
          },
          artist: {
            type: "object",
            properties: {
              name: {
                type: "string",
              },
              nickname: {
                type: "string",
              },
              nationality: {
                type: "string",
              },
            },
          },
          duration: {
            type: "object",
            properties: {
              start: {
                type: "integer",
              },
              end: {
                type: "integer",
              },
            },
          },
          mediaId: {
            type: "string",
          },
        },
      },
      storage: {
        type: "object",
        properties: {
          url: {
            type: "string",
          },
          filename: {
            type: "string",
          },
        },
      },
    },
  },
};

/**
 * Función para obtener solo las rutas activas
 */
const getActiveRoutes = () => {
  const PATH_ROUTES = path.join(__dirname, "../routes");
  const files = fs.readdirSync(PATH_ROUTES);
  
  const removeExtension = (fileName) => {
    return fileName.split('.').shift();
  };
  
  // Lista de rutas desactivadas (debe coincidir con routes/index.js)
  const DISABLED_ROUTES = ['tracks', 'storage'];
  
  return files
    .filter(file => {
      const name = removeExtension(file);
      return name !== 'index' && !DISABLED_ROUTES.includes(name);
    })
    .map(file => `./routes/${file}`);
};

/**
 * Opciones
 */
const options = {
  swaggerDefinition,
  apis: getActiveRoutes(), // Solo rutas activas dinámicamente
};

const openApiConfigration = swaggerJsdoc(options);

module.exports = openApiConfigration;