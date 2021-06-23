FROM node:lts-alpine
RUN npm install cnpm -g --registry=https://r.npm.taobao.org
COPY ./ /app
WORKDIR /app
RUN cnpm install && npm run build

FROM nginx
RUN mkdir /app
COPY --from=0 /app/dist /app
RUN rm /etc/nginx/conf.d/default.conf
ADD nginx.conf /etc/nginx/conf.d/
RUN /bin/bash -c 'echo init ok'
