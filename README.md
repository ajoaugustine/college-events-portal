# College Events Portal: The Journey from GitHub to Production

A tiny static site that goes from a commit on `main` to a live website through GitHub Actions:
**test → build → deploy**. If the tests fail, build and deploy never run, so the live site stays untouched.

**Live site:** https://ajoaugustine.github.io/college-events-portal/

```
.
├── .github/workflows/
│   ├── deploy.yml        # test → build → deploy to GitHub Pages
│   └── docker.yml        # build + publish a Docker image
├── site/
│   ├── index.html        # ✏️ the page (the form code lives here too)
│   ├── styles.css
│   └── validation.js     # the logic the tests check
├── validation.test.js    # 5 simple tests
├── Dockerfile
└── package.json
```

## Setup

Repo **Settings → Pages → Source: GitHub Actions**. That's it.

## How it works

| Push to | Tests | Build + Deploy |
|---|---|---|
| `main` | ✅ | ✅ (the site updates in about a minute) |
| any other branch / PR | ✅ | skipped |

The build step stamps the version, commit SHA, and IST time into the page footer.

A separate **Docker image** workflow builds the same site into a container and, on `main`, publishes it to
GitHub's container registry. It runs alongside the Pages deploy and never blocks it:

```bash
docker run --rm -p 8080:80 ghcr.io/ajoaugustine/college-events-portal:latest   # http://localhost:8080
```

## Demo

1. **Change the site:** edit the `<h1>` in `site/index.html` on GitHub and commit to `main`. Watch the
   **Actions** tab, then refresh the site and check that the footer SHA matches your commit.
2. **Break it:** in `site/validation.js`, change line 12 to `return true;` and commit.
   Tests go red, deploy is skipped, and the site is unchanged. Change it back to fix it.

## Run locally

```bash
npm test                          # Node 20+, no install needed
python3 -m http.server -d site    # http://localhost:8000
```

Or build the image yourself:

```bash
docker build -t college-events-portal .
docker run --rm -p 8080:80 college-events-portal   # http://localhost:8080
```
