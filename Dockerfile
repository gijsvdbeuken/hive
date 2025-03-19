# Use official Node.js image as the base image
FROM node:18-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json for installing dependencies
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the Next.js app
RUN npm run build

# Create the production image from a smaller base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the node_modules and built application from the builder stage
COPY --from=builder /app /app

# Expose the port the app will run on
EXPOSE 3000

# Set the environment variable for production
ENV NODE_ENV=production

# Run the Next.js app in production mode
CMD ["npm", "start"]

# Declare the build argument
ARG OPENAI_API_KEY

# Set it as an environment variable so the app can use it
ENV OPENAI_API_KEY=${OPENAI_API_KEY}

# Continue with the rest of your Dockerfile...

