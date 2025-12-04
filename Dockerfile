FROM apify/actor-node-playwright:18

COPY package*.json ./
RUN npm ci --only=production
COPY . ./

USER apify
