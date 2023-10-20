
FROM node:12

ENV NODE_ENV development

# Create app directory
WORKDIR /usr/src/app

COPY . .

# Installing dependencies
RUN npm install

EXPOSE 4000

CMD [ "node", "server.js" ]