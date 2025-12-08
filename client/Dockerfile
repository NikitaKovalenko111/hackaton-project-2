FROM node:lts as dependencies
WORKDIR /client
COPY client/package*.json ./
RUN npm install

FROM node:lts as builder
WORKDIR /client
COPY . .
COPY --from=dependencies /client/node_modules ./node_modules
COPY --from=dependencies /client/package.json ./package.json
RUN npm run build

FROM node:lts as runner
WORKDIR /client
ENV NODE_ENV=production

COPY --from=builder ./client/public ./public
COPY --from=builder ./client/package.json ./package.json
COPY --from=builder ./client/.next ./.next
COPY --from=builder ./client/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "run", "start"]