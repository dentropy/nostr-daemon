FROM oven/bun:latest

WORKDIR /app

RUN apt-get update && apt-get install -y git

RUN git clone https://github.com/zapstore/ftsrelay.git .

RUN bun setup.js

EXPOSE 3000

CMD ["bun", "index.js"]