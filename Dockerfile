FROM node:22-slim AS server
WORKDIR /app
COPY packages/server/build ./build
EXPOSE 3001
CMD ["node", "build/main.js"]

FROM nginx AS web
COPY nginx/templates/default.conf.template /etc/nginx/templates/default.conf.template
COPY packages/client/build/ /usr/share/nginx/html/
