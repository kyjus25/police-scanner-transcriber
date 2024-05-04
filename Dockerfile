FROM python:alpine3.19

RUN apk --no-cache add ca-certificates wget
RUN wget -q -O /etc/apk/keys/sgerrand.rsa.pub https://alpine-pkgs.sgerrand.com/sgerrand.rsa.pub
RUN wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.28-r0/glibc-2.28-r0.apk
RUN apk add --no-cache --force-overwrite glibc-2.28-r0.apk

COPY package.json ./
COPY helpers.ts ./
COPY index.ts ./
COPY tsconfig.json ./

RUN apk add --update npm
RUN npm i -g bun
RUN bun install

# RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
# RUN python3 -m ensurepip
RUN pip3 install --no-cache -U openai-whisper

EXPOSE 3000
ENTRYPOINT [ "bun", "run", "index.ts", "--silent" ]