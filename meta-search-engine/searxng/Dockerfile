# Use the official SearXNG image as the base
FROM searxng/searxng:latest

# Set environment variables
ENV BASE_URL=http://localhost:8080
ENV INSTANCE_NAME=just-ask

# Expose the port SearXNG will run on
EXPOSE 8080

# Copy the SearXNG configuration directory
VOLUME ["./config:/etc/searxng"]

# Start SearXNG
CMD ["/usr/local/bin/docker-entrypoint.sh"]