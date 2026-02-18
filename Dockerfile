# Stage 1: Build the server
FROM node:22-slim AS server-build
WORKDIR /app
COPY server/package.json server/tsconfig.json ./server/
COPY server/src ./server/src
COPY abi ./abi
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn
RUN corepack enable && yarn workspaces focus @subsquid/server && yarn workspace @subsquid/server build

# Stage 2: Server runtime
FROM node:22-slim AS server
WORKDIR /app
COPY --from=server-build /app/server/dist ./dist
COPY --from=server-build /app/server/node_modules ./node_modules
COPY --from=server-build /app/abi ./abi
COPY server/package.json ./
EXPOSE 3001
CMD ["node", "dist/main.js"]

# Stage 3: Static frontend served by nginx
FROM nginx AS web
COPY nginx/templates/default.conf.template /etc/nginx/templates/default.conf.template
COPY build/ /usr/share/nginx/html/
