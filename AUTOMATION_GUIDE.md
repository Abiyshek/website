# 🚀 Content Management Automation Guide

Your website now has **3 automated scripts** to add content without manual coding!

---

## 📍 NEW: "Newly-Added" Sections

All content now supports **automatic "newly-added" sections** that showcase your latest additions with a ⭐ **NEW** badge:

- **📹 Videos**: Appear in "⭐ Newly Added Videos" section at the top
- **🖼️ Photos**: Appear in "⭐ Newly Added Photos" (set category to "new" or add `isNew: true`)
- **👤 Players**: Appear in "⭐ Newly Added Players" section at the top

### How to Mark Content as New:

When adding content via the Admin Panel, the form provides code snippets with **`isNew: true`** property. Just:
1. Copy the generated code
2. Add `isNew: true` to mark content as new
3. Content automatically appears in "newly-added" sections with ⭐ badge

---

## 🎬 Add a Video

Automatically uploads a video, extracts thumbnail, updates data, and builds the project.

### Command:
```bash
npm run add:video
```

### What You'll Need:
1. **Video file** uploaded to `src/assets/videos/`
2. **Video title** (e.g., "Championship Match")
3. **Video filename** (e.g., "video.mp4")

### What It Does:
✅ Asks for video details  
✅ Checks if video file exists  
✅ Updates `src/data/videoData.js` with imports  
✅ Extracts video thumbnail (first frame)  
✅ Generates video data  
✅ Builds the project  

### Code Template (with isNew):
```javascript
{
    id: NEXT_ID,
    title: 'Championship Finals 2024',
    videoUrl: championshipVideo,
    thumbnail: championshipThumb,
    isNew: true  // ⭐ Mark as new!
}
```

### Example:
```
Video Title: Championship Finals 2024
Video File Name: championship.mp4
Description: Epic match highlights

✅ Video added with ID: 12
✅ Appears in "⭐ Newly Added Videos"
```

---

## 🖼️ Add a Photo

Automatically adds a photo to a gallery category and updates the data.

### Command:
```bash
npm run add:photo
```

### What You'll Need:
1. **Photo file** uploaded to `src/assets/gallery/[CATEGORY]/`
2. **Category** (select from available folders or use "new")
3. **Photo filename** (e.g., "photo.jpg")

### What It Does:
✅ Lists all available categories  
✅ Asks which category to add to  
✅ Checks if photo file exists  
✅ Updates `src/data/galleryData.js`  
✅ Builds the project  

### Available Categories:
- Aaradhana
- Amala
- Anbuchelvi
- Arunesh
- Coach
- Dhivyesh
- Group photo
- Jenifer
- Kanmani
- Lasa honoring functions
- Lasa state rankings
- Mithun
- **new** ⭐ (automatically shows in newly-added)
- Ruhaan
- Samanatha

### Code Template (with isNew):
```javascript
{
    id: NEXT_ID,
    src: eventPhoto,
    alt: 'Event - Special Match',
    isNew: true  // ⭐ Mark as new!
}
```

### Example:
```
Select category number: 10 (or select "new")
Photo File Name: event1.jpg
Photo Title: Special Event

✅ Photo added to new category
✅ Appears in "⭐ Newly Added Photos"
```

---

## 👤 Add a Player

Automatically adds a player profile and builds the project.

### Command:
```bash
npm run add:player
```

### What You'll Need:
1. **Player name** (e.g., "John Smith")
2. **Player role** (e.g., "Coach" or "Player")
3. **Description** (achievements, specialty)
4. **Image URL** (profile picture URL)

### What It Does:
✅ Asks for player details  
✅ Updates `src/data/playerProfilesData.js`  
✅ Assigns automatic ID  
✅ Builds the project  

### Code Template (with isNew):
```javascript
{
    id: NEXT_ID,
    name: 'Rajesh Kumar',
    role: 'Head Coach',
    description: 'Head coach with 15 years experience',
    image: 'https://example.com/rajesh.jpg',
    isNew: true  // ⭐ Mark as new!
}
```

### Example:
```
Player Name: Rajesh Kumar
Player Role: Head Coach
Player Description: Head coach with 15 years experience
Player Image URL: https://example.com/rajesh.jpg

✅ Player added with ID: 13
✅ Appears in "⭐ Newly Added Players" with NEW badge
```

---

## 📋 Quick Reference

| Action | Command | Prerequisites | Mark as New |
|--------|---------|---|---|
| Add Video | `npm run add:video` | Video file in `src/assets/videos/` | Add `isNew: true` |
| Add Photo | `npm run add:photo` | Photo file in `src/assets/gallery/[CATEGORY]/` | Add `isNew: true` |
| Add Player | `npm run add:player` | None - enters data directly | Add `isNew: true` |

---

## ⚙️ How It Works Behind the Scenes

### For Videos:
1. User inputs video info
2. Script updates `src/data/videoData.js` with imports + `isNew: true`
3. Runs `npm run extract:thumbnails` (ffmpeg extracts first frame)
4. Runs `npm run generate:videos` (generates video metadata)
5. Runs `npm run build` (rebuilds React app)
6. ⭐ NEW badge automatically appears in "Newly Added Videos"

### For Photos:
1. User inputs photo info and selects category
2. Script updates `src/data/galleryData.js` with `isNew: true`
3. Runs `npm run build` (rebuilds React app)
4. ⭐ NEW badge automatically appears in gallery

### For Players:
1. User inputs player details (can add multiple)
2. Script updates `src/data/playerProfilesData.js` with `isNew: true`
3. Auto-generates next ID
4. Runs `npm run build` (rebuilds React app)
5. ⭐ NEW badge automatically appears in "Newly Added Players"

---

## 🔧 File Structure After Adding Content

```
src/
├── assets/
│   ├── videos/
│   │   ├── existing_videos/
│   │   ├── your_new_video.mp4          ← Upload here
│   │   ├── newly added/                ← Auto-shows in "newly-added"
│   │   └── thumbnails/
│   │       ├── existing_thumbnails/
│   │       └── your_new_video.jpg      ← Auto-extracted
│   └── gallery/
│       ├── new/                        ← Automatic "newly-added" category
│       │   └── your_new_photo.jpg      ← Upload here
│       ├── Aaradhana/
│       └── [Other categories...]
└── data/
    ├── videoData.js                     ← Add: { id, title, videoUrl, thumbnail, isNew: true }
    ├── galleryData.js                   ← Add: { id, src, alt, isNew: true }
    └── playerProfilesData.js            ← Add: { id, name, role, description, image, isNew: true }
```

---

## 💡 Tips & Tricks

### Before Adding Content:
1. ✅ Prepare your image/video files
2. ✅ Make sure filenames have no spaces (use-hyphens-or_underscores)
3. ✅ Keep files in the correct formats (JPG/PNG for photos, MP4/AVI for videos)

### For Best Results:
- **Videos**: Keep under 50MB for faster processing
- **Photos**: Resize to ~800x600px before uploading
- **Player Images**: Use square images (500x500px) for best display

### New Content Automatic Display:
- ⭐ Content marked with `isNew: true` automatically shows in "newly-added" sections
- 🎯 Sections appear at the top of videos, photos, and players pages
- ✨ Red ⭐ NEW badge clearly marks new content
- 📍 Old section ("All Videos/Photos/Players") displays below

### Troubleshooting:
- If build fails: Check that your file exists in the right folder
- If thumbnail missing: Make sure ffmpeg downloaded correctly
- If player images not display: Verify URL is correct and accessible
- If content not showing as "newly-added": Verify `isNew: true` is in the data file

---

## 🚀 Next Steps

1. **Prepare your content** (videos, photos, player data)
2. **Upload files** to the correct folders:
   - Videos → `src/assets/videos/`
   - Photos → `src/assets/gallery/[CATEGORY]/` or `src/assets/gallery/new/`
3. **Run the automation script**:
   - `npm run add:video`
   - `npm run add:photo`
   - `npm run add:player`
4. **Paste the generated code** into data files with `isNew: true`
5. **Done!** Your content is now live with ⭐ NEW badges

---

## 📞 Need Help?

If something goes wrong:
- Check the error message in the terminal
- Verify files are in the correct location
- Make sure filenames match what you entered
- Check internet connection (affects thumbnail extraction)
- Verify `isNew: true` is added to mark content as new

Enjoy! 🎉

