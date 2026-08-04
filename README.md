# Salahddine Dkaki — Portfolio

A static portfolio site — plain HTML, CSS (Tailwind, via CDN) and JavaScript. No backend, no build step, no database. Everything lives in these files, so anything you want to change, you just edit directly.

**Live site:** https://salahddinedkaki.github.io/portfolio/ · **LinkedIn:** https://www.linkedin.com/in/salahddinedkaki/

## Structure

```
portfolio/
├── index.html      Everything: layout + Tailwind classes
├── css/style.css   Fonts + the scroll-reveal animation (Tailwind can't express this part)
├── js/main.js      Nav toggle, scroll reveal, your projects list, contact form
├── assets/         Your photo (profile.jpg) and CV (resume.pdf)
└── favicon.svg
```

## Preview it locally

No install needed. Just open `index.html` directly in a browser, or serve it so relative paths behave exactly like they will on GitHub Pages:

```bash
cd portfolio
python3 -m http.server 5500
```

Visit `http://127.0.0.1:5500`.

## Editing things

- **Projects**: open `js/main.js`, edit the `PROJECTS` array near the top. Each entry is `{ title, description, tags, githubUrl, liveUrl, imageUrl }`. `imageUrl` currently points at GitHub's own auto-generated preview image for each repo, so it updates itself — swap in a path like `"assets/projects/yourshot.png"` any time you want a custom screenshot instead.
- **Colors**: open `index.html`, find the `tailwind.config` script near the top — the `tomato` color scale and `ink`/`cream` colors are defined there. Change the hex values to retheme the whole site at once.
- **Text**: everything else (bio, experience, skills, section titles) is plain text directly in `index.html` — search for it and edit in place.
- **Photo / CV**: replace `assets/profile.jpg` and `assets/resume.pdf`, keeping the same filenames.

## Contact form

There's no backend, so the form doesn't store or email anything on its own — submitting it opens the visitor's email client with your address and their message pre-filled (a `mailto:` link built in `js/main.js`). That's the standard approach for a pure static site; if you want messages actually stored somewhere later, a service like Formspree or EmailJS can be dropped in without needing your own server.

## Publish to GitHub Pages

1. Create a repo on GitHub (e.g. `portfolio`) and push these files to it, with `index.html` at the repo root:
   ```bash
   cd portfolio
   git init
   git add .
   git commit -m "Initial portfolio site"
   git branch -M main
   git remote add origin https://github.com/SALAHDDINEDKAKI/portfolio.git
   git push -u origin main
   ```
2. On GitHub: repo → **Settings** → **Pages** → under **Build and deployment → Source**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`.
3. Save. Your site goes live at `https://salahddinedkaki.github.io/portfolio/` within a minute or two — no build step, no Actions workflow needed.

## Notes

- If you name the repo anything other than `portfolio`, update the URL in `index.html`'s `<link rel="canonical">` and `og:*` meta tags to match.
- The Tailwind CDN build is meant for exactly this kind of project — fast to set up, easy to edit. If the site ever grows enough to want a build step (smaller CSS, custom plugins), that's a natural next upgrade, not something you need now.
