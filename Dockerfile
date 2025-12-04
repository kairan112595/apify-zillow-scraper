FROM apify/actor-node-playwright:18

# Install deps as root
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Copy code
COPY . .

# Create apify user (safe for all Debian/Ubuntu-based images)
RUN adduser --disabled-password --gecos "" apify

# Switch to the apify user
USER apify

WORKDIR /home/apify
