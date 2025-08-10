# Book Manifest Update Guide

This guide will help you update the book list and manifest for the Deen Mastery Digital Library.

## Overview

The library uses two possible data sources for books:
1. `public/manifest.json` (preferred)
2. `public/categories.json` (fallback)

## File Structure

Each book entry should have the following structure:

\`\`\`json
{
  "id": 1,
  "title_ar": "Arabic Title",
  "title_en": "English Title",
  "author_ar": "Arabic Author Name",
  "author_en": "English Author Name", 
  "filename": "book-file.epub",
  "filename_ar": "arabic-book-file.epub",
  "filename_en": "english-book-file.epub",
  "coverText": "Brief description",
  "type": "epub",
  "source": "shamela",
  "category": "Category Name",
  "featured": false
}
\`\`\`

## Required Fields

- `id`: Unique identifier (number)
- `title_ar`: Arabic title (string)
- `author_ar`: Arabic author (string)
- `filename`: Main EPUB filename (string)
- `category`: Book category (string)
- `type`: File type, usually "epub" (string)

## Optional Fields

- `title_en`: English title
- `author_en`: English author
- `filename_ar`: Arabic-specific EPUB file
- `filename_en`: English-specific EPUB file
- `coverText`: Brief description
- `source`: Source corpus (e.g., "shamela")
- `featured`: Boolean for featured books

## Step-by-Step Update Process

### 1. Prepare Your EPUB Files

1. Place all EPUB files in the `public/epubs/` directory
2. Ensure filenames match exactly what you'll put in the manifest
3. Test that files are accessible at `/epubs/filename.epub`

### 2. Update the Manifest

1. Open `public/manifest.json` (or create it if it doesn't exist)
2. Add your new book entries following the structure above
3. Ensure each book has a unique `id`
4. Validate the JSON syntax

### 3. Categories

The system automatically extracts categories from your book data. Common categories include:
- Hadith
- Fiqh
- Tafsir
- Aqeedah
- Seerah
- Arabic Language
- Islamic History

### 4. Validation Checklist

Before publishing, verify:

- [ ] All EPUB files are in `public/epubs/`
- [ ] JSON syntax is valid
- [ ] All required fields are present
- [ ] IDs are unique
- [ ] Filenames match actual files
- [ ] Categories are consistent

### 5. Testing

1. Load the website locally
2. Check that new books appear in the library
3. Test book opening and reading
4. Verify search and filtering work
5. Test both Arabic and English modes

## Example Manifest Entry

\`\`\`json
{
  "id": 123,
  "title_ar": "صحيح البخاري",
  "title_en": "Sahih al-Bukhari",
  "author_ar": "محمد بن إسماعيل البخاري",
  "author_en": "Muhammad ibn Ismail al-Bukhari",
  "filename": "sahih-bukhari.epub",
  "filename_ar": "sahih-bukhari-ar.epub", 
  "filename_en": "sahih-bukhari-en.epub",
  "coverText": "The most authentic collection of Prophetic traditions",
  "type": "epub",
  "source": "shamela",
  "category": "Hadith",
  "featured": true
}
\`\`\`

## Common Issues and Solutions

### Books Not Appearing
- Check JSON syntax with a validator
- Verify file paths are correct
- Ensure the manifest is in the right location

### Books Won't Open
- Verify EPUB files are valid
- Check filename spelling matches manifest
- Ensure files are in `public/epubs/` directory

### Search Not Working
- Verify title and author fields are populated
- Check for special characters that might break search

### Categories Missing
- Ensure category field is consistent across books
- Check for typos in category names

## Advanced Features

### Multi-language Support
- Use `filename_ar` and `filename_en` for language-specific versions
- Provide both `title_ar`/`title_en` and `author_ar`/`author_en`

### Featured Books
- Set `featured: true` for books to highlight
- Featured books may appear first in listings

### Word-by-Word Translation
- Ensure Arabic EPUB files have proper text encoding
- The system will automatically add hover translations for Arabic words

## Deployment

After updating the manifest:

1. Test locally first
2. Commit changes to your repository
3. Deploy to your hosting platform
4. Verify the live site works correctly

## Troubleshooting

If you encounter issues:

1. Check browser console for errors
2. Verify network requests are successful
3. Test with a minimal manifest first
4. Ensure EPUB files are properly formatted

## Contact

For technical support with manifest updates, contact the development team through the website's contact form.
