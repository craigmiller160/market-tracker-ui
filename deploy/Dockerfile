FROM nexus-docker.craigmiller160.us/nginx-base:1.1.3

COPY build/market-tracker-ui-*.tgz /var/www/market-tracker-ui.tgz
RUN tar xvf /var/www/market-tracker-ui.tgz -C /var/www/
RUN cp -R /var/www/package/build/* /var/www/
RUN rm -rf /var/www/package
RUN rm /var/www/market-tracker-ui.tgz
RUN cp /var/www/nginx.conf /etc/nginx/nginx.conf

ENTRYPOINT ["nginx","-g","daemon off;"]
