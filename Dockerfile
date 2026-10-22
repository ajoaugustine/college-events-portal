# The same site, in a container.
FROM nginx:alpine
# Links the published image to this repo on GitHub.
LABEL org.opencontainers.image.source="https://github.com/ajoaugustine/college-events-portal"
COPY site/ /usr/share/nginx/html/
EXPOSE 80
