# Formspree Setup (2-minute process)

This site uses Formspree to handle contact form submissions safely without backend code.

## Step 1: Create Formspree Form

1. Go to https://formspree.io
2. Click **Sign Up** (or login if you have an account)
3. Use your email: `contact.searsystems@gmail.com`
4. Verify your email (check inbox)
5. Click **New Form**
6. Choose a name like "SEAR Contact Form"
7. Add recipient email: `contact.searsystems@gmail.com`
8. Click **Create**
9. You'll get a form ID like: `xyzabc123`

## Step 2: Update contact.html

Copy your form ID and update this file:

In `contact.html`, find:
```html
<meta name="contact-form-endpoint" content="https://formspree.io/f/your_form_id" />
```

Replace `your_form_id` with your actual ID, for example:
```html
<meta name="contact-form-endpoint" content="https://formspree.io/f/xyzabc123" />
```

## Step 3: Commit and Deploy

```bash
git add contact.html
git commit -m "Add Formspree form ID to contact form"
git push origin main
```

GitHub Pages will auto-deploy within 1 minute.

## Test Form Submission

Visit your GitHub Pages URL and fill out the contact form. You should receive an email confirmation that the form was submitted.
