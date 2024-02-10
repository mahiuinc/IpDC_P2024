# Utiliza una imagen base con Node.js
FROM node:14

#Establece el directorio de trabajo en /app
WORKDIR /app

# Copia los archivos necesarios al contenedor
COPY package.json package-lock.json /app/

#Instala las dependencias
RUN npm install

# Copia el resto de los archivos al contenedor
COPY . /app/

# Comando para ejecutar la aplicación al iniciar el contenedor
CMD ["npm", "dev"]