# Monday Devotion

A small React app that gives you a curated devotion verse each week for your Monday
morning workplace devotion, with space for your own notes and a history of what
you've presented. Notes/favorites/history are saved in your browser (localStorage).

## Deploy to Vercel (no coding needed)

**Option A — fastest, from your phone or computer:**
1. Go to [vercel.com](https://vercel.com) and sign up (free) — you can sign up with GitHub, GitLab, or just an email.
2. Once logged in, click **Add New → Project**.
3. Since this project isn't in a GitHub repo yet, choose the **"Deploy from CLI"** option below instead, OR follow Option B to put it on GitHub first (recommended — makes future edits easy).

**Option B — recommended, via GitHub (lets you update it later too):**
1. Create a free account at [github.com](https://github.com) if you don't have one.
2. Create a new repository (e.g. `monday-devotion`).
3. Upload all the files in this project folder to that repository (GitHub's web UI lets you drag-and-drop files — no command line needed).
4. Go to [vercel.com](https://vercel.com), sign up/log in, click **Add New → Project**.
5. Choose **Import Git Repository**, select your `monday-devotion` repo.
6. Vercel will auto-detect it's a Vite project — leave the defaults and click **Deploy**.
7. In under a minute you'll get a live link like `monday-devotion.vercel.app`.

## Add it to your phone's home screen

Once deployed, open the Vercel link on your phone:
- **iPhone (Safari):** tap the Share icon → **Add to Home Screen**
- **Android (Chrome):** tap the ⋮ menu → **Add to Home screen**

It'll then open full-screen like a native app.

## Local development (optional)

```
npm install
npm run dev
```

## Features

- **5-minute devotion**: full paragraph-form devotion for every verse, plus a "2-minute version" toggle for shorter weeks.
- **Series mode**: pick a theme (Diligence, Rest, Courage, etc.) and cycle through connected verses instead of one-offs.
- **Add your own verse**: go off the curated list any time — add a reference, verse text, and your own devotion paragraphs.
- **Share / Print**: share the current devotion via your phone's share sheet (or copy to clipboard), or print a clean copy.
- **Export notes**: download all your saved notes and devotion history as a single Markdown file — good for keeping an archive.
- **Privacy PIN**: optional device-level PIN lock (Settings → gear icon) so your notes stay private if others use your phone. This is a simple local lock, not a secure multi-user account system — if you ever want real separate logins for multiple people, that requires a backend service (e.g. Supabase) and is a separate setup.
- **Profile name**: add your name in Settings for a personalized header.

## Redeploying updates

Whenever you get updated files, replace them in your GitHub repo (same drag-and-drop upload into the `devotion-app` folder) and commit. Vercel automatically redeploys on every push.
