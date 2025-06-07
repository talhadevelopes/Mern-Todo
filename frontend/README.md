# Docker Guide for MERN To-Do App

[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)

This guide is a concise reference for Docker commands, Dockerfile, and docker-compose.yml used in the MERN to-do app (mern-todo-frontend, mern-todo-backend). It covers essential workflows, best practices, and troubleshooting for development, deployment, and interviews. Focus is on commands with brief explanations.

## 📋 Table of Contents

- [🐳 Docker Overview](#-docker-overview)
- [⚡ Docker Commands](#-docker-commands)
- [📝 Dockerfile Examples](#-dockerfile-examples)
- [🔧 Docker Compose Commands](#-docker-compose-commands)
- [🔄 Workflow for Code Changes](#-workflow-for-code-changes)
- [✨ Best Practices](#-best-practices)
- [🚀 Future Commands](#-future-commands)
- [🌐 Environment Files](#-environment-files)
- [🛠️ Troubleshooting](#️-troubleshooting)

## 🐳 Docker Overview

**Purpose:** Docker containerizes apps (mern-todo-frontend, mern-todo-backend) with dependencies for efficient development, packaging, shipping, and deployment.

**Components:**
- **Dockerfile:** Instructions for building images
- **Image:** Built application package
- **Container:** Running instance of an image
- **Registry:** Storage for images (e.g., Docker Hub)

**Flow:** `Dockerfile → Image → Container(s)`

**Key Benefits:**
- **Containers:** Isolated environments packaging apps with dependencies, easily shared
- **Docker vs. VMs:** Lightweight, fast, low disk usage, encapsulates apps not machines
- **Architecture:** Runs on hardware, OS, and Docker Engine
- **Registry:** Central repo for images (e.g., `talhadevelopes/mern-todo-frontend`)

## ⚡ Docker Commands

### 🏗️ Building Images

| Command | Description |
|---------|-------------|
| `docker build -t talhadevelopes/mern-todo-frontend:06 .` | Builds frontend image from Dockerfile, tags as :06 |
| `docker build -t talhadevelopes/mern-todo-backend:06 .` | Builds backend image, tags as :06 |

### 📦 Managing Images

| Command | Description |
|---------|-------------|
| `docker images` | Lists images (e.g., talhadevelopes/mern-todo-frontend:06) |
| `docker rmi talhadevelopes/mern-todo-frontend:06` | Deletes an image |
| `docker tag mern-todo-frontend:06 talhadevelopes/mern-todo-frontend:06` | Renames/tags image for Docker Hub |
| `docker image prune -f` | Removes unused images |

### 🏃 Running Containers

| Command | Description |
|---------|-------------|
| `docker run -d --rm --name mern-todo-frontend -p 5173:5173 --env-file .env talhadevelopes/mern-todo-frontend:06` | Runs frontend container, maps port 5173, loads .env, auto-removes |
| `docker run -d --rm --name mern-todo-backend -p 3006:3006 --env-file .env talhadevelopes/mern-todo-backend:06` | Runs backend container, maps port 3006 |
| `docker run -it talhadevelopes/mern-todo-frontend:06` | Runs container interactively for debugging |

### 🎛️ Managing Containers

| Command | Description |
|---------|-------------|
| `docker ps` | Lists running containers |
| `docker ps -a` | Lists all containers (running/stopped) |
| `docker stop mern-todo-frontend` | Stops a container |
| `docker rm mern-todo-frontend` | Deletes a stopped container |
| `docker logs mern-todo-frontend` | Views container logs |
| `docker restart mern-todo-frontend` | Restarts a container |

### 🌐 Sharing Images (Docker Hub)

| Command | Description |
|---------|-------------|
| `docker login` | Logs into Docker Hub |
| `docker push talhadevelopes/mern-todo-frontend:06` | Pushes image to Docker Hub |
| `docker pull talhadevelopes/mern-todo-frontend:06` | Pulls image from Docker Hub |

### 💾 Volumes and Bind Mounts

| Command | Description |
|---------|-------------|
| `docker run -d --rm -v myvolume:/app mern-todo-frontend:06` | Mounts named volume myvolume to /app |
| `docker run -d --rm -v C:\Users\Talha Ahmed\Desktop\Projects\Mern-Todo\frontend:/app mern-todo-frontend:06` | Bind mounts local directory to /app |
| `docker volume ls` | Lists volumes |
| `docker volume inspect myvolume` | Shows volume details |
| `docker volume prune -f` | Removes unused volumes |

### 🧹 Cleanup

| Command | Description |
|---------|-------------|
| `docker system prune -af` | Removes all unused containers, images, networks (use cautiously) |
| `docker container prune -f` | Removes stopped containers |
| `docker image prune -f` | Removes unused images |

## 📝 Dockerfile Examples

### Frontend (frontend/Dockerfile)

```dockerfile
FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]
```

**Explanation:**
- Uses node:20, sets /app, installs dependencies, builds Vite app, serves on port 5173

### Backend (backend/Dockerfile)

```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3006
CMD ["npm", "start"]
```

**Explanation:**
- Uses node:18, sets /app, installs dependencies, builds TypeScript, serves Express on port 3006

### .dockerignore

```dockerignore
node_modules/
dist/
.git/
.env/
```

**Purpose:**
- Excludes unnecessary files from image builds to reduce size

### 🏆 Dockerfile Best Practices

1. **Use specific base image tags** (e.g., `node:18`)
2. **Minimize layers** (combine COPY, RUN)
3. **Add .dockerignore** to exclude node_modules, .env

**For production, use multi-stage builds:**

```dockerfile
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-slim
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm install --only=production
EXPOSE 3006
CMD ["npm", "start"]
```

## 🔧 Docker Compose Commands

### 🚀 Running and Managing

| Command | Description |
|---------|-------------|
| `docker-compose up -d` | Starts containers in detached mode |
| `docker-compose up --build -d` | Rebuilds images and starts containers |
| `docker-compose down` | Stops and removes containers, networks |
| `docker-compose down -v` | Also removes volumes |
| `docker-compose logs frontend` | Views logs for frontend service |
| `docker-compose ps` | Lists running services |
| `docker-compose stop` | Stops services without removing |
| `docker-compose restart` | Restarts services |
| `docker-compose config` | Validates docker-compose.yml |

### Docker Compose File Example

```yaml
version: '3.8'
services:
  frontend:
    image: talhadevelopes/mern-todo-frontend:06
    container_name: mern-todo-frontend
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "5173:5173"
    env_file:
      - ./frontend/.env
    depends_on:
      backend:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5173"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s
    restart: unless-stopped
    networks:
      - mern-network
    volumes:
      - frontend-secrets:/app/secrets

  backend:
    image: talhadevelopes/mern-todo-backend:06
    container_name: mern-todo-backend
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3006:3006"
    env_file:
      - ./backend/.env
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3006"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s
    restart: unless-stopped
    networks:
      - mern-network
    volumes:
      - backend-secrets:/app/secrets

volumes:
  frontend-secrets:
  backend-secrets:

networks:
  mern-network:
    driver: bridge
```

**Key Features:**
- Defines frontend and backend services
- Uses build for dev, tags images :06
- Maps ports, loads .env, sets health checks
- Ensures backend is healthy before frontend starts
- Auto-restarts containers unless stopped
- Uses secrets volumes for production
- Connects via mern-network

### 🎯 Docker Compose Best Practices

1. **Use `version: '3.8'`** for compatibility
2. **Set `container_name`** for clarity
3. **Use `env_file`** for .env variables
4. **Add `healthcheck`** for reliability
5. **Use `depends_on` with `condition: service_healthy`**
6. **Define custom network** or use default
7. **Add `restart: unless-stopped`** for production

**Use secrets volumes for sensitive data:**
```yaml
volumes:
  - backend-secrets:/app/secrets
```

**For live reloading (dev):**
```yaml
frontend:
  volumes:
    - ./frontend:/app
    - /app/node_modules
  command: npm run dev
```

## 🔄 Workflow for Code Changes

### Step-by-Step Process

1. **Edit Code:** Update `frontend/src` or `backend/src`

2. **Update docker-compose.yml:** Increment image tags (e.g., `:06` to `:07`)

3. **Build and Run:**
   ```bash
   cd C:\Users\Talha Ahmed\Desktop\Projects\Mern-Todo
   docker-compose up --build -d
   ```

4. **Test:** Open http://localhost:5173, check logs:
   ```bash
   docker-compose logs frontend
   ```

5. **Push to Docker Hub (optional):**
   ```bash
   docker push talhadevelopes/mern-todo-frontend:07
   docker push talhadevelopes/mern-todo-backend:07
   ```

6. **Stop:**
   ```bash
   docker-compose down
   ```

## ✨ Best Practices

### 🖼️ Images
- Use specific tags (`node:18`)
- Version images (`:06`, `:07`)
- Clean unused images: `docker image prune -f`

### 📦 Containers
- Use `--rm` for auto-cleanup
- Name containers (`--name mern-todo-frontend`)
- Run detached (`-d`)

### 🔧 Compose
- Place `docker-compose.yml` in root
- Use `build` for dev, `image` for prod
- Add health checks, networks, restart policies

### 🔒 Security
- Exclude sensitive files in `.dockerignore`
- Use secrets volumes for production

### ⚡ Optimization
- Use multi-stage builds
- Use `node:18-slim` or `node:18-alpine`
- Add `.dockerignore`

## 🚀 Future Commands

| Command | Description |
|---------|-------------|
| `docker network ls` | Lists networks (e.g., mern-network) |
| `docker network create my-network` | Creates a custom network |
| `docker network inspect mern-network` | Shows network details |
| `docker run --network mern-network` | Runs container on specific network |
| `docker exec -it mern-todo-frontend bash` | Opens shell in running container |
| `docker inspect mern-todo-frontend` | Shows container details |

## 🌐 Environment Files

### Frontend (frontend/.env)
```env
VITE_API_URL=http://backend:3006
```

### Backend (backend/.env)
```env
MONGO_URI=mongodb+srv://...
PORT=3006
JWT_SECRET=...
```

## 🛠️ Troubleshooting

### 🚨 Common Issues & Solutions

#### Port Conflict
```bash
netstat -aon | findstr :5173
taskkill /F /PID <pid>
```

#### Health Check Fails
- Check logs: `docker-compose logs`
- Try: `test: ["CMD", "nc", "-z", "localhost", "5173"]`

#### Image Pull Fails
- Check tag: `docker pull talhadevelopes/mern-todo-frontend:06`
- Ensure `docker login`

#### Container Exits
- Check logs: `docker logs mern-todo-frontend`
- Verify `CMD` in Dockerfile

## 🎯 Interview Tips

**Key Points to Emphasize:**
- Explain flow: `Dockerfile → Image → Container`
- Emphasize `.dockerignore` importance
- Highlight health checks implementation
- Demonstrate multi-stage builds knowledge
- Show understanding of Docker vs VM differences

## 📚 Additional Resources

- [Docker Official Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Docker Hub](https://hub.docker.com/)
- [Node.js Docker Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)

## 🤝 Contributing

Feel free to contribute to this guide by submitting pull requests or reporting issues.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Happy Dockerizing! 🐳**