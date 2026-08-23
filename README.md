# Aldrin Bangayan — Portfolio

Tactical/glitch design (Valorant-inspired) with scroll-linked parallax (Genshin-inspired).
No build step required — plain HTML/CSS/JS + GSAP via CDN.

## File map

```
index.html          → page structure
css/style.css        → all design tokens + styles
js/main.js            → renders content + GSAP animations
content/data.json      → ALL your editable content (name, bio, missions, archive, loadout, contact)
admin/                → Decap CMS admin panel (edit content/data.json visually)
images/               → drop your real photos here (see placeholders below)
```

## 1. Add your real content right now (optional, can also do later via admin panel)

- Replace placeholder text by editing `content/data.json` directly, OR wait and use the `/admin` panel after deploying (see step 4).
- Drop these image files in when you have them:
  - `images/profile.jpg` → your photo for the AGENT card
  - `images/projects/floodwatch.jpg`, `inventory.jpg`, `unity-game.jpg`
  - `images/archive/inkblaze-01.jpg`
  - `resume.pdf` in the root folder, if you want the Download Dossier button to work
- Until you add these, the site shows clean placeholder states — nothing breaks.

## 2. Push to GitHub with git (free)

```bash
cd portfolio
git init
git add .
git commit -m "Initial portfolio build"
```

Create a new empty repo on GitHub (e.g. `portfolio`), then:

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
git push -u origin main
```

## 3. Deploy to Netlify (free)

1. Go to https://app.netlify.com → "Add new site" → "Import an existing project"
2. Connect GitHub, pick your `portfolio` repo
3. Leave build command empty, publish directory as `/` (root) — there's no build step
4. Click Deploy — you'll get a live URL like `yourname.netlify.app` in under a minute
5. (Optional) Add a custom domain for free in Site settings → Domain management

## 4. Turn on the admin panel (Decap CMS + Netlify Identity)

This is what makes `/admin` only accessible to you:

1. In your Netlify site dashboard → **Site configuration → Identity → Enable Identity**
2. Under Identity → **Registration**, set to **Invite only** (critical — this is what blocks random signups)
3. Under Identity → **Services → Git Gateway**, click **Enable Git Gateway**
4. Go to Identity tab → **Invite users** → invite your own email
5. Check your email, accept the invite, set a password
6. Visit `yourname.netlify.app/admin` and log in — you'll see a visual form for Profile, Missions, Archive, and Loadout
7. Any edit you save there commits straight to your GitHub repo and redeploys automatically

Nobody else can reach that panel without an invite — viewers of your site never see any edit controls at all.

## 5. Editing later

- **Via admin panel**: go to `/admin`, log in, edit fields, upload images through the form, hit publish.
- **Via code**: edit `content/data.json` directly and push — the site reads from this file automatically, so you never touch HTML/CSS to add a mission or archive entry.

## Local preview before deploying

No install needed — any static server works, e.g. with Python:

```bash
cd portfolio
python3 -m http.server 8000
```

Then open `http://localhost:8000`.
