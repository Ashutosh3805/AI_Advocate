# 🚀 AI Advocate — Full Deployment Guide

Deploy your AI Advocate project with **Vercel** (frontend) and **Render** (backend).

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Push to GitHub](#2-push-to-github)
3. [Setup MongoDB Atlas (Cloud Database)](#3-setup-mongodb-atlas-cloud-database)
4. [Deploy Backend on Render](#4-deploy-backend-on-render)
5. [Deploy Frontend on Vercel](#5-deploy-frontend-on-vercel)
6. [Environment Variables Reference](#6-environment-variables-reference)
7. [Post-Deployment Verification](#7-post-deployment-verification)
8. [Custom Domain Setup (Optional)](#8-custom-domain-setup-optional)
9. [Troubleshooting](#9-troubleshooting)

---

## 1. Prerequisites

Before starting, make sure you have:

| Requirement | Where to Get It |
|-------------|----------------|
| **Node.js** v18+ | [nodejs.org](https://nodejs.org) |
| **Git** installed | [git-scm.com](https://git-scm.com) |
| **GitHub account** | [github.com](https://github.com) |
| **Vercel account** | [vercel.com](https://vercel.com) — sign up with GitHub |
| **Render account** | [render.com](https://render.com) — sign up with GitHub |
| **MongoDB Atlas account** | [mongodb.com/atlas](https://www.mongodb.com/atlas) — free M0 cluster |
| **Groq API Key** | [console.groq.com](https://console.groq.com) — free tier available |

---

## 2. Push to GitHub

Your project needs to be on GitHub for both Vercel and Render to deploy from.

### Option A: If you already have a GitHub repo

```bash
cd "c:\Users\ashut\Desktop\Software Enginnering\AI Advocate"
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

### Option B: If you don't have a GitHub repo yet

1. Go to [github.com/new](https://github.com/new) and create a new repository named `AI-Advocate`
2. Make it **Private** (recommended since it contains API config)
3. **Do NOT** initialize with README (you already have one)
4. Then run these commands:

```bash
cd "c:\Users\ashut\Desktop\Software Enginnering\AI Advocate"
git remote add origin https://github.com/YOUR_USERNAME/AI-Advocate.git
git branch -M main
git add .
git commit -m "Initial deployment setup"
git push -u origin main
```

> ⚠️ **IMPORTANT**: Make sure your `.env` file is in `.gitignore` so your API keys are NEVER pushed to GitHub. Both `Server/.gitignore` and `AI_Advocate/.gitignore` already include `.env` — just double-check before pushing.

---

## 3. Setup MongoDB Atlas (Cloud Database)

Your local MongoDB (`mongodb://127.0.0.1:27017`) won't be accessible in production. You need a cloud database.

### Step-by-Step:

1. **Go to** [mongodb.com/atlas](https://www.mongodb.com/atlas) and sign up / log in

2. **Create a Free Cluster:**
   - Click **"Build a Cluster"** or **"Create"**
   - Select **M0 (Free Tier)**
   - Choose a cloud provider: **AWS** is recommended
   - Choose a region close to you (e.g., `Mumbai (ap-south-1)` for India)
   - Click **"Create Deployment"**

3. **Create a Database User:**
   - Username: `ai_advocate_admin` (or anything you choose)
   - Password: Click **"Autogenerate Secure Password"** and **COPY IT** somewhere safe
   - Click **"Create User"**

4. **Set Network Access:**
   - Click **"Network Access"** in the left sidebar
   - Click **"Add IP Address"**
   - Click **"Allow Access from Anywhere"** → this adds `0.0.0.0/0`
   - Click **"Confirm"**
   
   > This is necessary because Render's IP addresses are dynamic. For extra security, you can restrict IPs later.

5. **Get Your Connection String:**
   - Go to **"Database"** → Click **"Connect"** on your cluster
   - Choose **"Connect your application"** (or "Drivers")
   - Copy the connection string. It looks like:
   ```
   mongodb+srv://ai_advocate_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   - **Replace `<password>`** with your actual password
   - **Add your database name** before the `?`:
   ```
   mongodb+srv://ai_advocate_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/ai_advocate?retryWrites=true&w=majority
   ```

6. **Save this connection string** — you'll need it for the backend deployment.

---

## 4. Deploy Backend on Render

### Step-by-Step:

1. **Go to** [render.com](https://render.com) and log in with GitHub

2. **Create a New Web Service:**
   - Click **"New +"** → **"Web Service"**
   - Connect your **AI-Advocate** GitHub repository
   - If you don't see it, click **"Configure account"** to grant Render access

3. **Configure the Service:**

   | Setting | Value |
   |---------|-------|
   | **Name** | `ai-advocate-server` |
   | **Region** | Choose closest to you |
   | **Branch** | `main` |
   | **Root Directory** | `Server` |
   | **Runtime** | `Node` |
   | **Build Command** | `npm install` |
   | **Start Command** | `node server.js` |
   | **Instance Type** | `Free` |

4. **Add Environment Variables:**
   
   Click **"Advanced"** → **"Add Environment Variable"** and add these:

   | Key | Value |
   |-----|-------|
   | `PORT` | `10000` |
   | `NODE_ENV` | `production` |
   | `MONGO_URI` | Your MongoDB Atlas connection string from Step 3 |
   | `JWT_SECRET` | A strong random string (e.g., run `openssl rand -base64 32` or use a password generator) |
   | `GROQ_API_KEY` | Your Groq API key (starts with `gsk_`) |
   | `FRONTEND_URL` | Leave empty for now — you'll update this after deploying frontend |

5. **Click "Create Web Service"**

6. **Wait for the build** — it takes 2-5 minutes. You'll see logs in real-time.

7. **Copy your backend URL** — it will look like:
   ```
   https://ai-advocate-server.onrender.com
   ```

8. **Test the health endpoint** — open this in your browser:
   ```
   https://ai-advocate-server.onrender.com/api/health
   ```
   You should see a JSON response with `"success": true`.

> ⚠️ **Note**: Render free tier services spin down after 15 minutes of inactivity. The first request after idle may take 30-60 seconds. This is normal for free tier.

---

## 5. Deploy Frontend on Vercel

### Step-by-Step:

1. **Go to** [vercel.com](https://vercel.com) and log in with GitHub

2. **Import your project:**
   - Click **"Add New..."** → **"Project"**
   - Find and select your **AI-Advocate** repository
   - Click **"Import"**

3. **Configure the project:**

   | Setting | Value |
   |---------|-------|
   | **Framework Preset** | `Vite` (Vercel usually auto-detects this) |
   | **Root Directory** | Click **"Edit"** → type `AI_Advocate` → Click **"Continue"** |
   | **Build Command** | `npm run build` (default) |
   | **Output Directory** | `dist` (default) |
   | **Install Command** | `npm install` (default) |

4. **Add Environment Variable:**

   Click **"Environment Variables"** and add:

   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | `https://ai-advocate-server.onrender.com/api` |

   > Replace with YOUR actual Render backend URL from Step 4.

5. **Click "Deploy"**

6. **Wait for the build** — it takes 1-2 minutes.

7. **Your frontend is live!** 🎉 Vercel gives you a URL like:
   ```
   https://ai-advocate.vercel.app
   ```

### Update Backend CORS:

Now go back to **Render** and update the `FRONTEND_URL` environment variable:

1. Go to your Render dashboard → your `ai-advocate-server` service
2. Click **"Environment"** tab
3. Set `FRONTEND_URL` to your Vercel URL:
   ```
   https://ai-advocate.vercel.app
   ```
   > If you have multiple domains (e.g., with and without `www`), separate them with commas:
   > `https://ai-advocate.vercel.app,https://www.ai-advocate.vercel.app`
4. Click **"Save Changes"** — Render will auto-redeploy

---

## 6. Environment Variables Reference

### Backend (Render)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `PORT` | ✅ | Server port | `10000` |
| `NODE_ENV` | ✅ | Environment | `production` |
| `MONGO_URI` | ✅ | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/ai_advocate` |
| `JWT_SECRET` | ✅ | Secret for JWT tokens | A random 32+ character string |
| `GROQ_API_KEY` | ✅ | Groq API key for AI | `gsk_xxxxxxxxxxxx` |
| `FRONTEND_URL` | ✅ | Your Vercel frontend URL | `https://ai-advocate.vercel.app` |

### Frontend (Vercel)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `VITE_API_URL` | ✅ | Backend API base URL | `https://ai-advocate-server.onrender.com/api` |

---

## 7. Post-Deployment Verification

After both services are deployed, verify everything works:

### ✅ Backend Health Check
Open in browser:
```
https://YOUR-RENDER-URL.onrender.com/api/health
```
Expected: `{"success": true, "message": "AI Advocate backend is active and operational.", ...}`

### ✅ Frontend Loads
Open in browser:
```
https://YOUR-VERCEL-URL.vercel.app
```
Expected: The AI Advocate homepage loads with the cyber-legal theme.

### ✅ Registration & Login
1. Go to `/login` on your Vercel URL
2. Switch to **Sign Up** and create a test account
3. Verify you get redirected to `/terminal`

### ✅ Chat Works
1. In the terminal, type a question like "What is a non-disclosure agreement?"
2. Verify you get an AI response from Groq (properly formatted, no `**` characters)

### ✅ File Upload Works
1. Click the attachment icon in the chat input
2. Upload a PDF document
3. Verify the upload succeeds and you can reference it in queries

---

## 8. Custom Domain Setup (Optional)

### Vercel (Frontend)
1. Go to your Vercel project → **Settings** → **Domains**
2. Add your custom domain (e.g., `aiadvocate.com`)
3. Follow Vercel's DNS instructions (add CNAME or A records at your domain registrar)
4. Vercel auto-provisions SSL certificates

### Render (Backend)
1. Go to your Render service → **Settings** → **Custom Domains**
2. Add your custom domain (e.g., `api.aiadvocate.com`)
3. Follow Render's DNS instructions
4. Update `VITE_API_URL` on Vercel to use `https://api.aiadvocate.com/api`

---

## 9. Troubleshooting

### "Network Error" or CORS errors in browser console
- **Cause**: Backend `FRONTEND_URL` doesn't match your Vercel URL exactly
- **Fix**: Check for trailing slashes. The value should be `https://ai-advocate.vercel.app` (no trailing `/`)
- **Also check**: Is your Render service running? Free tier spins down after 15 min idle.

### Login/Register returns 401 or connection error
- **Cause**: `VITE_API_URL` on Vercel is wrong
- **Fix**: Verify it points to `https://YOUR-RENDER-URL.onrender.com/api` (with `/api` at the end)

### Render build fails
- **Cause**: Missing `Root Directory` setting
- **Fix**: Set Root Directory to `Server` in Render dashboard

### Vercel build fails with "Cannot find module"
- **Cause**: Missing `Root Directory` setting
- **Fix**: Set Root Directory to `AI_Advocate` in Vercel dashboard

### MongoDB connection fails on Render
- **Cause**: Atlas network access not open, or wrong connection string
- **Fix**: 
  - Verify Atlas Network Access allows `0.0.0.0/0`
  - Verify `MONGO_URI` has the real password (not `<password>`)
  - Verify database name is included: `.../ai_advocate?retryWrites=true`

### First request is very slow (30-60 seconds)
- **Cause**: Render free tier spins down after 15 min idle (cold start)
- **Fix**: This is expected on free tier. Upgrade to Render paid tier ($7/mo) for always-on.

### AI responses show `**` characters
- Already fixed! The `react-markdown` library renders Markdown formatting properly.

### Vercel routes show 404 on refresh
- Already fixed! The `vercel.json` SPA rewrite rule handles this.

---

## Quick Reference: Deployment URLs

After deployment, your URLs will be:

| Service | URL |
|---------|-----|
| **Frontend** | `https://ai-advocate.vercel.app` |
| **Backend** | `https://ai-advocate-server.onrender.com` |
| **Health Check** | `https://ai-advocate-server.onrender.com/api/health` |
| **MongoDB** | MongoDB Atlas Dashboard |

---

**🎉 Congratulations! Your AI Advocate is now live on the internet!**
