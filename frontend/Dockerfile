FROM node:20
# Uses Node.js 20 Alpine as the base image, perfect for your React frontend.

WORKDIR /app
# Sets /app as the working directory in the container. Could be /frontend, /src, or anything—/app is fine.

COPY package*.json ./
# Copies package.json and package-lock.json (if exists) from frontend/ to /app in the container.

RUN npm install
# Runs npm install in /app, installing dependencies based on package.json.

COPY . .
# Copies everything from frontend/ (src/, public/, vite.config.ts, etc.) to /app.
# In the container, you’ll have /app/src/, /app/package.json, etc.

RUN npm run build
# Runs npm run build in /app, creating the optimized build (e.g., /app/dist/).

EXPOSE 5173
# Exposes port 5173 (Vite’s default) for the container.

CMD ["npm", "run", "preview"]
# Runs npm run preview in /app, serving the built app on port 5173.