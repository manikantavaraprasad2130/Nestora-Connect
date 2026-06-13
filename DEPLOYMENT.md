# Deploy Nestora Connect

## 1. Push to GitHub

Make sure this folder is the repository root:

```powershell
cd "C:\Users\manik\Desktop\project 1\Nestora-Connect"
git status
git add .
git commit -m "Prepare Vercel and Render deployment"
git push
```

## 2. Deploy Backend on Render

Create a new Render Web Service from the GitHub repository.

- Root Directory: leave empty if the repo root is `Nestora-Connect`
- Runtime: Node
- Build Command: `npm install`
- Start Command: `npm start`
- Health Check Path: `/api/health`

Add environment variables in Render:

- `MONGO_URI`: your MongoDB Atlas connection string
- `DB_NAME`: `mangobd`

After deploy, copy the Render URL, for example:

```text
https://nestora-connect-backend.onrender.com
```

## 3. Connect Frontend to Render

Open `frontend/js/config.js` and replace:

```js
https://YOUR-RENDER-BACKEND-URL.onrender.com
```

with your real Render backend URL.

Commit and push that change.

## 4. Deploy Frontend on Vercel

Create a new Vercel project from the same GitHub repository.

- Framework Preset: Other
- Root Directory: `frontend`
- Build Command: leave empty
- Output Directory: leave empty
- Install Command: leave empty

Deploy. Your Vercel frontend should now call the Render backend.

## Notes

Render free services can sleep after inactivity, so the first API request may take a little longer.

Uploaded images are stored in `backend/uploads`. On Render, disk storage is not permanent unless you add persistent disk storage or move uploads to a storage service such as Cloudinary/S3.
