FROM apify/actor-node-playwright:18

# Install deps as root
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Copy code
COPY . .

# Manually create the apify user (works on all OS)
RUN echo "apify:x:1000:1000:Apify User:/home/apify:/bin/sh" >> /etc/passwd \
    && mkdir -p /home/apify \
    && chown -R 1000:1000 /home/apify

# Switch to apify user
USER apify
WORKDIR /home/apify
