#!/bin/sh

# Substitute the environment variable into the template and output to nginx.conf
envsubst '$PORT' < /etc/nginx/templates/nginx.conf.template > /etc/nginx/conf.d/default.conf

# Start Nginx
nginx -g 'daemon off;'