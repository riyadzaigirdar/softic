FROM --platform=linux/amd64 node:16.15.1-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install 
COPY . .
RUN npm run build


FROM --platform=linux/amd64 node:16.15.1-alpine as package
RUN apk update && apk add tzdata
ENV TZ=Asia/Dhaka
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY --from=build /app/dist ./dist
CMD ["npm", "run", "start:prod"]