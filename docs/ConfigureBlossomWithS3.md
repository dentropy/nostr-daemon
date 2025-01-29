

#### Install AWS CLI

Ask ChatGPT or just read [Installing or updating to the latest version of the AWS CLI - AWS Command Line Interface](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)


#### Setup Files

``` bash
cd nostr-daemon/docker/blossom-server
cp .env.example .env
cp .example.config.yml config.yml

```

* Please generate and change passwords in both the .env and config.yml, they should be the same
  * For the config.yml search for accessKey and acsecretKey

#### Run just minio (We need to create the buckets)

``` bash

cd nostr-daemon/docker/blossom-server
docker compose up -d minio

```
#### Test Minio


``` bash

# CHANGE THIS TO YOUR ACCESS_ID
export AWS_ACCESS_KEY_ID=testaccesskey
# CHANGE THIS TO YOUR ACCESS_KEY
export AWS_SECRET_ACCESS_KEY=testaccesskey
export AWS_DEFAULT_REGION=us-east-1
export AWS_ENDPOINT_URL="http://localhost:9000"
export AWS_S3_ENDPOINT=http://localhost:9000
export AWS_S3_SIGNATURE_VERSION=s3v4

aws s3 ls

aws s3 mb s3://blossom

```

#### Now start blossom, or restart everything

``` bash

cd nostr-daemon/docker/blossom-server
docker compose up -d blossom

```