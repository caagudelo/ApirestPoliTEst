pipeline { // Declarativa: define el pipeline completo
  agent any // Usa cualquier nodo/ejecutor disponible
  options { // Opciones globales del pipeline
    timestamps() // Añade timestamp a cada línea del log
    ansiColor('xterm') // Colorea salida ANSI para mejor legibilidad
    buildDiscarder(logRotator(numToKeepStr: '15')) // Conserva solo los últimos 15 builds
    disableConcurrentBuilds() // Evita builds simultáneos del mismo job
  }
  environment { // Variables de entorno disponibles en stages
    NODE_VERSION = '20' // Versión de Node a usar en contenedores
    APP_PORT = '3211' // Puerto donde corre la app (referencial)
    DOCKER_IMAGE = 'apirestpolitest' // Nombre base de la imagen Docker
    // Valores por defecto (pueden ser sobreescritos por credenciales en Jenkins)
    PORT = '3211' // Valor PORT directo del .env
    ENGINE_DB = 'mysql'
    MYSQL_DATABASE = 'dbapitest'
    MYSQL_USER = 'appuser'
    MYSQL_PASSWORD = 'rootpass' // Valor actual del .env (Considera mover a credencial)
    MYSQL_HOST = 'mysql'
    JWT_SECRET = 'LlaveMaestra' // Valor actual del .env (Considera mover a credencial)
    DB_URI = ''
    PUBLIC_URL = 'http://localhost:3211'
    SLACK_WEBHOOK = ''
  }
  triggers { // Definición de disparadores
    pollSCM('@daily') // Revisa cambios en Git una vez al día si no hay webhooks
  }
  stages { // Lista de etapas secuenciales
    stage('Generate .env') { // Generar archivo .env desde variables de entorno Jenkins
      steps {
        script {
          echo 'Generando archivo .env para docker compose y la app'
          def envContent = """
PORT=${env.APP_PORT}
ENGINE_DB=${env.ENGINE_DB}
MYSQL_DATABASE=${env.MYSQL_DATABASE}
MYSQL_USER=${env.MYSQL_USER}
MYSQL_PASSWORD=${env.MYSQL_PASSWORD}
MYSQL_HOST=${env.MYSQL_HOST}
JWT_SECRET=${env.JWT_SECRET}
DB_URI=${env.DB_URI}
PUBLIC_URL=${env.PUBLIC_URL}
""".stripIndent().trim() + "\n"
          writeFile file: '.env', text: envContent
          echo 'Contenido .env (ocultando posibles secretos sensibles)'
          echo envContent.replaceAll(/(JWT_SECRET|MYSQL_PASSWORD)=.*/, '$1=***')
        }
      }
    }
    stage('Checkout') { // Etapa de descarga de código
      steps { // Pasos de la etapa
        checkout scm // Clona/actualiza el repositorio configurado
      }
    }
    stage('Node Setup') { // Preparar entorno Node y dependencias
      agent { docker { image "node:${NODE_VERSION}-alpine" } } // Ejecuta esta stage dentro de un contenedor Node Alpine
      steps {
        sh 'node -v' // Muestra versión de Node para trazabilidad
        sh 'npm ci || npm install' // Instala dependencias: ci si hay lock, si falla usa install
      }
    }
    stage('Lint') { // Revisión estática de código
      agent { docker { image "node:${NODE_VERSION}-alpine" } } // Usa el mismo contenedor Node
      steps {
        sh 'npm run lint' // Ejecuta ESLint según script definido
      }
    }
    stage('Security Audit') { // Auditoría de vulnerabilidades npm
      when { branch 'main' } // Solo en la rama main
      agent { docker { image "node:${NODE_VERSION}-alpine" } } // Contenedor Node
      steps {
        sh 'npm run audit' // Lanza npm audit con nivel configurado
      }
    }
    stage('Unit Tests') { // Ejecución de tests (si existen)
      when { expression { return fileExists('test') } } // Condición: carpeta test presente
      agent { docker { image "node:${NODE_VERSION}-alpine" } } // Contenedor Node
      steps {
        sh 'npm test' // Ejecuta script de pruebas definido en package.json
      }
    }
    stage('Build Docker Image') { // Construcción de la imagen Docker local
      when { branch 'main' } // Solo en main
      steps {
        script { // Bloque script para lógica Groovy
          def tag = env.BUILD_NUMBER // Usa número de build como tag único
          sh "docker build -t ${DOCKER_IMAGE}:${tag} ." // Construye imagen con tag incremental
          sh "docker tag ${DOCKER_IMAGE}:${tag} ${DOCKER_IMAGE}:latest" // Actualiza etiqueta latest
        }
      }
    }
    stage('Deploy (Docker Compose)') { // Despliegue usando docker compose local
      when { branch 'main' } // Solo en main
      steps {
        sh 'docker compose down || true' // Detiene y elimina servicios previos si existen (ignora error)
        sh 'docker compose up -d --build' // Levanta servicios en segundo plano reconstruyendo si es necesario
      }
    }
  }
  post { // Acciones finales según resultado
    success { // Si el pipeline termina correctamente
      echo 'Build OK' // Mensaje simple de éxito
    }
    failure { // Si alguna stage falla
      echo 'Build Failed' // Mensaje simple de fallo
    }
  }
}
