FROM node:lts-slim

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build


ENV PORT=8181
EXPOSE ${PORT}

CMD ["node", "./dist/main.js"]

RUN echo '🐳 Docker build success!'