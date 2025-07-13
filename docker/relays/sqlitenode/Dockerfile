FROM node:20-alpine

WORKDIR /app

RUN apk add git
RUN apk add --no-cache \
    python3 \
    py3-pip \
    make \
    g++ \
    libc-dev \
    sqlite-dev
RUN git clone https://github.com/CodyTseng/nostr-relay-sqlite.git .
RUN npm install
RUN npm run build

CMD ["npm", "run", "start"]
