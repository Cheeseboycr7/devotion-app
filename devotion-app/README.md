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

## Setting up user accounts (Supabase)

This app now uses **real login and registration**, backed by Supabase (a free Postgres + auth service). Anyone can sign up, and each person's notes, favorites, and history are completely private to them.

### One-time setup

1. **Create a Supabase project** at [supabase.com](https://supabase.com) (free tier is plenty).
2. **Run the schema**: open your project → SQL Editor → New query → paste the entire contents of `supabase-schema.sql` (included in this project) → Run. This creates the `user_data` table, locks it down with row-level security so users can only ever see their own row, and auto-creates a row for each new signup.
3. **Get your API keys**: in your Supabase project → Settings → API, copy the **Project URL** and the **anon public key**.
4. **Add them to Vercel**: in your Vercel project → Settings → Environment Variables, add:
   - `VITE_SUPABASE_URL` = your Project URL
   - `VITE_SUPABASE_ANON_KEY` = your anon public key
   
   Then redeploy (Deployments tab → ⋯ → Redeploy) so the build picks up the new variables.
5. **Email confirmation**: by default, Supabase requires users to confirm their email before logging in. For an internal work tool you may want to turn this off — in Supabase, go to Authentication → Providers → Email and toggle "Confirm email" off if you'd rather people log in immediately after signing up.

### Local development

If you want to run this on your own computer first:
```
cp .env.example .env
# then fill in your Supabase URL and anon key in .env
npm install
npm run dev
```

## Features

- **Real accounts**: open registration — anyone can sign up with email + password. Every user's notes, favorites, history, custom verses, week overrides, and rotation list are fully private, enforced at the database level (not just hidden in the UI).
- **5-minute devotion**: full paragraph-form devotion for every verse, plus a "2-minute version" toggle for shorter weeks.
- **Presentation mode**: full-screen, distraction-free view with large text — ideal for reading straight off your phone while presenting.
- **Discussion questions**: 2–3 questions per verse to open the floor after you speak.
- **Related verses**: 2–3 cross-references per verse for further study (references only).
- **Look ahead**: see the next 5 Mondays' verses at a glance, and swap any week's verse manually if you want to change it in advance.
- **Rotation tracker**: add a list of names and the app automatically shows whose turn it is each week, based on the week number. Stored locally on your device only — not shared with others.
- **Series mode**: pick a theme (Diligence, Rest, Courage, etc.) and cycle through connected verses instead of one-offs.
- **Add your own verse**: go off the curated list any time — add a reference, verse text, and your own devotion paragraphs.
- **Share / Print**: share the current devotion via your phone's share sheet (or copy to clipboard), or print a clean copy.
- **Export notes**: download all your saved notes and devotion history as a single Markdown file — good for keeping an archive.
- **Privacy PIN**: replaced by real per-user login — no longer needed.
- **Profile name**: add your name in Settings for a personalized header.

### Not included (would need a backend)

- **Multiple Bible translations**: only KJV (public domain, verified) is included. Adding other translations accurately for all 40 verses would need per-verse verification I haven't done — let me know if you'd like this for a specific translation and I can add it carefully.
- **Team feedback/reactions**: this would require shared data other people can write to, which means a real backend (like Supabase or Firebase) rather than this device-only setup. Happy to scope that out if it becomes a priority.

## Redeploying updates

Whenever you get updated files, replace them in your GitHub repo (same drag-and-drop upload into the `devotion-app` folder) and commit. Vercel automatically redeploys on every push.
