FROM ubuntu:18.04


# install nodejs
RUN apt-get -qq update
RUN apt-get -qq upgrade --yes 
RUN apt-get -qq install curl --yes
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get -qq install nodejs --yes


WORKDIR /app

COPY ./ ./

EXPOSE 8081

RUN npm install


#  docker build -t node-rtsp-stream:0.1 .
#  docker run -it -p 8081:8081 -p 9000-9004:9000-9004 node-rtsp-stream:0.1 /bin/sh

# xz -d ffmpeg-5.1.2.tar.xz
# tar xvf ffmpeg-5.1.2.tar

# apt-get install ffmpeg 