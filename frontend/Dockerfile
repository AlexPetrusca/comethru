# Use the official Node.js runtime as the base image
FROM node:24-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available) to the working directory
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy the rest of the application code to the working directory
COPY . .

# todo: DON'T DO THIS IN PROD
COPY .env .

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs &&\
    adduser -S nextjs -u 1001

# Change ownership of the app directory to the non-root user
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port 3000 to allow communication to/from the application
EXPOSE 3000

# Define the command to run the application
CMD [ "node", "server.js" ]