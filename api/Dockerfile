# Use Node.js slim image as the base image
FROM node:slim

# Copy dependency files first (better for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy everything else
COPY . .


# Tell Docker we want to expose port 3000
EXPOSE 3001

# Run the app (Next.js production mode)
CMD ["node", "index.mjs"]