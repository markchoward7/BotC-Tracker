FROM node:22.5.1

WORKDIR /app

COPY package.json package-lock.json webpack.config.mjs tsconfig.json ./

RUN npm ci

COPY public ./public

COPY src ./src

EXPOSE 3000

CMD ["npm", "run", "start"]
