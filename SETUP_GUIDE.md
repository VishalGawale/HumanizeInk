# HumanizeInk — Complete Setup Guide
## Using Groq (100% Free) + Vercel Deployment

---

## STEP 1 — Get Your FREE Groq API Key

1. Open your browser and go to: https://console.groq.com
2. Click "Sign Up"
3. Click "Continue with Google" — use your Gmail (same one as GitHub/Vercel)
4. You're now inside the Groq dashboard
5. In the LEFT SIDEBAR click "API Keys"
6. Click the button "Create API Key"
7. Give it a name: type "humanizeink" 
8. Click "Submit"
9. You will see your key — it looks like: gsk_xxxxxxxxxxxxxxxxxxxx
10. COPY IT RIGHT NOW — click the copy icon
11. Paste it in Notepad or Notes app — you'll need it in Step 4

✅ Done — Groq is completely free, no credit card needed

---

## STEP 2 — Replace Your Old GitHub Code

Your old GitHub repo has the wrong code (calls Anthropic directly).
You need to replace it with this new code.

On your computer:
1. Delete everything inside your old project folder EXCEPT the .git folder
2. Copy all files from this zip into that folder:
   - api/humanize.js
   - src/App.jsx
   - src/main.jsx
   - index.html
   - package.json
   - vite.config.js
   - vercel.json
   - .gitignore

3. Open Terminal / Command Prompt
4. Navigate to your project folder:
   cd path/to/your/project

5. Push the new code to GitHub:
   git add .
   git commit -m "switch to Groq free API"
   git push

✅ Your GitHub repo now has the correct code

---

## STEP 3 — Import Project in Vercel

If you haven't imported your repo to Vercel yet:

1. Go to vercel.com — log in with Gmail
2. Click "Add New Project"
3. Find your "humanizer" repo in the list
4. Click "Import"
5. Vercel will auto-detect it as a Vite project

⚠️ DO NOT click Deploy yet — go to Step 4 first

---

## STEP 4 — Add Your Groq API Key to Vercel

This is the most important step. Do not skip it.

On the Vercel configuration screen:
1. Scroll down to find "Environment Variables" section
2. Click to expand it
3. In the NAME field type exactly:
   GROQ_API_KEY

4. In the VALUE field paste your Groq key:
   gsk_xxxxxxxxxxxxxxxxxxxx

5. Click "Add"
6. You should see it appear in a list below (value will be hidden with asterisks)

✅ Now click "Deploy"

---

## STEP 5 — Wait For Deployment (~2 minutes)

Vercel will show a live build log. You will see:
- Installing dependencies...
- Building...
- Deploying...
- Success! ✅

You get a free URL like:
https://humanizeink-abc123.vercel.app

---

## STEP 6 — Test It Works

1. Open your Vercel URL
2. Click "Load sample" button
3. Click "Humanize →"
4. Wait a few seconds
5. You should see the humanized result appear

If it works — congratulations, your tool is live and 100% free!

---

## IF SOMETHING GOES WRONG

Problem: "Something went wrong" error on the site
Fix: Your GROQ_API_KEY is missing or wrong in Vercel
→ Go to Vercel dashboard → your project → Settings → Environment Variables
→ Check the key name is exactly: GROQ_API_KEY
→ Check the value starts with: gsk_
→ Redeploy after fixing

Problem: Build failed in Vercel
Fix: Check that all files are in the right folders
→ api/humanize.js must be in a folder called "api" at the root
→ src/App.jsx must be in a folder called "src"

Problem: Repo not showing in Vercel
Fix: Click "Adjust GitHub App Permissions" → select your repo → save → refresh

---

## HOW TO UPDATE YOUR SITE LATER

Every time you want to change something:
1. Edit the files on your computer
2. Open terminal in your project folder
3. Run:
   git add .
   git commit -m "describe your change"
   git push

Vercel auto-detects the push and redeploys in ~1 minute. You never need to touch Vercel again.

---

## COST SUMMARY

| Service       | Cost          |
|---------------|---------------|
| Groq API      | FREE          |
| Vercel hosting| FREE          |
| GitHub        | FREE          |
| Domain name   | ~$10/year (optional) |

Total monthly cost to run: $0

---

## GROQ FREE TIER LIMITS

Groq free tier gives you:
- 14,400 requests per day
- 6,000 tokens per minute

At ~500 tokens per humanization request:
= ~288 free humanizations per day

More than enough until you have real paying users.
