FROM node:18
LABEL authors="pondpiu"
WORKDIR /app

COPY package.json .
COPY yarn.lock .

COPY packages/client ./packages/client
COPY packages/server ./packages/server

RUN yarn install --pure-lockfile --non-interactive

copy . ./

EXPOSE 3000 4000

CMD yarn start