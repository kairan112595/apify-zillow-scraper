FROM apify/actor-node-playwright:18

COPY package*.json ./
RUN npm ci --only=production
COPY . ./

# Create apify user and switch to it
RUN adduser --disabled-password --gecos '' apify
USER apify
