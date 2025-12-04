FROM apify/actor-node-playwright:18

COPY package.json package-lock.json ./
RUN npm ci --only=production

COPY . .

# Do NOT create user and do NOT switch user
# (Playwright works fine as root)
# USER apify   ← REMOVE THIS

# Optional but cleaner:
WORKDIR /app
