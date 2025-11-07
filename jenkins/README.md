# Jenkins para ApirestPoliTEst

Guía completa para construir, ejecutar y configurar Jenkins localmente usando Docker.

## 1. Prerrequisitos
- Docker Desktop instalado y corriendo.
- Puerto 8080 libre (o ajusta si está ocupado).
- Opcional: puerto 50000 libre si usarás agentes JNLP.

## 2. Construir la imagen

```powershell
# Desde la raíz del repositorio
docker build -t apirestpolitest-jenkins ./jenkins
```

Si quieres una imagen sin wizard (arranque directo), asegúrate de que el `Dockerfile` contenga la variable:
```
ENV JAVA_OPTS="-Djenkins.install.runSetupWizard=false"
```
Para ver el wizard, elimina esa parte y reconstruye.

## 3. Ejecutar el contenedor (modo básico)

```powershell
docker run -d --name jenkins \
  -p 8080:8080 -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  apirestpolitest-jenkins
```

Ver logs:
```powershell
docker logs -f jenkins
```

## 4. Obtener contraseña inicial (solo con wizard activo)

Si NO desactivaste el wizard:
```powershell
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```
Si desactivaste el wizard, ese archivo no existirá.

## 5. Montar Docker (si necesitas ejecutar builds con Docker CLI)

Edita el run para incluir el socket:
```powershell
docker run -d --name jenkins \
  -p 8080:8080 -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  apirestpolitest-jenkins
```
Esto permite usar `docker build` en pipelines (requiere que el contenedor tenga Docker CLI instalado; ajusta el Dockerfile si no).

## 6. Reinicio automático

```powershell
docker run -d --name jenkins \
  --restart unless-stopped \
  -p 8080:8080 -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  apirestpolitest-jenkins
```

## 7. Limpieza y reinicio desde cero

```powershell
docker rm -f jenkins
docker volume rm jenkins_home
```
Luego reconstruye y lanza de nuevo.

## 8. Plugins recomendados (instalación manual)
Desde la UI: Manage Jenkins > Plugin Manager > Available.
Recomendados para este proyecto:
- Git
- Pipeline (workflow-*)
- Credentials
- AnsiColor
- Blue Ocean (opcional)
- Slack (si usarás notificaciones)
- Configuration as Code (para reproducibilidad)

## 9. Añadir credenciales
1. Manage Jenkins > Credentials > (global) > Add Credentials.
2. Crea credencial tipo "Secret text" o "Username with password" para DB y JWT.
3. IDs sugeridos: `mysql-password`, `jwt-secret`.
4. En el `Jenkinsfile` usar `withCredentials`.

Ejemplo:
```groovy
withCredentials([
  string(credentialsId: 'mysql-password', variable: 'MYSQL_PASSWORD'),
  string(credentialsId: 'jwt-secret', variable: 'JWT_SECRET')
]) {
  // steps
}
```

## 10. Primer pipeline rápido
Crear un nuevo job tipo "Pipeline" y escoger "Pipeline script from SCM" apuntando al repo GitHub. El archivo `Jenkinsfile` ya está en el repositorio.

## 11. Actualizar la imagen
Si cambias el `Dockerfile`:
```powershell
docker build -t apirestpolitest-jenkins ./jenkins
docker rm -f jenkins
# Ejecuta de nuevo (ver sección 3)
```

## 11.1 Ejecutar con docker-compose
Archivo de ejemplo incluido: `docker-compose.jenkins.yml`

```yaml
version: '3.8'
services:
  jenkins:
    build: ./jenkins
    container_name: apirestpolitest_jenkins
    ports:
      - "8080:8080"
      - "50000:50000"
    volumes:
      - jenkins_home:/var/jenkins_home
      - /var/run/docker.sock:/var/run/docker.sock
    restart: unless-stopped
    environment:
      - JAVA_OPTS=-Djenkins.install.runSetupWizard=false

volumes:
  jenkins_home:
```

Levantar:
```powershell
docker compose -f docker-compose.jenkins.yml up -d --build
```
Ver estado:
```powershell
docker compose -f docker-compose.jenkins.yml ps
```
Logs:
```powershell
docker compose -f docker-compose.jenkins.yml logs -f
```
Detener:
```powershell
docker compose -f docker-compose.jenkins.yml down
```

## 12. Troubleshooting
- No aparece wizard: volumen ya tenía datos o wizard desactivado por JAVA_OPTS.
- Error de permisos Docker: revisa socket y que Docker Desktop esté activo.
- Pipeline falla por falta de docker CLI: instala el CLI en el Dockerfile o usa agentes externos.
- No se ve `initialAdminPassword`: wizard desactivado.

## 13. Migrar a instalación con plugins automáticos (opcional)
Añade en el Dockerfile:
```dockerfile
# Ejemplo simple (crear plugins.txt con los IDs)
COPY plugins.txt /usr/share/jenkins/ref/plugins.txt
RUN jenkins-plugin-cli --plugin-file /usr/share/jenkins/ref/plugins.txt
```
En este repositorio ya hay un `plugins.txt` de ejemplo con:
```
workflow-aggregator
git
credentials
credentials-binding
ansiColor
docker-workflow
nodejs
configuration-as-code
blueocean
matrix-auth
```
Se instalaban automáticamente al build. Si quieres desactivar esta instalación, elimina las líneas correspondientes en el Dockerfile.

## 14. Seguridad básica
- Habilita autorización (Matrix Authorization) si expones el puerto fuera de localhost.
- Considera HTTPS con reverse proxy (Nginx / Traefik) si se accede remotamente.

## 15. Backup rápido del volumen
```powershell
docker run --rm -v jenkins_home:/data -v ${PWD}:/backup alpine sh -c 'tar czf /backup/jenkins_home_backup.tgz -C /data .'
```

## 16. Restaurar
```powershell
docker rm -f jenkins
# Crear volumen vacío
docker volume rm jenkins_home
# Crear nuevo volumen
docker volume create jenkins_home
# Restaurar
docker run --rm -v jenkins_home:/data -v ${PWD}:/backup alpine sh -c 'tar xzf /backup/jenkins_home_backup.tgz -C /data'
```

---
Esta guía cubre los escenarios comunes. Si necesitas agregar agentes remotos, integración Sonar, o pipelines multibranch, amplía la configuración según tus necesidades.
