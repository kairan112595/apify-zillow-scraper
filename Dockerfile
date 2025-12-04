FROM apify/actor-node-playwright:18

COPY package*.json ./
RUN npm ci --only=production
COPY . ./

# Create apify user with useradd (more compatible)
RUN useradd -m -s /bin/bash apify
USER apify
