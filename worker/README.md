# traychen-gate

Password gate for the three Artifex portfolio entries. The portfolio itself is a static
GitHub Pages build, so anything in `public/` is a guessable public URL. This Worker holds
the protected images in a private R2 bucket and only serves them to someone who has
entered the shared password.

It is deployed separately from the site — pushing to `main` does **not** redeploy it.

## One-time setup

```sh
cd worker
npm install
npx wrangler login

# private bucket for the protected images
npx wrangler r2 bucket create traychen-private

# per-IP unlock attempt counters — paste the printed id into wrangler.toml
npx wrangler kv namespace create RATE

# generate the password hash + token secret, then set the three secrets it prints
npm run hash
```

Then put the protected images in `private-assets/` at the repo root (gitignored):

```
private-assets/artifex/uiux/hero.webp
private-assets/artifex/uiux/half.webp
private-assets/artifex/uiux/01.webp
...
```

and upload them:

```sh
npm run upload
```

The keys must match `PROTECTED_PROJECTS` in [src/index.js](src/index.js) — that map is also
where the gated text (timeframe, tools, long description) lives, so it stays out of the
site bundle. Edit both together.

Finally:

```sh
npm run deploy
```

Copy the printed `https://traychen-gate.<your-subdomain>.workers.dev` URL into
`API_BASE` in [../src/components/api.js](../src/components/api.js).

## Local development

Create `worker/.dev.vars` (gitignored) with the three secrets:

```
PASSWORD_SALT=...
PASSWORD_HASH=...
TOKEN_SECRET=...
```

Then run the Worker and the site side by side, in two terminals:

```sh
cd worker && npm run dev          # the API, on http://localhost:8787
```

```sh
npm run dev                       # the site, on http://localhost:5173
```

Vite hops to 5174, 5175... if 5173 is already taken by an older run, and prints the port
it actually chose — any localhost port is accepted by the Worker. If you'd rather reclaim
5173, kill the stale process with `lsof -ti:5173 | xargs kill`. Same trick for
`Address already in use (127.0.0.1:8787)`, which just means a Worker is already running.

Put `VITE_API_BASE=http://localhost:8787` in a `.env.local` at the repo root (already
gitignored via `*.local`).

**Browse the site at http://localhost:5173, not :8787.** The Worker is an API with only
the three routes below — opening `http://localhost:8787/` in a browser hits no route and
correctly answers `{"error":"not_found"}`. Seeing that means it's running, not broken.

### Local R2 is a separate, empty bucket

`npm run dev` runs the Worker in local mode, where the `ASSETS` binding is a **simulated
bucket on disk under `.wrangler/`** — not the real one. `npm run upload` pushes to the
real remote bucket, so those images are invisible to local dev and every protected image
renders as a grey placeholder.

Two ways round it:

```sh
npm run dev -- --remote           # use the real R2 bucket and the deployed secrets
```

or seed the local simulation with a few files:

```sh
npx wrangler r2 object put traychen-private/artifex/uiux/hero.webp \
  --file ../private-assets/artifex/uiux/hero.webp --local
```

Note `--remote` ignores `.dev.vars` and uses the deployed secrets, so you'll need the
real password rather than a local test one.

## Changing the password

```sh
cd worker && npm run hash
npx wrangler secret put PASSWORD_SALT
npx wrangler secret put PASSWORD_HASH
```

No redeploy of the site needed. Anyone already unlocked stays unlocked until their token
expires — to kick everyone out immediately, also rotate `TOKEN_SECRET`.

## How it works

| Route | Auth | Returns |
| --- | --- | --- |
| `POST /unlock` | password in body | `{ token, exp }`, token valid 7 days |
| `GET /project/:slug` | `Bearer` token | gated text + R2 keys for that project |
| `GET /asset/<key>` | `Bearer` token | image bytes streamed from R2 |

- The password only ever exists as a PBKDF2 hash in a Worker secret.
- Tokens are HMAC-signed and expiry-checked server-side, so editing localStorage does
  nothing.
- The browser sends the token in an `Authorization` header and renders images from
  `blob:` URLs, so the token never appears in a URL, referrer, or history entry.
- Unlock attempts are capped at 10/hour per IP with a fixed 250ms delay on every attempt.
- Asset keys are rejected unless they start with `artifex/` and contain no `..`.

`PBKDF2_ITERATIONS` is set low (20k) because the Workers free plan caps CPU at 10ms per
request. That is fine here — the hash is a secret that is never served, so there is no
offline attack to harden against, and the rate limit is what stops guessing. On the paid
plan, raise it to 600000 in both `src/index.js` and `scripts/hash-password.mjs` and
regenerate.

Worth being honest about the limit: once someone has the password they can save the
images they see. This stops discovery and casual access, which is the point.
