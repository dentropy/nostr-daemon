FROM oven/bun:latest

WORKDIR /app

RUN apt-get update && apt-get install -y git

RUN git clone https://github.com/zapstore/ftsrelay.git .

RUN bun install
RUN bun setup.js
RUN echo "{}" > authorized.json
EXPOSE 3000

# CMD ["/bin/sh", "-c", "while true; do echo 'Container is running...'; sleep 60; done"]
CMD ["bun", "index.js"]