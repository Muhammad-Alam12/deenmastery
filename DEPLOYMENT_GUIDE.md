# Deen Mastery Deployment Guide

## How to Deploy Updates to Your Website

### Method 1: Using GitHub (Recommended)

1. **Make your changes locally**
   - Update books in `/public/epubs/` folder
   - Update `/public/epubs/manifest.json` with new book information
   - Update `/public/featured-books.json` if needed

2. **Commit and push to GitHub**
   \`\`\`bash
   git add .
   git commit -m "Add new books and update manifest"
   git push origin main
   \`\`\`

3. **Deploy automatically**
   - If you have GitHub Pages or Vercel connected, it will deploy automatically
   - If using Netlify, it will also auto-deploy from GitHub

### Method 2: Manual Upload (if not using Git)

1. **Build the project locally**
   \`\`\`bash
   npm run build
   \`\`\`

2. **Upload the `dist` folder contents to your web server**
   - Upload all files from the `dist` folder to your website's root directory
   - Make sure to include the `/epubs/` folder with all your books

### Method 3: Using Vercel CLI

1. **Install Vercel CLI**
   \`\`\`bash
   npm i -g vercel
   \`\`\`

2. **Deploy**
   \`\`\`bash
   vercel --prod
   \`\`\`

### Adding New Books

1. **Add EPUB files** to `/public/epubs/` folder

2. **Update manifest.json** in `/public/epubs/manifest.json`:
   \`\`\`json
   {
     "title_ar": "عنوان الكتاب بالعربية",
     "author_ar": "اسم المؤلف بالعربية", 
     "title_en": "Book Title in English",
     "author_en": "Author Name in English",
     "filename_ar": "filename-in-arabic.epub",
     "filename": "filename-in-arabic.epub",
     "category": "Category Name",
     "type": "epub",
     "id": 12345
   }
   \`\`\`

3. **Update featured books** (optional) in `/public/featured-books.json`:
   \`\`\`json
   [
     "كتاب مميز 1",
     "كتاب مميز 2"
   ]
   \`\`\`

### Important Notes

- Always use the `filename_ar` field for Arabic filenames
- Make sure EPUB files are properly formatted
- Test locally before deploying: `npm run dev`
- Categories are automatically loaded from `/public/categories.json`

### Troubleshooting

- If books don't appear, check the manifest.json format
- If categories don't work, verify category names match exactly
- For Arabic text issues, ensure proper UTF-8 encoding
- Clear browser cache after updates
