# Jenkins local para ApirestPoliTEst

Esta carpeta contiene la infraestructura para levantar un Jenkins con plugins preinstalados.

## Contenido
- `Dockerfile`: Imagen basada en `jenkins/jenkins:lts` con instalación de plugins definidos en `plugins.txt`.
- `plugins.txt`: Lista declarativa de plugins. Puedes fijar versiones usando `plugin:version`.

## Construir imagen
```powershell
# Desde raíz del repo
docker build -t apirestpolitest-jenkins ./jenkins
```

## Ejecutar Jenkins (modo simple)
```powershell
docker run -d --name jenkins \
  -p 8080:8080 -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  apirestpolitest-jenkins
```

Montar el socket Docker permite que los pipelines usen `docker build` desde el contenedor Jenkins.

## Integración opcional en docker-compose existente
Agrega este servicio (ver sección abajo) al archivo `docker-compose.yml` si quieres levantar Jenkins y la API juntas.

## Actualizar plugins
1. Edita `plugins.txt`.
2. Reconstruye la imagen: `docker build -t apirestpolitest-jenkins ./jenkins`.
3. Reinicia el contenedor.

Para ver los IDs de plugins instalados actualmente: en la UI Jenkins (Manage Jenkins > Plugin Manager) o consulta el archivo `jenkins_home/plugins` dentro del volumen.

## Snippet docker-compose (ejemplo)
```yaml
  jenkins:
    build: ./jenkins
    container_name: apirestpolitest_jenkins
    ports:
      - "8080:8080"
      - "50000:50000"
    volumes:
      - jenkins_home:/var/jenkins_home
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      - JAVA_OPTS=-Djenkins.install.runSetupWizard=false
    networks:
      - apirest_net
```
Asegúrate de declarar el volumen:
```yaml
volumes:
  jenkins_home:
```

## Credenciales
Para mover secretos del `Jenkinsfile` a credenciales:
1. Manage Jenkins > Credentials > (global) > Add Credentials.
2. Usa IDs: `mysql-password`, `jwt-secret`.
3. En el `Jenkinsfile` reemplaza con `withCredentials([string(credentialsId: 'mysql-password', variable: 'MYSQL_PASSWORD'), string(credentialsId: 'jwt-secret', variable: 'JWT_SECRET')]) { ... }`.

## JCasC (opcional)
Puedes añadir configuración as code creando carpeta `jenkins/casc/` y copiando archivos YAML. Descomenta la línea `COPY casc/ ...` en el Dockerfile.

## Troubleshooting rápido
- Plugin faltante: Añadir a `plugins.txt` y reconstruir.
- Versión incompatible: Fijar versión concreta `plugin:1.2.3`.
- Problemas con permisos Docker: Asegurar que el socket `/var/run/docker.sock` montado y el usuario `jenkins` pertenecen al grupo adecuado (en Linux Docker host). En Windows con Docker Desktop suele funcionar directo.

## Seguridad
No expongas Jenkins públicamente sin habilitar autenticación, HTTPS y roles (plugin `matrix-auth`).
