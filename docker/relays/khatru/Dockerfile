FROM golang:1.24-alpine

WORKDIR /app
RUN apk add --no-cache gcc g++
RUN go mod init example.com/m/v2
RUN go get github.com/fiatjaf/khatru
RUN go get github.com/mattn/go-sqlite3
RUN go get github.com/fiatjaf/eventstore/sqlite3
COPY main.go main.go
RUN go build -o main

EXPOSE 3334

CMD ["./main"]
