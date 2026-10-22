# College Events Portal: The Journey from GitHub to Production

A tiny static site (HTML + CSS + vanilla JS) that goes from a commit on `main` to a live
website through GitHub Actions: **test → build → deploy**. If the tests fail, build and deploy never
run, so production stays untouched.

- **Live site:** https://ajoaugustine.github.io/college-events-portal/ (or `https://demo.yourdomain.com` once DNS is set up)
- **Pipeline:** [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)

```
.
├── .github/workflows/deploy.yml   # the pipeline: test → build → deploy
├── site/                          # the website, exactly as students see it
│   ├── index.html                 # ✏️ the heading you edit live
│   ├── styles.css
│   ├── CNAME                      # custom domain
│   └── js/
│       ├── validation.js          # isValidName / isValidEmail (unit tested)
│       └── app.js                 # wires the form to the validators
├── test/validation.test.js        # 5 tests, Node's built-in runner
├── Dockerfile                     # "same site in a container" (local only)
└── package.json                   # no dependencies, just `npm test`
```

## Run it locally

```bash
npm test                          # needs Node 20+; no npm install required
python3 -m http.server -d site    # then open http://localhost:8000
```

Locally the footer shows the raw placeholders (`__VERSION__ · __COMMIT_SHA__ · …`). The workflow
replaces them at build time, which makes a good talking point.

## How the pipeline works

| Trigger | `Run automated tests` | `Build the site` | `Publish to GitHub Pages` |
|---|---|---|---|
| Push to `main` | ✅ | ✅ | ✅ |
| Push to `demo/**` | ✅ | skipped | skipped |
| Pull request | ✅ | skipped | skipped |
| Manual "Run workflow" on `main` | ✅ | ✅ | ✅ |

The **Stamp version into the page** step replaces the footer placeholders with `v1.0`, the
7-character commit SHA, and the current time in IST.

---

# Demo runbook

## 1. One-time setup

1. **Pages source:** Repo → **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. **DNS (custom domain):** at your DNS provider, add:

   | Type | Name/Host | Value |
   |---|---|---|
   | CNAME | `demo` | `ajoaugustine.github.io` |

   Then in **Settings → Pages → Custom domain**, enter `demo.yourdomain.com` and click **Save**.
   Put your real domain in [`site/CNAME`](site/CNAME) too, so the repo documents it.
   (With Actions-based Pages, the domain set in Settings is what counts. The `CNAME` file is
   shipped in the artifact for clarity.)
3. **HTTPS:** after the DNS check turns green (it can take minutes, sometimes up to an hour), tick
   **Enforce HTTPS** on the same page.
4. **The red run:** the `demo/broken-validation` branch has a bug where `isValidEmail` accepts empty
   and invalid emails. Pushing it gives you a failed run to show:
   ```bash
   git push origin demo/broken-validation
   ```
   For a nicer story, also open a PR from it (the PR page shows the red ❌ check and keeps it
   from being merged by accident):
   ```bash
   gh pr create --base main --head demo/broken-validation \
     --title "Simplify email validation" --body "Demo: this PR breaks validation on purpose."
   ```
   **Never merge this PR.**

## 2. Pre-talk checklist (30 to 60 minutes before)

- [ ] **Warm-up run:** Actions → *From GitHub to Production* → **Run workflow** on `main`. Check
      that it turns green within about a minute.
- [ ] Open the site on your **phone** over mobile data, not just campus Wi-Fi.
- [ ] Footer shows a real SHA and today's time in IST.
- [ ] Generate a **QR code** for the URL (e.g. `qrencode -o qr.png https://demo.yourdomain.com`,
      or the "Create QR code" option in Chrome's share menu). Put it on a slide.
- [ ] Browser tabs open: (1) live site, (2) `site/index.html` on GitHub, (3) Actions tab,
      (4) the red run / the red PR.
- [ ] Logged in to GitHub, browser zoom at 150% or more so the back row can read it.
- [ ] Optional: Docker Desktop running and `docker build` already done once (warms the image cache).

## 3. Live demo script (about 8 to 10 minutes)

| Time | Do | Say |
|---|---|---|
| 0:00 | Show the **live site** and the QR code. Students open it. | "This is production. Look at the footer: that version, commit, and time were stamped by a robot." |
| 1:00 | Open `site/index.html` on GitHub → ✏️ **Edit**. Change the `<h1>`, e.g. *"Welcome, MCA Class of 2027!"* | "One line change. No server, no FTP, no SSH." |
| 2:00 | **Commit changes** directly to `main` with a clear message. Copy the short SHA. | "A commit is the start of the journey." |
| 2:30 | **Actions** tab → open the new run. Watch *Run automated tests* → *Build the site* → *Publish to GitHub Pages*. Click into *Stamp version into the page* to show its log. | "Every change is tested before it's allowed near production." |
| 4:00 | While it runs, open the **old red run** (or red PR). Show the failing test: *rejects an empty email*. Point out that build and deploy show as **skipped**. | "Someone broke email validation. The tests caught it, and production never saw it." |
| 6:00 | Run goes green → click the URL on the **deploy** job. Students **refresh** their phones. | "Refresh now!" |
| 7:00 | Point to the footer: the **new SHA** matches the commit from 2:00, with a new IST timestamp. | "That's how you know exactly what is running in production." |
| 8:00 | Optional: **Docker** segment (below), about 1 minute. | "Same site, packaged as a container." |
| 9:00 | Optional: show **rollback** (below). Questions. | |

> Phones may cache the page. If someone sees the old heading, ask them to pull to refresh or open it in a private tab.

## 4. Rollback

Every deploy is just a commit, so you roll back by undoing a commit. That triggers a fresh
pipeline run, which redeploys the previous version.

**Command line:**
```bash
git log --oneline -5           # find the bad commit
git revert <bad-sha>           # creates a new commit that undoes it
git push origin main           # pipeline runs → previous version is live again
```

**GitHub UI:** if the change came in through a PR, open the merged PR and click **Revert**.
That opens a revert PR; merge it. For a direct commit (like the live heading edit), either use
the command line above or edit the file back in the web editor.

The footer will show the *revert* commit's SHA. History is never rewritten, so you can see who
changed what and when.

**Emergency:** Actions → pick an earlier successful run on `main` → **Re-run all jobs**. This
redeploys that older commit right away. Follow up with a proper `git revert` so `main` matches
what's live.

## 5. Backup plan (if the live run is slow or Wi-Fi fails)

- **Slow runner:** keep talking through the workflow file (`deploy.yml`) on screen while it runs.
  A queued run typically starts within 10 to 30 seconds.
- **Show a finished run:** the warm-up run from the checklist is already green, so walk through its logs.
- **Pre-record:** record a screen capture of the whole flow during the pre-talk check and keep it
  on your laptop.
- **No internet at all:** run it locally:
  `npm test`, then `python3 -m http.server -d site`, or use the Docker command below.
- **Show the failure locally:** `git checkout demo/broken-validation && npm test`.

## Docker: the same site in a container (optional, about 1 minute)

GitHub Pages doesn't use containers. This is a separate, local-only demo.

```bash
docker build -t college-events-portal .
docker run --rm -p 8080:80 college-events-portal
# open http://localhost:8080   (Ctrl+C to stop)
```

The container serves the unstamped site, so the footer shows the placeholders. That's a nice
hook: "the stamping happens in the pipeline, not in the code."
