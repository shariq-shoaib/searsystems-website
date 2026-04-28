# SEAR Systems Website

This repository is now a pure static website ready for GitHub Pages.
The contact form uses Formspree from the frontend (no backend, no SMTP credentials, no .env secrets).

## Contact Form Setup (Formspree)

1. Create a form at Formspree and connect your inbox email.
2. Copy your endpoint in the format:
   - https://formspree.io/f/your_real_form_id
3. Open `contact.html` and update:
   - `<meta name="contact-form-endpoint" content="https://formspree.io/f/your_real_form_id" />`
4. Commit and deploy.

Notes:
- Formspree endpoint IDs are safe to place in frontend code.
- No SMTP password or private keys are stored in this project.

## Local Preview

Open `index.html` in a browser, or use any static server.

## GitHub Pages Deployment

1. Push this repository to GitHub.
2. In GitHub repo settings:
   - Settings -> Pages
   - Build and deployment -> Source: Deploy from a branch
   - Branch: main
   - Folder: /(root)
3. Save and wait for deployment.

## Exact Git Commands

Run these commands in project root:

1. Initialize repository
   - git init
2. Set default branch
   - git branch -M main
3. Stage files
   - git add .
4. First commit
   - git commit -m "Convert site to static GitHub Pages with Formspree contact form"
5. Add GitHub remote
   - git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
6. Push to GitHub
   - git push -u origin main

If remote already exists:
- git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

## Pre-Deployment Checklist (GitHub Pages)

- `index.html` exists at repository root.
- All links and asset paths are relative (no leading slash paths for local files).
- No backend runtime files are required.
- No `.env` or secrets are committed.
- Contact endpoint in `contact.html` is set to your real Formspree form ID.

## Final Production Structure

Expected static structure:

- index.html
- contact.html
- problem.html
- solution.html
- technology.html
- advantages.html
- team.html
- site.js
- styles.css
- README.md
- .gitignore
- images/
  - sear-logo.png
  - AliMurtaza.jpg
  - Safwan.jpeg
  - Shariq.jpeg
  - Okasha.jpeg
