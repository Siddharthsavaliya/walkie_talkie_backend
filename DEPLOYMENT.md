# Walkie-Talkie Backend Deployment Guide

This guide explains how to deploy the Walkie-Talkie backend using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose (usually comes with Docker Desktop)

## Quick Start

### Option 1: Using Docker Compose (Recommended)

1. **Build and run the application:**
   ```bash
   docker-compose up --build
   ```

2. **Run in background:**
   ```bash
   docker-compose up -d --build
   ```

3. **Stop the application:**
   ```bash
   docker-compose down
   ```

### Option 2: Using Docker directly

1. **Build the Docker image:**
   ```bash
   docker build -t walkie-talkie-backend .
   ```

2. **Run the container:**
   ```bash
   docker run -p 3000:3000 --name walkie-talkie-backend walkie-talkie-backend
   ```

3. **Run in background:**
   ```bash
   docker run -d -p 3000:3000 --name walkie-talkie-backend walkie-talkie-backend
   ```

## Development Mode

To run in development mode with volume mounting for live code changes:

```bash
docker-compose --profile dev up --build
```

This will:
- Mount your local code into the container
- Run on port 3001 (to avoid conflicts)
- Enable live reloading of changes

## Environment Variables

You can customize the deployment by setting environment variables:

- `PORT`: The port the server runs on (default: 3000)
- `NODE_ENV`: Environment mode (production/development)

Example:
```bash
docker run -e PORT=8080 -e NODE_ENV=production -p 8080:8080 walkie-talkie-backend
```

## Health Check

The application includes a health check endpoint at `/api/channels`. You can verify the service is running by:

```bash
curl http://localhost:3000/api/channels
```

## Troubleshooting

### Common Issues

1. **Port already in use:**
   - Change the port mapping: `-p 3001:3000`
   - Or stop other services using port 3000

2. **Permission denied:**
   - The container runs as non-root user for security
   - All files are properly owned by the nodejs user

3. **File not found errors:**
   - Ensure all source files are in the correct directory
   - Check that `.dockerignore` isn't excluding necessary files

### Logs

View container logs:
```bash
# Docker Compose
docker-compose logs walkie-talkie-backend

# Docker
docker logs walkie-talkie-backend
```

### Container Shell Access

Access the running container:
```bash
# Docker Compose
docker-compose exec walkie-talkie-backend sh

# Docker
docker exec -it walkie-talkie-backend sh
```

## Production Deployment

For production deployment, consider:

1. **Using a reverse proxy** (nginx, traefik)
2. **Setting up SSL/TLS certificates**
3. **Configuring proper logging**
4. **Setting up monitoring and alerting**
5. **Using environment-specific configuration**

## API Endpoints

Once deployed, the following endpoints will be available:

- `GET /` - Web interface
- `GET /api/channels` - List available channels
- `GET /api/channels/:channelId` - Get specific channel info
- WebSocket connections for real-time communication

The server will be accessible at `http://localhost:3000` (or your configured port).
