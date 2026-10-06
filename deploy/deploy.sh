#!/bin/sh
# Ships this working tree to the VPS and (re)starts saydeed.com behind the Traefik already there.
# Usage, from Git Bash or any POSIX shell:  sh deploy/deploy.sh [ssh-target]
# The image is built on the server, so nothing platform-specific is copied from this machine.
set -eu
TARGET=${1:-root@srv2035906.hstgr.cloud}
DIR=/docker/saydeed
cd "$(dirname "$0")/.."

echo "Copying the source to $TARGET:$DIR/src"
tar -czf - \
  --exclude=./node_modules --exclude='./.next*' --exclude=./.git --exclude=./.unlazy --exclude=./.claude \
  --exclude=./redesign --exclude='./*.tsbuildinfo' --exclude='./.env*' . |
  ssh "$TARGET" "set -e; mkdir -p $DIR; rm -rf $DIR/src.new; mkdir $DIR/src.new; tar --no-same-owner -xzf - -C $DIR/src.new; rm -rf $DIR/src; mv $DIR/src.new $DIR/src"

echo "Installing the compose file and the certificate timer"
scp -q deploy/saydeed/docker-compose.yml deploy/saydeed/cert-retry.sh "$TARGET:$DIR/"
scp -q deploy/saydeed/saydeed-cert.service deploy/saydeed/saydeed-cert.timer "$TARGET:/etc/systemd/system/"

echo "Building the image and starting the container"
ssh "$TARGET" "set -e; cd $DIR
  mkdir -p data && chown 1000:1000 data  # the image runs as the node user (uid 1000)
  docker compose build --pull
  docker compose up -d --remove-orphans
  docker image prune -f --filter label=org.opencontainers.image.title=devista-site >/dev/null
  systemctl daemon-reload
  rm -f $DIR/.cert-retries
  systemctl enable --now saydeed-cert.timer
  docker compose ps"
echo "Deployed to https://saydeed.com (preview: https://saydeed.srv2035906.hstgr.cloud)."
