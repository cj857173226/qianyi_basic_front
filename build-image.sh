#!/bin/bash

MODULE=qyiot-ui

TIME=$(date "+%Y%m%d%H%M")
GIT_REVERSION=$(git log -1 --pretty=format:"%h")
VERSION=${TIME}_${GIT_REVERSION}

IMAGE=registry.cn-chengdu.aliyuncs.com/zldy_space/${MODULE}

IMAGE_NAME=${IMAGE}:${VERSION}

docker build -t ${IMAGE_NAME} -t ${IMAGE}:latest .

docker push ${IMAGE}:latest

docker push ${IMAGE_NAME}

echo y | docker image prune