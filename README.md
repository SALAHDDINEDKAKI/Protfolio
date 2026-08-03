# Salahddine Dkaki — Portfolio

A dark, glass-themed portfolio site with a MERN backend: projects and contact
messages are stored in MongoDB and managed through a private admin panel, so
you never need to touch code to update your project list.

```
portfolio/
├── client/          → the public site (HTML/CSS/JS) + the admin panel
│   ├── index.html
│   ├── admin/        → private dashboard: manage projects, read messages
│   └── assets/       → your photo + resume go here
├── server/           → Node + Express + MongoDB API
└── .github/workflows/ → auto-deploys client/ to GitHub Pages on every push
```

Follow the steps in order — each one builds on the last.

---

## 1. Install prerequisites

- [Node.js](https://nodejs.org/) (LTS version) — includes `npm`
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) account
- A free [Render](https://render.com/) account (for hosting the API)
- [VS Code](https://code.visualstudio.com/) with the **Live Server** extension (for previewing the site locally) — or any local static server

---

## 2. Set up the database (MongoDB Atlas)

1. Create a free cluster at [MongoDB Atlas](https://cloud.mongodb.com/).
2. Under **Database Access**, create a database user with a username and password (save these).
3. Under **Network Access**, click **Add IP Address** → **Allow Access from Anywhere** (`0.0.0.0/0`) — simplest for a personal project.
4. Click **Connect** on your cluster → **Drivers** → copy the connection string. It looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/
   ```

---

## 3. Configure the server

```bash
cd server
npm install
cp .env.example .env
```

Open `server/.env` and fill in:

- `MONGO_URI` — your Atlas connection string from step 2 (add `portfolio` as the database name before the `?`, e.g. `.../portfolio?retryWrites=true...`)
- `JWT_SECRET` — generate one with:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — what you'll use to log into `/admin`
- Leave `SMTP_*` blank for now (optional — see step 8)

Then create your admin account and a starter project:

```bash
npm run seed
```

Start the API:

```bash
npm run dev
```

You should see `Server running on port 5000`. Leave this running.

---

## 4. Preview the site locally

In a **new** terminal, open `client/index.html` with Live Server (right-click → "Open with Live Server" in VS Code), or run:

```bash
cd client
python3 -m http.server 5500
```

Visit `http://127.0.0.1:5500`. You should see the full site, with the sample project loaded live from your database.

Go to `http://127.0.0.1:5500/admin` and log in with the `ADMIN_EMAIL` / `ADMIN_PASSWORD` you set — from there you can add your real projects and delete the sample one. They'll appear on the homepage instantly.

Test the contact form on the homepage — submitted messages show up under the **Messages** tab in `/admin`.

---

## 5. Add your photo and resume

See `client/assets/README_ASSETS.txt` for exact steps — in short:

1. Save your photo as `client/assets/profile.jpg`, then in `client/index.html` change the image source from `avatar-placeholder.svg` to `profile.jpg`.
2. Export your CV as a PDF and save it as `client/assets/resume.pdf` — the "Download CV" buttons already point to this filename.

---

## 6. Push to GitHub

```bash
cd portfolio
git init
git add .
git commit -m "Initial portfolio site"
git branch -M main
git remote add origin https://github.com/SALAHDDINEDKAKI/portfolio.git
git push -u origin main
```

(Create the empty `portfolio` repo on GitHub first, under your account, before pushing.)

Your `.env` file is already excluded via `.gitignore` — it will never be pushed.

---

## 7. Deploy the API (Render)

1. In Render, click **New +** → **Web Service** → connect your `portfolio` GitHub repo.
2. Set:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
3. Under **Environment**, add every variable from your `server/.env` file (same names and values), plus set `CLIENT_ORIGIN` to your future GitHub Pages URL:
   ```
   https://salahddinedkaki.github.io
   ```
4. Deploy. Once live, copy your service URL (e.g. `https://portfolio-api-xxxx.onrender.com`).
5. In the Render **Shell** tab, run `npm run seed` once to create your admin account on the live database (skip this if you're reusing the same Atlas cluster you already seeded locally).

> Free Render services sleep after inactivity and take ~30–50 seconds to wake up on the first request. That's normal for a free tier.

---

## 8. Point the frontend at the live API

Open `client/js/config.js` and change:

```js
window.API_BASE_URL = "http://localhost:5000";
```

to your real Render URL:

```js
window.API_BASE_URL = "https://portfolio-api-xxxx.onrender.com";
```

Commit and push this change.

---

## 9. Turn on GitHub Pages

1. On GitHub, go to your repo → **Settings** → **Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. That's it — the included workflow (`.github/workflows/deploy-pages.yml`) automatically publishes the `client/` folder every time you push to `main`.
4. After the first push, your site goes live at:
   ```
   https://salahddinedkaki.github.io/portfolio/
   ```

---

## 10. (Optional) Email notifications on new messages

Messages are always saved to the database and visible in `/admin`, whether or not you set this up. To *also* get an email the moment someone submits the form:

1. On your Google account, enable 2-Step Verification, then create an **App Password** at [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords).
2. In your `.env` (both locally and on Render), set:
   ```
   SMTP_USER=salahddinedkaki@gmail.com
   SMTP_APP_PASSWORD=<the 16-character app password>
   NOTIFY_EMAIL=salahddinedkaki@gmail.com
   ```
3. Redeploy the server. No frontend changes needed.

---

## Notes

- **If you name the GitHub repo anything other than `portfolio`**: update the URL in `client/index.html` (the `canonical`, `og:url`, `og:image`, `twitter:image` tags), `client/robots.txt`, and `client/sitemap.xml` to match — they currently assume `https://salahddinedkaki.github.io/portfolio/`.
- **The email on the contact page** (`client/index.html`, Contact section) is set to `salahddinedkaki@gmail.com`, confirmed against your uploaded CV.
- **Changing colors**: every color in the site is a CSS variable at the top of `client/css/style.css` (`:root { ... }`) — change `--violet-500` etc. to retheme everything at once.
- **Adding projects going forward**: never edit `index.html` for this — use `/admin`. That's the whole point of the database.
