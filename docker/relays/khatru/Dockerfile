FROM golang:1.24-alpine

WORKDIR /app

COPY main.go main.go
RUN go mod init example.com/m/v2
RUN go get github.com/fiatjaf/khatru
RUN go get github.com/fiatjaf/eventstore/sqlite3
RUN go build

EXPOSE 3334

CMD ["/app/main"]
