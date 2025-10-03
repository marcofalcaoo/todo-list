FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY ./frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY ./frontend .

# Expose port
EXPOSE 4200

# Start Angular development server
CMD ["npm", "start", "--", "--host", "0.0.0.0", "--poll", "2000"]
