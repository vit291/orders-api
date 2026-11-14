FROM node:24-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
ARG APP_VERSION=dev
ENV APP_VERSION=$APP_VERSION \
    PORT=3000
EXPOSE 3000
USER node
CMD ["node", "server.js"]
