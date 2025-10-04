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
      // Schemas de pacientes
      paciente: {
        type: "object",
        required: ["id", "nombre"],
        properties: {
          id: {
            type: "string",
            example: "12345"
          },
          nombre: {
            type: "string",
            example: "Carlos Gómez"
          },
          telefono: {
            type: "string",
            example: "3001234567"
          },
          email: {
            type: "string",
            example: "carlos@email.com"
          },
          fecha_nacimiento: {
            type: "string",
            format: "date",
            example: "1990-05-15"
          },
          direccion: {
            type: "string",
            example: "Calle 123 #45-67"
          }
        }
      },
      historiaClinica: {
        type: "object",
        required: ["paciente_id", "tipo_registro", "descripcion"],
        properties: {
          paciente_id: {
            type: "string",
            example: "12345"
          },
          tipo_registro: {
            type: "string",
            enum: ["diagnostico", "medicamento", "procedimiento", "nota"],
            example: "diagnostico"
          },
          descripcion: {
            type: "string",
            example: "Hipertensión controlada"
          },
          fecha: {
            type: "string",
            format: "date",
            example: "2025-09-22"
          },
          medico: {
            type: "string",
            example: "Dr. García"
          },
          observaciones: {
            type: "string",
            example: "Paciente responde bien al tratamiento"
          }
        }
      },
      // Schemas desactivados temporalmente (tracks y storage)
      // track: {
      //   type: "object",
      //   required: ["name", "album", "cover", "artist", "duration", "mediaId"],
      //   properties: {
      //     name: {
      //       type: "string",
      //     },
      //     album: {
      //       type: "string",
      //     },
      //     cover: {
      //       type: "string",
      //     },
      //     artist: {
      //       type: "object",
      //       properties: {
      //         name: {
      //           type: "string",
      //         },
      //         nickname: {
      //           type: "string",
      //         },
      //         nationality: {
      //           type: "string",
      //         },
      //       },
      //     },
      //     duration: {
      //       type: "object",
      //       properties: {
      //         start: {
      //           type: "integer",
      //         },
      //         end: {
      //           type: "integer",
      //         },
      //       },
      //     },
      //     mediaId: {
      //       type: "string",
      //     },
      //   },
      // },
      // storage: {
      //   type: "object",
      //   properties: {
      //     url: {
      //       type: "string",
      //     },
      //     filename: {
      //       type: "string",
      //     },
      //   },
      // },
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