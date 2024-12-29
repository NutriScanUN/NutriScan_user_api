# NutriScan_user_api
<br></br>
Commands to docker compile and run: \\
docker build -t nutriscanun-user-api .
docker run -d -p 3000:3000 --env-file .env --name  nutriscanun-user-api-docker nutriscanun-user-api
<br></br>
Instructions to deploy on render:
**Crea un repositorio en GitHub y sube tu código.
En Render, selecciona "New Web Service" y conecta tu repositorio.
Configura los siguientes parámetros en Render:
Build Command: docker build -t firestore-microservice .
Start Command: docker run -p 3000:3000 firestore-microservice
Environment Variables: Añade las variables de entorno necesarias (PORT, etc.).
Despliega el servicio.
