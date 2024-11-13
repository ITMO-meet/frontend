# ============================
# Stage 1: Build the Application
# ============================
FROM node:lts-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
# Copy package.json and package-lock.json if available
COPY package.json ./

# If you have a package-lock.json, uncomment the following line
# COPY package-lock.json ./

# Install dependencies
RUN npm install --frozen-lockfile

# Copy the rest of the application source code
COPY . .

# Build the application
RUN npm run build

# ============================
# Stage 2: Serve with Nginx
# ============================
FROM nginx:stable-alpine

# Remove the default Nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
