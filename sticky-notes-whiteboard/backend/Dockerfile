# Use a lightweight Node.js image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy only package.json and package-lock.json for dependency installation
COPY package*.json ./

# Install production dependencies
RUN npm install && npm install --save-dev husky

# Copy the rest of the application code
COPY . .

# Set environment variables from .env during runtime
# Make sure .env file is present in the same directory as the Dockerfile or mounted later
ENV PORT=4000

# Expose the port the application listens on
EXPOSE 4000

# Create a non-root user for running the app
RUN adduser -D appuser
USER appuser

# Command to run the application
CMD ["node", "index.js"]
