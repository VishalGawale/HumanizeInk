# Auth Setup Guide — Clerk + Humanizer.ink

## What's new in this update
- Signup / login with Google or Email
- Guest users: 3 free uses per day
- Signed in users: 20 free uses per day
- Popup appears when limit is hit
- Usage counter in navbar
- Mode selector: Fast / Standard / Enhanced
- Side by side input/output layout

---

## Step 1 — Create a FREE Clerk account

1. Go to https://clerk.com
2. Click "Start building for free"
3. Sign up with your Gmail
4. You're inside the Clerk dashboard

---

## Step 2 — Create a new application

1. Click "Create application"
2. Name it: humanizer-ink
3. Under "How will your users sign in?" enable:
   - ✅ Email address
   - ✅ Google
4. Click "Create application"

---

## Step 3 — Get your API keys

After creating the app Clerk shows you your keys.

You need TWO keys:

1. Publishable key — looks like: pk_live_xxxxxxxxxxxx
2. Secret key — looks like: sk_live_xxxxxxxxxxxx  (you won't need this for now)

Copy the Publishable key.

---

## Step 4 — Add your domain to Clerk

1. In Clerk dashboard → left sidebar → "Domains"
2. Click "Add domain"
3. Type: humanizer.ink
4. Follow verification steps (Clerk will guide you)

---

## Step 5 — Add environment variable to Vercel

1. Go to vercel.com → your project → Settings → Environment Variables
2. Add this:

   Name:  VITE_CLERK_PUBLISHABLE_KEY
   Value: pk_live_xxxxxxxxxxxx (your actual key)

3. Click Save
4. Also make sure GROQ_API_KEY is still there from before

---

## Step 6 — Push code to GitHub

Replace all files in your project with the files from this zip.
Then run:

   git add .
   git commit -m "add auth, usage limits, mode selector"
   git push

Vercel auto-deploys in ~2 minutes.

---

## Step 7 — Test it

1. Open humanizer.ink
2. You should see Sign in / Sign up buttons in the navbar
3. The usage counter shows "3 uses left today"
4. After 3 uses the signup popup appears
5. After signing up you get 20 uses per day

---

## How limits work

Guest (not signed in):
- 3 humanizations per day
- Tracked in browser localStorage
- Resets at midnight

Free account (signed in):
- 20 humanizations per day
- Tracked in browser localStorage per user
- Resets at midnight

---

## Clerk free tier limits

Clerk is free for up to 10,000 monthly active users.
That means you can have 10,000 people signing in per month for free.
More than enough until you're making real revenue.
