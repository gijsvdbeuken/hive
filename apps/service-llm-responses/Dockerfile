# Use official Node.js image as the base image
FROM node:18-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json for installing dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Create the production image from a smaller base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy node_modules and application code from the builder stage
COPY --from=builder /app /app

# Expose the port the app will run on
EXPOSE 3002

# Set the environment variable for production
ENV NODE_ENV=production

# Run the Express server in production mode
CMD ["node", "./src/server.js"]

