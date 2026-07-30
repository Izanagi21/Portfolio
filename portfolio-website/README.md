# Jaymark Talento Portfolio

A responsive single-page portfolio inspired by the supplied blue-and-white
reference design.

## Included

- Responsive floating navigation and active-section highlighting
- Light/dark mode with `localStorage` persistence
- AOS scroll animations
- Animated portfolio statistics
- Intersection Observer skill progress bars
- Education and work qualification tabs
- Swiper project carousel
- Validated Formspree-ready contact form
- Google Maps embed
- Lucide interface icons and Devicon technology logos

## Add your profile photo

1. Save your photo as `assets/images/profile-photo.png`.
2. Find the `YOUR PHOTO GOES HERE` comment in `index.html`.
3. Replace the empty `.profile-photo-slot` element with:

```html
<img src="assets/images/profile-photo.png" alt="Your full name">
```

## Add your résumé

1. Save your PDF inside `assets/resume/`.
2. Find `id="resume-button"` in `index.html`.
3. Replace `href="#"` with your PDF path and add `download`:

```html
<a id="resume-button" href="assets/resume/Your_Resume.pdf" download>
```

## Activate the contact form

Create a Formspree form, copy its endpoint, and place it in the contact form's
empty `action` attribute:

```html
<form id="contact-form" action="https://formspree.io/f/your-id" method="POST">
```

## Update your details

Replace the sample name, biography, education, contact information, skills,
project links, and social links in `index.html`.

## Open the website

Open `index.html` in a browser. The site uses Tailwind CSS, Lucide, Devicon,
AOS, and Swiper through CDNs, so an internet connection is required for those
libraries.
