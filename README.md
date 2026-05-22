# Shravas Consultancy & Services — Website

Production-ready website for **Shravas Consultancy & Services**, a Quality Assurance and
Merchandising consultancy based in Noida, India.

## 🗂 Project Structure

```
shravas-website/
│
├── index.html              ← All HTML (semantic, BEM, accessible)
├── style.css               ← All CSS (custom properties, BEM, responsive)
├── script.js               ← All JavaScript (modular, no dependencies)
│
├── .nojekyll               ← Required for GitHub Pages
├── README.md               ← This file
│
└── assets/
    ├── images/
    │   ├── logo.png              ← Navbar logo (transparent bg)
    │   ├── logo-footer.png       ← Footer logo (gold-tinted)
    │   ├── logo-watermark.png    ← Hero watermark (semi-transparent)
    │   ├── favicon.png           ← Browser tab icon
    │   └── og-image.jpg          ← Social share image (1200×630 recommended)
    ├── icons/                    ← (reserved for future SVG icon sprites)
    └── fonts/                    ← (reserved for self-hosted fonts)
```

## 🚀 Deploy on GitHub Pages

1. Push this folder to a GitHub repository
2. Go to **Settings → Pages**
3. Set source to **main branch / root**
4. Your site will be live at `https://<username>.github.io/<repo>/`

## ⚙️ Google Sheet Form Integration

Replace `YOUR_SCRIPT_ID` in `script.js` (`CONFIG.SHEET_URL`) with your
deployed Google Apps Script Web App URL.

See the [Apps Script setup guide](https://avinash7007.github.io/shravas-website/)
for full instructions.

## 🛠 Tech Stack

- Pure HTML5, CSS3, Vanilla JavaScript — zero dependencies
- Google Fonts (Playfair Display + DM Sans)
- IntersectionObserver for scroll animations
- Google Apps Script for form-to-sheet integration

## 📞 Auther

**Avinash Dubey** · +91 7007682626 · dubeyavinash157@gmail.com

