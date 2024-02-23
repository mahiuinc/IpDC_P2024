# Base image
FROM node:14

# Set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app files
COPY . /app/

ENV PORT=3000

# Expose port
EXPOSE 3000

# start app
CMD ["npm", "start"]
