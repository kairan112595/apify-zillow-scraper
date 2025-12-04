FROM apify/actor-node-playwright:18

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --only=production --silent

# Copy the rest of the application
COPY . ./

# Set proper permissions for the working directory
RUN chmod -R 755 /usr/src/app

# The container should run as the default user (usually root is fine for Apify actors)
