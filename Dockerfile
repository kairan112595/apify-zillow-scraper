# Use Node.js with Playwright support
FROM mcr.microsoft.com/playwright:v1.40.0-focal

# Set working directory
WORKDIR /app

# Install system dependencies for running browsers
RUN apt-get update && apt-get install -y \
    xvfb \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install Node.js dependencies as root first
RUN npm install

# Install Playwright browsers
RUN npx playwright install firefox

# Copy application source
COPY . .

# Create a non-root user with proper home directory
RUN groupadd -r appuser && useradd -r -g appuser -m -d /home/appuser appuser

# Change ownership of the app directory and home directory
RUN chown -R appuser:appuser /app /home/appuser

# Switch to non-root user
USER appuser

# Expose port (if needed for debugging)
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

# Default command
CMD ["npm", "start"]
