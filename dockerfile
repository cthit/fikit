FROM node:lts-slim
WORKDIR /app 
COPY . .
RUN npm install
RUN touch data/adminKeys.json
RUN touch data/patetos.json
RUN touch data/posts.json
CMD node server.js