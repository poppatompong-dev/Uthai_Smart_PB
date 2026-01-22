Quick GitHub → Firebase Hosting deploy

1) Create Git repo and push this project to GitHub (branch `main`).

2) Locally install Firebase CLI and generate a CI token:

```bash
npm install -g firebase-tools
firebase login
# optional: if you haven't initialized hosting yet
# firebase init hosting
# generate a CI token for GitHub Actions
firebase login:ci
```

The `firebase login:ci` command prints a token. Copy it.

3) Add the token to your GitHub repo secrets:
- Repo Settings → Secrets and variables → Actions → New repository secret
- Name: `FIREBASE_TOKEN`
- Value: (the token from step 2)

4) Commit and push to `main`. GitHub Actions will run the workflow `.github/workflows/firebase-hosting.yml` and deploy to the Firebase project defined in `.firebaserc` (project `uthai-smart-pa`).

Notes
- `firebase.json` rewrites all requests to `index.html` to support the SPA routing.
- If you prefer service-account-based deploys (more secure), use `FirebaseExtended/action-hosting-deploy@v0` with a service account JSON stored as a secret; I can add that workflow if you want.
- This repo contains `index.html` using Firestore client SDK; ensure the Firebase project `uthai-smart-pa` has Firestore rules and required APIs enabled.

Optional: Deploy Apps Script `Code.gs`
- Apps Script is separate from Firebase Hosting. To deploy `Code.gs` from GitHub you'd use `clasp` with a CI flow. Tell me if you want me to add `clasp` CI steps.
