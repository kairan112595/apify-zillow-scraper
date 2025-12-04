FROM apify/actor-node-playwright:18

# Install deps as root
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Switch to pre-existing Apify user
USER apify

# Important: working directory for apify user
WORKDIR /home/apify
