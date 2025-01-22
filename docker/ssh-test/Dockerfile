# Use Ubuntu as the base image
FROM ubuntu:22.04

# Set environment variables to prevent interactive prompts
ENV DEBIAN_FRONTEND=noninteractive

# Update and install OpenSSH server
RUN apt-get update && \
    apt-get install -y curl && \
    apt-get install -y openssh-server && \
    apt-get install -y rsync

# https://serverfault.com/questions/721026/docker-container-sshopen-not-staying-up
RUN mkdir /var/run/sshd

RUN curl -fsSL https://getcaddy.com | bash

RUN apt-get clean && \
    rm -rf /var/lib/apt/lists/*
# Create the SSH directory and set permissions
RUN mkdir -p /root/.ssh && chmod 700 /root/.ssh

# Add your public key to the authorized_keys file
COPY id_rsa.pub /root/.ssh/authorized_keys

# Set the correct permissions for the authorized_keys file
RUN chmod 600 /root/.ssh/authorized_keys

# Configure the SSH server to allow root login using keys
RUN sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config && \
    sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config

# Set up a directory for Caddy to serve static files
RUN mkdir -p /var/www/html && echo "Welcome to Your Caddy Server!" > /var/www/html/index.html

# Copy the Caddyfile configuration
COPY Caddyfile /etc/caddy/Caddyfile

# Expose the SSH port
EXPOSE 22
EXPOSE 80
EXPOSE 443

# Start the SSH service
CMD ["/usr/sbin/sshd", "-D"]
