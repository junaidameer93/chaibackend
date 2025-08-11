# Use a lightweight Node.js image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Install dependencies only when needed
COPY package*.json ./

RUN npm install --omit=dev

# Copy the rest of the application
COPY . .

# Expose the port
EXPOSE 5000

# Start the app
CMD ["npm", "start"]
