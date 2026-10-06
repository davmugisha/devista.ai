# Deploying to saydeed.com

The site runs on the Hostinger VPS (`ssh root@srv2035906.hstgr.cloud`, 179.198.222.253) as one Docker container, `saydeed-web`. The Traefik container already on the server (`/docker/traefik`) routes `saydeed.com` to it and gets the Let's Encrypt certificates. Nothing else on the server is changed.

The brand follows the domain: the image is built with `NEXT_PUBLIC_SITE_URL=https://saydeed.com`, so the logo, favicon, social images and copy say Saydeed (see `lib/brand.ts`). A build without that variable is the Devista AI site.

## Deploy or update

From the repository root, in Git Bash:

```sh
sh deploy/deploy.sh
```

It copies the working tree to `/docker/saydeed/src`, builds the image on the server, restarts the container, and enables `saydeed-cert.timer`.

The same container also answers at **https://saydeed.srv2035906.hstgr.cloud**, the server's own Hostinger address, which works whatever saydeed.com's DNS says. It sends `X-Robots-Tag: noindex` so search engines only index saydeed.com.

## DNS (Namecheap)

In Namecheap, open Domain List, then saydeed.com, then Advanced DNS. Remove the parking records (the `www` CNAME to `parkingpage.namecheap.com` and the URL redirect record for `@`), then add:

| Type     | Host  | Value             | TTL       |
| -------- | ----- | ----------------- | --------- |
| A record | `@`   | `179.198.222.253` | Automatic |
| A record | `www` | `179.198.222.253` | Automatic |

`saydeed-cert.timer` checks every 20 minutes. Once both names resolve to the server, it restarts the container so Traefik requests the certificates, then switches itself off when HTTPS is trusted. To skip the wait, run `docker restart saydeed-web` on the server after DNS has updated.

## Booking

`/book` needs the Google Calendar keys from `.env.example`. Put them in `/docker/saydeed/.env` on the server and run `docker compose up -d` in `/docker/saydeed`. Until then, the booking page says that booking is unavailable instead of accepting a request it cannot deliver.

## Email updates subscribers

The signup at the foot of every page saves addresses to `/docker/saydeed/data/subscribers.csv` on the server (columns `subscribed_at,email`), which survives redeploys. The form confirms only after the address is saved. To download the list:

```sh
scp root@srv2035906.hstgr.cloud:/docker/saydeed/data/subscribers.csv .
```

Import it into whichever email tool sends the updates, and honour unsubscribes there.

## Useful commands on the server

```sh
cd /docker/saydeed && docker compose ps        # status and health
docker logs --tail 50 saydeed-web              # site logs
docker logs --tail 50 traefik-traefik-1        # certificate errors
journalctl -u saydeed-cert --since today       # certificate timer
cd /docker/saydeed && docker compose down      # take the site offline
```
