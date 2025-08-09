# Base image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the app
COPY . .

# Expose the port
EXPOSE 5000

# Run the app
CMD ["node", "src/index.js"]
