#!/usr/bin/env bash

set -euo pipefail

IMAGE_NAME="dc-landing-page"
CONTAINER_NAME="dc-landing"
PORT="${PORT:-3000}"

echo "Building Docker image: ${IMAGE_NAME}..."
docker build -t "${IMAGE_NAME}" .

if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
  echo "Stopping existing container: ${CONTAINER_NAME}..."
  docker stop "${CONTAINER_NAME}" >/dev/null 2>&1 || true
  echo "Removing existing container: ${CONTAINER_NAME}..."
  docker rm "${CONTAINER_NAME}" >/dev/null 2>&1 || true
fi

echo "Starting new container: ${CONTAINER_NAME} on port ${PORT}..."
docker run -d \
  --name "${CONTAINER_NAME}" \
  -p "${PORT}:3000" \
  --restart unless-stopped \
  "${IMAGE_NAME}"

echo "Deploy completed. App is running on port ${PORT}."

