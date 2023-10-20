
FROM node:16

ENV NODE_ENV production

# Create app directory
WORKDIR /usr/src/app

COPY . .

# Installing dependencies
RUN npm install

EXPOSE 4000

CMD [ "node", "app.js" ]