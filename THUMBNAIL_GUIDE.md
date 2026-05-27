# Thumbnail Setup Guide

## Option 1: Add Custom Thumbnails (Recommended)

### What You Need:
- Thumbnail images (JPG or PNG)
- Size: 300x200 pixels (or similar aspect ratio)
- One thumbnail per video

### How to Add:

1. **Create Your Thumbnails**:
   - Take a screenshot from each video at a key moment
   - Use online tools: https://video-screenshot.com
   - Or use video editing software (DaVinci, CapCut, etc.)

2. **Name Thumbnails to Match Videos**:
   ```
   Video File: IMG_0911.MOV
   Thumbnail:  IMG_0911.jpg
   
   Video File: coaching-tips.mp4
   Thumbnail:  coaching-tips.jpg
   ```

3. **Place in Thumbnails Folder**:
   ```
   src/assets/videos/
   └── thumbnails/
       ├── IMG_0911.jpg
       ├── IMG_2879.jpg
       ├── IMG_2892.jpg
       └── ... (add all thumbnails)
   ```

4. **Regenerate Video Data**:
   ```bash
   npm run generate:videos
   ```

---

## Option 2: Use FFmpeg to Auto-Generate (Advanced)

### Install FFmpeg:
- **Windows**: https://ffmpeg.org/download.html or `choco install ffmpeg`
- **Mac**: `brew install ffmpeg`
- **Linux**: `sudo apt install ffmpeg`

### Generate Thumbnails:
```bash
npm run generate:thumbnails
npm run generate:videos
```

---

## Option 3: Online Thumbnail Generators

Use these free services to generate one thumbnail at a time:
- **Video Screenshot**: https://video-screenshot.com
- **Ezgif**: https://ezgif.com/video-to-jpg
- **CloudConvert**: https://cloudconvert.com

---

## Current Thumbnail Status:

Your videos currently use placeholder thumbnails. Add custom thumbnails by following **Option 1** above to make your video gallery look professional! 

```
src/assets/videos/thumbnails/
├── 22c63923-1145-458b-ae57-d85bd8791439.jpg  ← Add thumbnail here
├── 6a92f3eb-8a2c-4c84-a076-1d7492f417ea.jpg  ← Add thumbnail here
├── IMG_0911.jpg                               ← Add thumbnail here
├── IMG_2879.jpg                               ← Add thumbnail here
└── ... (11 total)
```

Once you add thumbnails, run:
```bash
npm run generate:videos
```

And your gallery will show the real thumbnails! 🎬
