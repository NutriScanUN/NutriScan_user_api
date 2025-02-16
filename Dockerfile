FROM node:22-alpine

# Crear y establecer el directorio de trabajo
WORKDIR /usr/src/app

# Copiar package.json y package-lock.json
COPY package*.json ./
COPY nutriscan-71493-firebase-adminsdk-ugmom-*.json /usr/src/app/nutriscan-71493-firebase-adminsdk-ugmom-e4fbdbaa0b.json
 
# Instalar dependencias
RUN npm install

# Copiar todo el código al contenedor
COPY . .

# Exponer el puerto
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["node", "src/index.js"]