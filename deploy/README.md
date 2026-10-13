# Deploying to saydeed.com

The site runs on the Hostinger VPS (`ssh root@srv2035906.hstgr.cloud`, 179.198.222.253) as one Docker container, `saydeed-web`. The Traefik container already on the server (`/docker/traefik`) routes `saydeed.com` to it and gets the Let's Encrypt certificates. Nothing else on the server is changed.

The image is built with `NEXT_PUBLIC_SITE_URL=https://saydeed.com`, which sets the canonical links, the sitemap and the social image addresses. The logo, favicon, social images and copy are Saydeed's (see `lib/brand.ts`). The setting defaults to `https://saydeed.com`, so local development and previews work without it.

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

`/book` lets a visitor pick a free slot on your Google Calendar. The site creates the event on your calendar with a Google Meet link, and Google emails the invite to both of you. Until the keys below are set, a production build says that booking is unavailable instead of accepting a request it cannot deliver. In `npm run dev` without keys, a built-in mock calendar is used so the page can be worked on.

Connecting your calendar is a one-time, ten-minute job:

1. Open [console.cloud.google.com](https://console.cloud.google.com) with the Google account whose calendar should receive bookings. Create a project (any name, for example "Saydeed booking").
2. **APIs & Services → Library**: search "Google Calendar API" and click **Enable**.
3. **APIs & Services → OAuth consent screen** (Google now calls this "Google Auth Platform"): choose **External**, fill in the app name and your email, and save. Under **Audience**, click **Publish app** so the app is "In production". Leave it in "Testing" and Google expires the token after 7 days, which would silently stop bookings. Google will show an "unverified app" warning when you sign in during step 5; that is expected, because only you ever sign in to it.
4. **APIs & Services → Credentials → Create credentials → OAuth client ID**, type **Desktop app**. Copy the client ID and client secret into `.env.local` in the repository (copy `.env.example` first).
5. In the repository run:

   ```sh
   npm run booking:auth -- --write
   ```

   It opens Google sign-in. Sign in with that same account, allow the two calendar permissions, and the refresh token is written to `.env.local`. The terminal also prints the four `GOOGLE_*` lines.
6. Put those four lines in `/docker/saydeed/.env` on the server, then:

   ```sh
   cd /docker/saydeed && docker compose up -d
   ```

Then set when you take calls in `lib/booking-config.ts`: `hostTimezone` (an IANA name such as `Europe/Berlin`), `workingDays` and `workingHours`. Anything already on the calendar is kept free with a buffer either side, and visitors see times in their own time zone. Test it once on the live site: book a slot with another email address, check that the event is on your calendar with a Meet link, and that the invite arrived.

### Which address bookings come from and go to

The site's one public address is `CONTACT.email` in `lib/site.ts` (david@saydeed.com). Every booking invites it as a guest, so each booking reaches that inbox as well as the host calendar, and the visitor sees it on the invite.

Google sends the invite from the account you signed in with in step 5. To make invites come from david@saydeed.com itself, create a Google account that uses that address (Google lets you sign up with an existing email: choose "Use my existing email" at sign up), then repeat steps 1 to 6 signed in as it. saydeed.com's mail is hosted at Namecheap Private Email, not Google, and that is fine: the address only needs to receive Google's verification email once. Also check that saydeed.com has SPF and DKIM records for the mail host and a DMARC record (Namecheap shows them under Private Email), so mail to and from the address is not filed as spam.

To revoke access later, remove the app at [myaccount.google.com/permissions](https://myaccount.google.com/permissions) and delete the keys from the server.

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
