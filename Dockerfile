FROM apify/actor-node-playwright:18

COPY package*.json ./
RUN npm ci --only=production
COPY . ./

# The apify user should already exist in the base image
USER apify
