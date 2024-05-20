FROM node:lts-slim
WORKDIR /app 
COPY . .
RUN npm install
CMD node server.js