# START HERE  (no coding knowledge needed)

This folder is the complete **Shyam Timber and Plywoods** app.
Pick ONE of the two paths below.

---------------------------------------------------------------------
## PATH A — See it on your own phone today (free, 15 min, no laptop skills)
---------------------------------------------------------------------

You need a free GitHub account and a free Render account. That's it.
You will NOT type a single command.

### Step 1 — Put this folder on GitHub
1. Go to github.com -> sign up / log in.
2. Click the "+" at the top right -> **New repository**.
3. Name it `shyam-timber`, choose **Private**, click **Create repository**.
4. On the next page click **uploading an existing file**.
5. Drag this WHOLE unzipped folder into the browser window. Wait for upload.
6. Click **Commit changes**.

### Step 2 — Deploy everything in one click
1. Go to render.com -> sign up with your GitHub account.
2. Click **New +** (top right) -> **Blueprint**.
3. Choose your `shyam-timber` repository -> click **Apply**.
4. Render reads the file `render.yaml` and automatically builds THREE things:
   - the database
   - `shyam-timber-api`  (the backend / brain)
   - `shyam-timber-web`  (the website / what people see)
5. Wait ~10 minutes (first build is slow). Everything turns green.

### Step 3 — Tell the two halves each other's address
Render gives each piece a web address, for example
`https://shyam-timber-api.onrender.com` and `https://shyam-timber-web.onrender.com`.
If your names ended up different (because someone already used that name):
1. Open **shyam-timber-web** -> **Environment** -> edit `VITE_API_URL` -> paste the API address -> Save.
2. Open **shyam-timber-api** -> **Environment** -> edit `CLIENT_URL` -> paste the website address -> Save.
3. Click **Manual Deploy -> Deploy latest commit** on both. Wait until green.

### Step 4 — Open it on your phone
1. On your Android/iPhone open the website address in Chrome or Safari.
2. Log in with phone number **9342194431** and OTP **123456** -> you are the owner.
3. Install it like a real app:
   - Android (Chrome): menu (3 dots) -> **Add to Home screen**
   - iPhone (Safari): Share button -> **Add to Home Screen**
4. Share the same website link with customers on WhatsApp. They sign up with their own number.

### Step 5 — Make it yours
Log in as owner -> **Admin** button at the top:
- **Settings**: shop timings, reward amounts.
- **Posts**: delete the 12 "Sample" posts, add your real photos and prices.
- **Moderation**: approve customer comments.
- **Referrals**: type the invoice number + bill amount to approve a reward.

> Free Render services fall asleep after 15 minutes of no use; the first visit then
> takes ~30 seconds to wake up. Upgrading the API to the $7/month plan removes that.

> Real SMS: the OTP is fixed at 123456 until you buy an SMS account (MSG91).
> Then set `OTP_PROVIDER=msg91` and `MSG91_AUTH_KEY=...` in the API environment.

---------------------------------------------------------------------
## PATH B — Try it on your own computer first (needs Docker Desktop)
---------------------------------------------------------------------

1. Install **Docker Desktop** from docker.com and start it.
2. Open this folder in VS Code -> menu **Terminal -> New Terminal**.
3. Type this one line and press Enter:

       docker compose up --build

4. Wait a few minutes, then open **http://localhost:8080** in your browser.
5. Log in: phone **9342194431**, OTP **123456**.
6. To see it on your phone on the same Wi-Fi: find your computer's IP
   (Windows: type `ipconfig`, Mac: `ifconfig`), then stop it (Ctrl+C) and run:

       VITE_API_URL=http://192.168.1.50:4000 CLIENT_URL=http://192.168.1.50:8080 PUBLIC_URL=http://192.168.1.50:4000 docker compose up --build

   (replace 192.168.1.50 with your own number) and open `http://192.168.1.50:8080` on the phone.
7. Stop everything with Ctrl+C, or `docker compose down`.

---------------------------------------------------------------------
## Test logins (demo data)
| Who | Phone | OTP |
|---|---|---|
| Shyam (owner) | 9342194431 | 123456 |
| Demo customers | 9000000001 ... 9000000006 | 123456 |

Full technical details are in **README.md**.
