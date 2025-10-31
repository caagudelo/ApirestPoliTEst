const swaggerJsdoc = require("swagger-jsdoc");
const fs = require("fs");
const path = require("path");
const PUBLIC_URL = process.env.PUBLIC_URL;

/**
 * API Config Info
 */

// Normaliza la URL pública si está definida (agrega http:// si falta y elimina slash final)
const normalizePublicUrl = (raw) => {
  if (!raw) return null;
  let url = raw.trim();
  if (!/^https?:\/\//i.test(url)) {
    url = `http://${url}`; // añade esquema por defecto
  }
  // quita slash final para construir rutas limpias
  url = url.replace(/\/$/, "");
  return url;
};

const effectivePublicUrl = normalizePublicUrl(PUBLIC_URL);


// Si se define PUBLIC_URL se usará absoluta.
const servers = effectivePublicUrl
  ? [{ url: `${effectivePublicUrl}/api` }]
  : [{ url: '/api' }];

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Documentacion de mi API Trabajo poli",
    version: "1.0.0",
    description: "API REST para proyecto poli",
    contact: {
      name: "Camilo Andres Agudelo",
      email: "andres18160@gmail.com",
      url: "https://www.cagudelo.com"
    },
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT"
    }
  },
  servers,
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
  // Eliminados schemas de 'track' y 'storage' por limpieza del proyecto.
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
  
  // Las rutas 'tracks' y 'storage' se eliminaron del código base.
  const DISABLED_ROUTES = ['tracks', 'storage']; // Mantener por si existen archivos residuales físicos.
  
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