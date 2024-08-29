# Stage 1: Build the React app
FROM node:18 AS build

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY small-molecule-protein-binding-affinity-web/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY ./small-molecule-protein-binding-affinity-web .

# Build the React app
RUN npm run build

# Stage 2: Serve the React app with nginx
FROM nginx:stable-alpine

WORKDIR /etc/nginx/templates/
COPY --from=build /app/build /usr/share/nginx/html

COPY nginx.conf.template /etc/nginx/templates/nginx.conf.template
COPY start-nginx.sh /start-nginx.sh
RUN chmod +x /start-nginx.sh

# Expose the port as required by Cloud Run
EXPOSE 8080

# Run Nginx using the template configuration
CMD ["/start-nginx.sh"]