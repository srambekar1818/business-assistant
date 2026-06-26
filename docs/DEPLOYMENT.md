# 🌐 Deployment Guide

Deploy the backend on **Render** (free) and frontend on **Vercel** (free).

---

## Part 1 — Deploy Backend on Render

### Step 1 — Create Render account
Go to https://render.com and sign up with GitHub.

### Step 2 — Create Web Service
1. Click **New +** → **Web Service**
2. Connect your GitHub repo `business-assistant`
3. Click **Connect**

### Step 3 — Configure settings

| Setting | Value |
|---------|-------|
| Name | `business-assistant-api` |
| Root Directory | `backend` |
| Runtime | `Python 3` |
| Build Command | `pip install -r requirements.txt` |
| Start Command | `uvicorn main:app --host 0.0.0.0 --port $PORT` |

### Step 4 — Add Environment Variable
- Key: `GROQ_API_KEY`
- Value: your Groq API key

### Step 5 — Deploy
Click **Create Web Service**. Wait 2-3 minutes.

✅ Your backend URL will be:
```
https://business-assistant-api.onrender.com
```

---

## Part 2 — Deploy Frontend on Vercel

### Step 1 — Update vercel.json
Open `frontend/vercel.json` and replace with your Render URL:

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://business-assistant-api.onrender.com/:path*"
    }
  ]
}
```

### Step 2 — Push to GitHub
```bash
git add frontend/vercel.json
git commit -m "update vercel config with render url"
git push origin main
```

### Step 3 — Create Vercel account
Go to https://vercel.com and sign up with GitHub.

### Step 4 — Deploy
1. Click **New Project**
2. Import `business-assistant` repo
3. Set **Root Directory** to `frontend`
4. Click **Deploy**

✅ Your frontend URL will be:
```
https://business-assistant.vercel.app
```

---

## Part 3 — Update CORS on Backend

After deploying frontend, update `backend/main.py` to allow your Vercel URL:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://business-assistant.vercel.app"  # add your vercel URL
    ],
    ...
)
```

Push the change and Render will auto-redeploy.

---

## ✅ Final Checklist

- [ ] Backend deployed on Render
- [ ] GROQ_API_KEY added on Render
- [ ] Frontend vercel.json updated with Render URL
- [ ] Frontend deployed on Vercel
- [ ] CORS updated with Vercel URL
- [ ] Test login & chat on live URL
