# Use official Python image as base
FROM python:3.11-slim

# Set the working directory
WORKDIR /app

# Install dependencies
RUN pip install nostr-relay

# Command to run the application
CMD ["nostr-relay", "serve"]
