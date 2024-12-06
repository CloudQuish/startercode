# Use a lightweight Node.js image for building
FROM node:alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install && npm install --save-dev husky
COPY . .
RUN npm run build

# Use a lightweight Nginx image to serve the frontend
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
