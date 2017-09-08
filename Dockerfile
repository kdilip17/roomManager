FROM harbor.liad.in:5000/alpinenode:latest

MAINTAINER Dilip Kumar <dilipkumar@hakunamatata.in>
 


COPY . /usr/src/app/
RUN cd /usr/src/app
RUN npm install
WORKDIR /usr/src/app


EXPOSE 9003

#CMD ["node", "RESTLauncher.js"]

