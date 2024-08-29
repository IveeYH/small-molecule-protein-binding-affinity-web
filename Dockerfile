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

RUN rm /etc/nginx/conf.d/default.conf

COPY small-molecule-protein-binding-affinity-web/nginx.conf /etc/nginx/conf.d

# Copy the build output from the previous stage to the nginx html directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose the port nginx is using
EXPOSE 443

ENV PORT=443

# Start nginx
CMD ["nginx", "-g", "daemon off;"]