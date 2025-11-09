// Jenkinsfile
// Buenas prácticas AnsiColor: plugin debe estar instalado. Se usa sólo como wrapper en steps.
// Para desactivar colores basta con remover los bloques ansiColor o condicionar con: if (env.ANSICOLOR != 'false') { ansiColor('xterm'){ ... } }
pipeline { // Declarativa: define el pipeline completo
  agent any // Usa cualquier nodo/ejecutor disponible
  options { // Opciones globales del pipeline
    timestamps() // Añade timestamp a cada línea del log
    buildDiscarder(logRotator(numToKeepStr: '15')) // Conserva solo los últimos 15 builds
    disableConcurrentBuilds() // Evita builds simultáneos del mismo job
  }
  environment { // Variables de entorno disponibles en stages
    NODE_VERSION = '20' // Versión de Node a usar en contenedores
    APP_PORT = '3211' // Puerto donde corre la app (referencial)
    DOCKER_IMAGE = 'apirestpolitest' // Nombre base de la imagen Docker
    USE_DOCKER = 'true' // Permite habilitar/deshabilitar uso de contenedores y comandos docker (poner 'false' si el nodo Jenkins no tiene docker)
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
    stage('Docker Diagnostics') {
      when { expression { return env.USE_DOCKER == 'true' } }
      steps {
        script {
          ansiColor('xterm') {
            sh 'echo "== Docker version =="'
            sh 'docker version || echo "(docker version fallo)"'
            sh 'echo "== Docker info (resumido)=="'
            sh 'docker info --format "Plugins: {{ .Plugins.Volume }}" || true'
            sh 'echo "== Imágenes existentes =="'
            sh 'docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}" | head -n 15 || true'
          }
        }
      }
    }
    stage('Generate .env') { // Generar archivo .env desde variables de entorno Jenkins
      steps {
        script {
          echo 'Generando archivo .env para docker compose y la app'
          // Nota: Para habilitar colores ANSI instala el plugin "AnsiColor" en Jenkins
          // y usa dentro de steps: ansiColor('xterm'){ /* comandos */ }
            def envContent = """
  PORT=${env.APP_PORT}
  ENGINE_DB=${env.ENGINE_DB}
  MYSQL_DATABASE=${env.MYSQL_DATABASE}
  MYSQL_USER=${env.MYSQL_USER}
  MYSQL_PASSWORD=${env.MYSQL_PASSWORD}
  MYSQL_ROOT_PASSWORD=${env.MYSQL_PASSWORD}
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
      steps {
        script {
          ansiColor('xterm') {
            if (env.USE_DOCKER == 'true') {
              echo 'Usando contenedor node para instalar dependencias'
              docker.image("node:${NODE_VERSION}-alpine").inside {
                sh 'node -v'
                sh 'npm ci || npm install'
              }
            } else {
              echo 'Modo fallback SIN docker: se espera que Node esté instalado en el agente'
              sh 'node -v || echo "Node no encontrado. Instala Node o habilita USE_DOCKER=true"'
              sh 'npm ci || npm install || echo "Instalación npm falló (verifica Node/npm en el agente)"'
            }
          }
        }
      }
    }
    stage('Lint') { // Revisión estática de código
      steps {
        script {
          ansiColor('xterm') {
            if (env.USE_DOCKER == 'true') {
              docker.image("node:${NODE_VERSION}-alpine").inside {
                sh 'npm run lint'
              }
            } else {
              sh 'npm run lint'
            }
          }
        }
      }
    }
    stage('Security Audit') { // Auditoría de vulnerabilidades npm
      steps {
        script {
          ansiColor('xterm') {
            if (env.USE_DOCKER == 'true') {
              docker.image("node:${NODE_VERSION}-alpine").inside {
                sh 'npm run audit'
              }
            } else {
              sh 'npm run audit'
            }
          }
        }
      }
    }
    stage('Unit Tests') { // Ejecución de tests (si existen)
      when { expression { return fileExists('test') } } // Condición: carpeta test presente
      steps {
        script {
          ansiColor('xterm') {
            if (env.USE_DOCKER == 'true') {
              docker.image("node:${NODE_VERSION}-alpine").inside {
                sh 'npm test'
              }
            } else {
              sh 'npm test'
            }
          }
        }
      }
    }
    stage('Coverage Report') {
      when { expression { return fileExists('test') } }
      steps {
        script {
          ansiColor('xterm') {
            if (env.USE_DOCKER == 'true') {
              docker.image("node:${NODE_VERSION}-alpine").inside {
                sh 'npm run coverage'
                sh 'cat coverage/lcov-report/index.html | head -n 20 || echo "Ver reporte completo en coverage/lcov-report/index.html"'
              }
            } else {
              sh 'npm run coverage'
              sh 'cat coverage/lcov-report/index.html | head -n 20 || echo "Ver reporte completo en coverage/lcov-report/index.html"'
            }
          }
        }
        // Publicar el reporte HTML de cobertura en Jenkins (requiere plugin HTML Publisher)
        publishHTML([reportDir: 'coverage/lcov-report', reportFiles: 'index.html', reportName: 'Coverage Report'])
      }
    }
    stage('Build Docker Image') { // Construcción de la imagen Docker local
      steps {
        script { // Bloque script para lógica Groovy
          def tag = env.BUILD_NUMBER // Usa número de build como tag único
          ansiColor('xterm') {
            sh "docker build -t ${DOCKER_IMAGE}:${tag} ." // Construye imagen con tag incremental
            sh "docker tag ${DOCKER_IMAGE}:${tag} ${DOCKER_IMAGE}:latest" // Actualiza etiqueta latest
          }
        }
      }
    }
    stage('Deploy (Docker Compose)') { // Despliegue usando docker compose local
      steps {
        ansiColor('xterm') {
          sh 'docker compose down || true' // Detiene y elimina servicios previos si existen (ignora error)
          sh 'docker compose up -d --build' // Levanta servicios en segundo plano reconstruyendo si es necesario
          sh 'echo "== Estado contenedores =="'
          sh 'docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}"'
          sh 'echo "Logs API (últimas 50 líneas)"'
          sh 'docker logs --tail 50 apirestpolitest_api || true'
        }
      }
    }
  }
  post { // Acciones finales según resultado
    success { // Si el pipeline termina correctamente
      ansiColor('xterm') { echo "\u001B[32mBuild OK\u001B[0m" } // Mensaje éxito verde
    }
    failure { // Si alguna stage falla
      ansiColor('xterm') { echo "\u001B[31mBuild Failed\u001B[0m" } // Mensaje fallo rojo
    }
  }
}
