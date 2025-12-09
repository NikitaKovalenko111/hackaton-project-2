FROM node:18-alpine

RUN apk add --no-cache bash netcat-openbsd curl

WORKDIR /server

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3001

COPY wait-for-db.sh /server/wait-for-db.sh

RUN chmod +x /server/wait-for-db.sh

CMD ["/bin/bash", "/server/wait-for-db.sh"]