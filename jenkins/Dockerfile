FROM jenkins/jenkins:lts

# Cambiar a root para instalar dependencias adicionales
USER root

# Instalar docker cli para poder hacer docker build dentro del contenedor (requiere socket montado)
RUN apt-get update && apt-get install -y --no-install-recommends \
    docker.io \
    curl \
    git \
    lsb-release \
  && rm -rf /var/lib/apt/lists/*

# Volver al usuario jenkins
USER jenkins

# Copiar archivo de plugins declarativo
COPY plugins.txt /usr/share/jenkins/ref/plugins.txt

# Instalar plugins al arranque (Jenkins los copiará a /var/jenkins_home si no existen)
RUN /usr/local/bin/install-plugins.sh < /usr/share/jenkins/ref/plugins.txt

# Exponer puertos por defecto Jenkins
EXPOSE 8080 50000

# Variables de entorno útiles
ENV JAVA_OPTS="-Djenkins.install.runSetupWizard=false" \
    CASC_JENKINS_CONFIG="/var/jenkins_home/casc" \
    JENKINS_OPTS="--httpPort=8080"

# Copiar configuración JCasC opcional (si luego se agrega)
# COPY casc/ /var/jenkins_home/casc/

# Al usar la imagen oficial, el entrypoint ya está definido
