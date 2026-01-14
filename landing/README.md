# Fleet Manager Landing Page

A beautiful, modern landing page for the Fleet Manager application built with pure HTML, CSS, and JavaScript.

## Features

- **Responsive Design**: Works perfectly on all devices (mobile, tablet, desktop)
- **World Vision Orange Theme**: Matches your project's brand colors (rgb(255, 107, 0))
- **Smooth Animations**: Scroll-triggered animations and parallax effects
- **Modern UI**: Glassmorphism, gradients, and premium design aesthetics
- **SEO Optimized**: Proper meta tags and semantic HTML structure

## Files

- `index.html` - Main HTML structure
- `styles.css` - All styling with World Vision Orange theme
- `script.js` - Interactive features and animations
- `README.md` - This file

## How to Use

### Option 1: Open Locally
Simply open `index.html` in your web browser by double-clicking the file.

### Option 2: Use with a Local Server
For the best experience, serve the files with a local web server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (http-server)
npx http-server

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000` in your browser.

### Option 3: Deploy to Production
You can deploy this landing page to any static hosting service:

- **Vercel**: Drag and drop the `landing` folder
- **Netlify**: Connect to your GitHub repo or drag and drop
- **GitHub Pages**: Push to a `gh-pages` branch
- **Any web hosting**: Upload via FTP to your server

## Links in the Page

The landing page includes the following important links:

1. **Web App**: https://wvz.vercel.app/
2. **Sign In**: https://wvz.vercel.app/auth/login
3. **Sign Up**: https://wvz.vercel.app/auth/signup
4. **APK Download**: `app-debug.apk` (the APK file is in the same directory)

## Customization

### Colors
The theme colors are defined in `styles.css` under `:root`:
- `--primary`: rgb(255, 107, 0) (World Vision Orange)
- `--sidebar`: rgb(25, 35, 80) (Deep Blue)

### Content
Edit `index.html` to update:
- Hero title and description
- Features list
- Portal information
- Contact details
- Footer links

### APK Download
To enable APK downloads:
1. Place your `app-debug.apk` file in the `landing` folder
2. The download link is already configured in the HTML

## Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers

## Performance

- No external dependencies (except Google Fonts)
- Optimized CSS with minimal file size
- Smooth 60fps animations
- Fast load times

## License

Part of the Fleet Manager project.
