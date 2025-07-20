# Use the official Deno image as the base
FROM denoland/deno:ubuntu-2.3.6

# Set working directory
WORKDIR /app

# Copy dependency file (if using deno.json or deno.jsonc)
COPY deno.* ./

# Cache dependencies to speed up builds
RUN deno cache deno.* || true

# Copy the rest of the application code
COPY filters .
COPY lib .
COPY cli.js .

# Expose port (optional, adjust based on your app's needs)
EXPOSE 3000

# Command to run the application (adjust main.ts to your entry file)
CMD ["deno", "-A", "cli.js"]
