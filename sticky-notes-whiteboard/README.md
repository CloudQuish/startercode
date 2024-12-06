# Sticky Notes Whiteboard Application

## Overview

This project is a full-stack web application that allows users to create, view, and manage sticky notes on a virtual whiteboard. It includes:

- A **frontend** built with React.
- A **backend** built with Node.js and Express.
- **NGINX** for serving the frontend and routing API requests to the backend.
- **SSL** setup using Let's Encrypt for secure connections.
- Dockerized deployment for consistent environment management.

---

## Project Structure

```plaintext
sticky-notes-whiteboard/
├── backend/
│   ├── Dockerfile
│   ├── index.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── Dockerfile
│   ├── src/
│   ├── public/
│   └── package.json
├── nginx.conf
├── docker-compose.yml
└── README.md

```
## Prerequisites

- Docker and Docker Compose installed on your local machine.
- A domain name (for production with SSL).
- (Optional) Certbot for generating SSL certificates.


## Setup Instructions

### Local Development

#### Clone the repository:
```bash
git clone https://github.com/your-username/sticky-notes-whiteboard.git
cd sticky-notes-whiteboard
```
#### Set up environment variables:
1. Create a `.env` file inside the `backend/` directory with the following content:

   ```plaintext
   PORT=4000
   POSTGRES_DATABASE_URL=your_database_url
   JWT_SECRET=your_jwt_secret
   ```

#### Start the application:
1. Run the following command to build and start the application:

   ```bash
   docker compose up --build
   ```

#### Access the application:
- **Frontend:** [http://localhost:3000](http://localhost:3000)  
- **Backend API:** [http://localhost:4000/api](http://localhost:4000)

## Production Deployment

1. Replace the domain placeholder (`your-domain.com`) in `nginx.conf` with your      actual domain.
2. Generate SSL certificates using Let's Encrypt:
   ```bash
   sudo certbot certonly --standalone -d your-domain.com
   ```
3. Run the following command to build and start the application:

   ```bash
   docker compose up --build
   ```
   
## CI/CD Pipeline Details

This project includes a GitHub Actions workflow for CI/CD. The pipeline:

- Runs tests for both frontend and backend.
- Builds Docker images for frontend and backend.
- Deploys updated services using Docker Compose.

### Workflow File (`.github/workflows/ci-cd-pipeline.yml`)

```bash
name: CI/CD Pipeline

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
    #Step 1: Check out the code
    - name: Checkout Code
      uses: actions/checkout@v3

    # Step 2: Set up Node.js for the project
    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '22'

    # Step 3: Cache Node.js modules for faster builds
    - name: Cache Node.js modules
      uses: actions/cache@v3
      with:
        path: |
          ~/.npm
          frontend/node_modules
          backend/node_modules
        key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
        restore-keys: |
          ${{ runner.os }}-node-

    # Step 4: Install dependencies and run tests
    - name: Install dependencies and run tests
      run: |
        cd frontend && npm install && npm run test
        cd ../backend && npm install && npm run test

    # Step 5: Build the frontend and backend
    - name: Build Frontend and Backend
      run: |
        cd frontend && npm run build
        cd ../backend && npm run build

    # Step 6: Run security checks
    - name: Run Security Checks
      run: |
        cd frontend && npm audit --audit-level=moderate
        cd ../backend && npm audit --audit-level=moderate

    # Step 7: Deploy to server
    - name: Deploy to Server
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.SERVER_IP }}
        username: ${{ secrets.SERVER_USER }}
        key: ${{ secrets.SERVER_SSH_KEY }}
        script: |
          cd /
          export PORT=${{ secrets.PORT }}
          export POSTGRES_DATABASE_URL=${{ secrets.POSTGRES_DATABASE_URL }}
          export JWT_SECRET=${{ secrets.JWT_SECRET }}
          docker compose down
          docker compose up -d --build

```

## Backend API Endpoints

| Method | Endpoint              | Description               |
|--------|------------------------|---------------------------|
| POST   | /api/user/login        | Logs in a user            |
| POST   | /api/flows             | Creates a sticky note     |
| GET    | /api/flows             | Fetches all sticky notes  |
| DELETE | /api/flows/:id         | Deletes a sticky note     |

## DevOps Practices

- **Docker**: Used to containerize the application for consistent deployment.
- **NGINX**: Configured to handle routing and SSL.
- **GitHub Actions**: Automates testing and deployment.
- **Secrets Management**: Securely stores sensitive data using GitHub Secrets.

## Challenges and Solutions

- **SSL Setup**: Configured with Let's Encrypt to secure the app.
- **Environment Consistency**: Docker ensures a consistent runtime across environments.
- **Routing Issues**: Resolved with a custom NGINX configuration.
