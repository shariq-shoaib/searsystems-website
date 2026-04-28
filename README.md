# SEAR Systems

SEAR Systems is a static GitHub Pages website for an affordable underwater reconnaissance and security platform. The site presents the mission, problem, solution, technology, team, and contact flow for pilot and partnership inquiries.

Live site: https://shariq-shoaib.github.io/searsystems-website/

## What’s Included

- Mission-focused homepage with a guided story flow
- Dedicated pages for problem, solution, technology, advantages, team, and contact
- Responsive design with animated reveals and consistent navigation
- Static contact form powered by Formspree

## Contact Form

The contact form does not use a backend or SMTP credentials. It submits safely through Formspree.

The form is connected to your inbox only: `contact.searsystems@gmail.com`.

Configured Formspree endpoint:
- `https://formspree.io/f/mwvagojn`

Example:

```html
<meta name="contact-form-endpoint" content="https://formspree.io/f/mwvagojn" />
```

## Deployment

This project is designed for GitHub Pages.

GitHub Pages settings:
1. Settings → Pages
2. Source: Deploy from a branch
3. Branch: `main`
4. Folder: `/(root)`

## Project Structure

- [index.html](index.html)
- [contact.html](contact.html)
- [problem.html](problem.html)
- [solution.html](solution.html)
- [technology.html](technology.html)
- [advantages.html](advantages.html)
- [team.html](team.html)
- [site.js](site.js)
- [styles.css](styles.css)
- [images/](images/)

## Notes

- No backend files are required.
- No `.env` file or private SMTP credentials are used.
- All pages use relative paths so the site works correctly on GitHub Pages.

## Brand Summary

SEAR Systems focuses on practical underwater reconnaissance for maritime missions, combining sonar-led detection, semi-autonomous operation, and operator control to support safer route planning and field validation.
