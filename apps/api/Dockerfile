# Use the official Node.js image as the base image
FROM node:20.18.1-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json (if available) to install dependencies first
COPY package*.json ./

# Install dependencies
RUN npm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the project using the NestJS build command
RUN npm run build

# Expose the port the app runs on (if needed)
EXPOSE 3000

# Set the default command to start the application in production mode
CMD ["npm", "run", "start:prod"]
