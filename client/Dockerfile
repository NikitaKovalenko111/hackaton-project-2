FROM node:lts as dependencies
WORKDIR /client
COPY package*.json ./
RUN npm install

FROM node:lts as builder
WORKDIR /client
COPY . .
COPY --from=dependencies /client/node_modules ./node_modules
RUN npm run build

FROM node:lts as runner
WORKDIR /client
ENV NODE_ENV=production

COPY --from=builder public ./public
COPY --from=builder package.json ./package.json
COPY --from=builder .next ./.next
COPY --from=builder node_modules ./node_modules

EXPOSE 3000
CMD ["npm", "run", "start"]