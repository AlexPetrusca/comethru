# Use the official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available) to the working directory
COPY frontend/package*.json ./

# Install dependencies
RUN npm install

# Install nodemon globally for development
RUN npm install -g nodemon

# Copy the rest of the application code to the working directory
COPY frontend/ .

# Expose port 3000 to allow communication to/from the application
EXPOSE 3000

# Define the command to run the application with nodemon for development
CMD [ "nodemon", "server.js" ]