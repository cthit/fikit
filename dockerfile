FROM node:lts-slim
WORKDIR /app 
COPY . .
RUN npm install
RUN touch adminKeys.json
RUN touch patetos.json
RUN touch posts.json
CMD node server.js