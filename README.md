Project structure

- Frontend (Next.js) is at the repo root (app/, components/, package.json)
- Backend (Node/Express) is in server/

Recommended: Monorepo (one Hub repo)

1) Create .ignore (Node + Next + server):

```
node_modules/
**/node_modules/
.pnpm-store/
.next/
dist/
build/
.vercel/
.netlify/
coverage/
.turbo/
.serverless/
.out/

.env
.env.*
!.env.example
.env.local
**/.env
**/.env.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

.DS_Store
.idea/
.vscode/
*.tsbuildinfo
.eslintcache

server/dist/
server/node_modules/
server/.env
```

2) Initialize  and push

```
 init
 add .
 commit -m "chore: init monorepo (frontend + server)"
 branch -M main
 remote add origin https://hub.com/<you>/<repo>.
 push -u origin main
```

3) Deploy

- Frontend → Vercel (import the repo). Set environment variables in Vercel Project Settings.
- Backend → Render or Railway (free dyno). Root: server/; Start command: `node src/index.js` or your server start script.

Environment variables

Frontend (public):
- NEXT_PUBLIC_PAYPAL_CLIENT_ID
- NEXT_PUBLIC_PAYPAL_CURRENCY (USD recommended in sandbox)
- NEXT_PUBLIC_SMS_TO (optional fallback)

Backend/API (secret):
- TWILIO_ACCOUNT_SID
- TWILIO_AUTH_TOKEN
- TWILIO_FROM_NUMBER

Local dev

```
pnpm install
pnpm dev
```


