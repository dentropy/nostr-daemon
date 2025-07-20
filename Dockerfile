# Use the official Deno image as the base
FROM denoland/deno:ubuntu-2.3.6

# Set working directory
WORKDIR /app

# Install Node.js (for node-gyp) and Python
RUN apt-get update && apt-get install -y \
    curl \
    python3 \
    python3-pip \
    python3-dev \
    build-essential \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g node-gyp \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Verify installations
RUN deno --version && node --version && npm --version && python3 --version && node-gyp --version


# Copy dependency file (if using deno.json or deno.jsonc)
COPY deno.* ./

# Cache dependencies to speed up builds
RUN deno cache deno.* || true

RUN deno install --allow-scripts=npm:bufferutil@4.0.8,npm:utf-8-validate@5.0.10,npm:es5-ext@0.10.64

# Copy the rest of the application code
COPY filters /app/lib
COPY lib /app/lib
COPY apps /app/apps
COPY cli.js .

# Expose port (optional, adjust based on your app's needs)
EXPOSE 3000

# Command to run the application (adjust main.ts to your entry file)
CMD ["deno", "run", "-A", "./cli.js"]
