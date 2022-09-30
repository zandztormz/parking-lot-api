FROM node:14

WORKDIR /parking-lot-api
COPY package.json .
RUN npm install
COPY . .
CMD npm start
