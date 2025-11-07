FROM jenkins/jenkins:lts

# Cambiar a root para instalar dependencias adicionales
USER root

# Instalar Docker CLI oficial y utilidades necesarias
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates curl git gnupg lsb-release \
  && install -m 0755 -d /etc/apt/keyrings \
  && curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg \
  && chmod a+r /etc/apt/keyrings/docker.gpg \
  && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" > /etc/apt/sources.list.d/docker.list \
  && apt-get update \
  && apt-get install -y --no-install-recommends docker-ce-cli docker-buildx-plugin docker-compose-plugin \
  && docker -v \
  && rm -rf /var/lib/apt/lists/*

# Volver al usuario jenkins
USER jenkins

# Copiar lista de plugins y ejecutar instalación automática
COPY plugins.txt /usr/share/jenkins/ref/plugins.txt
RUN jenkins-plugin-cli --plugin-file /usr/share/jenkins/ref/plugins.txt
# Exponer puertos por defecto Jenkins
EXPOSE 8080 50000

# Variables de entorno útiles
ENV JAVA_OPTS="-Djenkins.install.runSetupWizard=false" \
    CASC_JENKINS_CONFIG="/var/jenkins_home/casc" \
    JENKINS_OPTS="--httpPort=8080"

# Copiar configuración JCasC opcional (si luego se agrega)
# COPY casc/ /var/jenkins_home/casc/

# Al usar la imagen oficial, el entrypoint ya está definido
