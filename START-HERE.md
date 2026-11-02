# START HERE — put the app online for FREE (no credit card)

Three free pieces work together:

| Piece | Where | Cost |
|---|---|---|
| Database (memory) | **Neon** (neon.tech) | free forever |
| Backend (brain) | **Render** | free |
| Website (what people see) | **Vercel** | free |

You will not type any code. ~20 minutes.

---------------------------------------------------------------
## STEP 1 — Upload the folder to GitHub
---------------------------------------------------------------
1. github.com -> sign up / log in.
2. Top-right **+** -> **New repository** -> name `shyam-timber` -> **Private** -> **Create repository**.
3. Click the link **"uploading an existing file"**.
4. Drag the whole unzipped `shyam-timber` folder into the browser. Wait.
5. Click the green **Commit changes**.

---------------------------------------------------------------
## STEP 2 — Free database on Neon (2 min)
---------------------------------------------------------------
(Render's own free database is deleted after 30 days, Neon's is not — so we use Neon.)
1. Go to **neon.tech** -> Sign up with GitHub -> **Create project** (any name, region Singapore/Mumbai).
2. It shows a **Connection string** like
   `postgresql://user:pass@ep-xxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require`
3. Click **Copy**. Keep it in Notepad - you need it once.

---------------------------------------------------------------
## STEP 3 — Backend on Render (10 min)
---------------------------------------------------------------
1. **render.com** -> Sign in with GitHub -> **New +** -> **Blueprint** -> pick `shyam-timber` -> **Apply**.
   (The blueprint has NO disk, so the free plan accepts it. Photos are saved inside the database.)
2. Render starts building `shyam-timber-api`. While it builds, open that service -> **Environment**:
   - `DATABASE_URL` -> paste the **Neon** connection string from Step 2 (replace whatever is there).
   - Leave `STORAGE_DRIVER = db` and `COOKIE_SECURE = true`.
3. Click **Save changes**. Render redeploys. Wait for the green **Live**.
4. Copy the address at the top, e.g. `https://shyam-timber-api.onrender.com`.
5. Test it: open `https://<your-api-address>/api/v1/health` in a browser — you should see `{"ok":true,...}`.

> If you prefer NOT to use Neon: in the blueprint Render also creates `shyam-timber-db` (free for 30 days).
> Then just leave `DATABASE_URL` alone. You can switch to Neon later by pasting a new value.

---------------------------------------------------------------
## STEP 4 — Website on Vercel (5 min)
---------------------------------------------------------------
1. **vercel.com** -> Sign up with GitHub -> **Add New… -> Project** -> import `shyam-timber`.
2. Important: set **Root Directory** to **`client`** (click *Edit* next to Root Directory and choose the
   `client` folder). Framework shows **Vite** automatically.
3. Open **Environment Variables** and add:
   - Name: `VITE_API_URL`
   - Value: your Render API address from Step 3, e.g. `https://shyam-timber-api.onrender.com`
4. Click **Deploy**. After ~2 minutes you get an address like `https://shyam-timber.vercel.app`.

---------------------------------------------------------------
## STEP 5 — Introduce the two halves (1 min, very important)
---------------------------------------------------------------
Back on **Render** -> `shyam-timber-api` -> **Environment**:
- `CLIENT_URL` = your Vercel address (`https://shyam-timber.vercel.app`)
- `PUBLIC_URL` = your Render address (`https://shyam-timber-api.onrender.com`)
Save -> it redeploys. Done. (Without this, login cookies and WhatsApp previews won't work.)

---------------------------------------------------------------
## STEP 6 — Open on your phone and install it
---------------------------------------------------------------
1. Open the **Vercel address** on your phone.
2. Log in: phone **9342194431**, OTP **123456** -> you are the owner (gold **Admin** button appears).
3. Install as an app:
   - Android/Chrome: ⋮ menu -> **Add to Home screen**
   - iPhone/Safari: Share -> **Add to Home Screen**
4. Share the Vercel link with customers on WhatsApp.

---------------------------------------------------------------
## STEP 7 — Make it your shop
---------------------------------------------------------------
Admin ->
- **Settings**: opening hours, reward amounts
- **Posts**: delete the 12 "Sample" posts, add your real photos and prices
- **Moderation**: approve customer comments
- **Referrals**: enter invoice number + bill amount -> rewards are created automatically
- **Rewards**: "Mark as used" when a customer redeems at the counter

---------------------------------------------------------------
## Good to know
---------------------------------------------------------------
* **Free Render sleeps** after 15 idle minutes; the next visitor waits ~30 seconds. Vercel never sleeps,
  so the app opens instantly and only the first data load is slow. $7/month on Render removes it.
* **OTP is always 123456** until you buy SMS (MSG91 ~20 paise/SMS). Then on Render set
  `OTP_PROVIDER=msg91` and `MSG91_AUTH_KEY=...` — the code is already written.
* **Photos** are stored in the database (free, survives restarts). A 1 GB free database holds
  thousands of compressed photos. Later you can switch `STORAGE_DRIVER=s3`.
* **Costs you nothing** in this setup: Neon free + Render free + Vercel free.

---------------------------------------------------------------
## Want to try it on your own laptop first?
---------------------------------------------------------------
Install Docker Desktop, open this folder in a terminal and run:

    docker compose up --build

then open http://localhost:8080 (login 9342194431 / 123456). Stop with Ctrl+C.

Test logins: owner **9342194431**, demo customers **9000000001 … 9000000006**, OTP **123456**.
