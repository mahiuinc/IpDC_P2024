# Base image
FROM nginx:latest

WORKDIR /etc/nginx/conf.d/

COPY ./nginx.config ./

VOLUME /etc/nginx/conf.d/default.conf:ro

EXPOSE 80