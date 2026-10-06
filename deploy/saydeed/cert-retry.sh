#!/bin/sh
# Run every 20 minutes by saydeed-cert.timer until https://saydeed.com and https://www.saydeed.com
# both have trusted certificates, then the timer switches itself off.
# Traefik asks Let's Encrypt for a certificate when the container's routes appear. If DNS did not
# point here yet, that request failed; once a name resolves to this server and still has no valid
# certificate, restarting the container makes Traefik ask again. At most 30 restarts, so a broken
# setup cannot loop forever or run into Let's Encrypt's limits.
set -u
IP=179.198.222.253
COUNT=/docker/saydeed/.cert-retries

ok=1
need=0
for name in saydeed.com www.saydeed.com; do
  if curl -sS -o /dev/null --max-time 20 "https://$name/" 2>/dev/null; then
    continue
  fi
  ok=0
  resolved=$(getent ahostsv4 "$name" | awk 'NR == 1 { print $1 }')
  [ "$resolved" = "$IP" ] && need=1
done

if [ "$ok" = 1 ]; then
  echo "saydeed: both names have trusted certificates; stopping the timer"
  systemctl disable --now saydeed-cert.timer
  exit 0
fi

if [ "$need" = 1 ]; then
  n=$(cat "$COUNT" 2>/dev/null || echo 0)
  if [ "$n" -ge 30 ]; then
    echo "saydeed: 30 restarts without a certificate; giving up (see: docker logs traefik-traefik-1)"
    systemctl disable --now saydeed-cert.timer
    exit 1
  fi
  echo $((n + 1)) > "$COUNT"
  echo "saydeed: DNS points here but HTTPS is not trusted yet; restarting to request a certificate (attempt $((n + 1)))"
  docker restart saydeed-web >/dev/null
else
  echo "saydeed: waiting for DNS to point at $IP"
fi
