
FROM node:12

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

# RUN npm install
# If you are building your code for production
RUN npm install --only=production

COPY . .

EXPOSE 4000
CMD [ "node", "server.js" ]