FROM node:8-stretch

EXPOSE 80

ENV PORT 80
ENV NODE_ENV production
ENV DEBUG dat-registry

ENV DATA_DIR /data
VOLUME /data

ENV MIXPANEL_ENABLE false
# ENV MIXPANEL_KEY "not a key"

ENV TOWNSHIP_SECRET "some secret string here"
ENV TOWNSHIP_DB township.db
ENV TOWNSHIP_PUB_KEY "openssl public key (ES512)"
ENV TOWNSHIP_PRV_KEY "openssl private key (ES512)"
ENV TOWNSHIP_DSA_JWA ES512

ENV SMTP_ENABLE false
ENV SMTP_HOST smtp.postmarkapp.com
ENV SMTP_PORT 2525
ENV SMTP_USERNAME username
ENV SMTP_PASSWORD password

ENV DB_DIALECT sqlite3
ENV DB_FILE dat-production.db

ENV WHITELIST_ENABLE false
ENV WHITELIST_FILE whitelist.txt
ENV WHITELIST undefined

RUN apt-get update && apt-get install --yes \
  git \
  openssl \
  build-essential \
  libtool

RUN mkdir -p /app
WORKDIR /app
COPY package.json /app/
RUN npm install --production --loglevel warn
COPY . /app
RUN npm run build-js-prod && \
  npm run build-css && \
  npm run minify && \
  npm run version && \
  npm run database

CMD [ "npm", "run", "server" ]
