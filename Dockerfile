# The same site, in a container. Not used by GitHub Pages: local demo only.
FROM nginx:alpine
COPY site/ /usr/share/nginx/html/
EXPOSE 80
