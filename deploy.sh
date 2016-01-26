#!/usr/bin/env bash

docker pull kharatsa/strack
docker stop strack
docker rm strack
docker run -d \
  --name strack \
  -p $STT_LISTEN_PORT:$STT_LISTEN_PORT \
  --restart on-failure:10 \
  -v /var/lib/strack:/var/lib/strack \
  -e "STT_LISTEN_PORT=$STT_LISTEN_PORT" \
  -e "STT_LISTEN_HOST=$STT_LISTEN_HOST" \
  -e "STT_PUBLIC_URL=$STT_PUBLIC_URL" \
  -e "ODK_PROTOCOL=$ODK_PROTOCOL" \
  -e "ODK_HOSTNAME=$ODK_HOSTNAME" \
  -e "ODK_USERNAME=$ODK_USERNAME" \
  -e "ODK_PASSWORD=$ODK_PASSWORD" \
  -e "ODK_PUBLISHER_TOKEN=$ODK_PUBLISHER_TOKEN" \
  kharatsa/strack@latest
