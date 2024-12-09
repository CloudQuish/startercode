# Use a lightweight Node.js image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the rest of the application code
COPY . .

# Install production dependencies
RUN npm install && npm install --save-dev husky

# Set environment variables from .env during runtime
ENV PORT=4000

# Expose the port the application listens on
EXPOSE 4000

# Create a non-root user for running the app
RUN adduser -D appuser && chown -R appuser /app
USER appuser

# Command to run the application
CMD [ "npm","start" ]