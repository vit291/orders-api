FROM node:24-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install 
COPY . .
ENV PORT=3000
EXPOSE 3000
USER node
CMD ["node", "server.js"]
ARG APP_VERSION=dev
ENV APP_VERSION=$APP_VERSION