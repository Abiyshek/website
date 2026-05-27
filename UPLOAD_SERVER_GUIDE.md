# 🚀 Automated Upload Server Guide

## What's New?

Everything is now **100% automated**! No more manual steps. Just:
1. Start the upload server (one command)
2. Select files in Admin Panel
3. Click Upload
4. Done! ✅

---

## 🎯 Quick Start (2 Steps)

### Step 1: Start Upload Server
In one terminal, run:
```bash
npm run upload-server
```

You'll see:
```
╔═══════════════════════════════════════════════╗
║       🚀 UPLOAD SERVER RUNNING                ║
║       http://localhost:5000                   ║
╚═══════════════════════════════════════════════╝
```

### Step 2: Start React App
In another terminal, run:
```bash
npm start
```

---

## 🎬 Adding Videos

1. Go to Admin Panel → **Add Videos** tab
2. Select one or more video files (drag & drop or click)
3. Click `✅ Upload Videos`
4. Wait for success message...
5. **Videos appear in "Newly Added Videos" section automatically!** ⭐

**What happens automatically:**
- ✅ Files saved to `src/assets/videos/`
- ✅ Data added to `src/data/videoData.js`
- ✅ Thumbnails extracted (first frame)
- ✅ App rebuilt
- ✅ Content appears with ⭐ NEW badge

---

## 📸 Adding Photos

1. Go to Admin Panel → **Add Photos** tab
2. Select category (or leave as "new")
3. Select one or more photo files
4. Click `✅ Upload Photos`
5. Wait for success message...
6. **Photos appear in "Newly Added Photos" section automatically!** ⭐

**What happens automatically:**
- ✅ Files saved to `src/assets/gallery/{category}/`
- ✅ Data added to `src/data/galleryData.js`
- ✅ App rebuilt
- ✅ Content appears with ⭐ NEW badge

---

## 👤 Adding Players

1. Go to Admin Panel → **Add Players** tab
2. Fill in player details:
   - Name *
   - Role *
   - Description (optional)
   - Image URL (optional)
3. Click "Add Player to List"
4. Repeat for more players
5. Click `✅ Upload Players`
6. Wait for success message...
7. **Players appear in "Newly Added Players" section automatically!** ⭐

**What happens automatically:**
- ✅ Data added to `src/data/playerProfilesData.js`
- ✅ App rebuilt
- ✅ Content appears with ⭐ NEW badge

---

## 🔧 How It Works

### Backend Server (upload-server.js)
- Runs on `http://localhost:5000`
- Handles file uploads with `multer`
- Auto-updates data files (`.js` files)
- Auto-runs thumbnail extraction for videos
- Auto-builds React app (`npm run build`)

### Admin Panel (React)
- Sends file uploads to the server
- Shows real-time upload status
- Displays success/error messages

### Complete Workflow
```
User selects files
        ↓
Clicks "Upload" button
        ↓
Files sent to upload-server
        ↓
Server saves files to correct folders
        ↓
Server updates data files with imports + entries
        ↓
Server runs thumbnail extraction (videos only)
        ↓
Server runs npm build
        ↓
Success! Return message to Admin Panel
        ↓
User sees "✅ Done!" and content appears instantly
```

---

## ⚠️ Troubleshooting

### "Upload failed: Cannot connect to server"
- Make sure upload server is running: `npm run upload-server`
- Check if port 5000 is in use: `netstat -ano | findstr 5000`

### "Upload succeeded but content doesn't appear"
- Wait a few seconds (build process takes time)
- Refresh the browser (F5)
- Check browser console for errors (F12)

### "Error: No files uploaded"
- Make sure you actually selected files
- Try drag-and-drop or file picker

### Build keeps failing
- Check terminal running upload-server for error messages
- Make sure all required npm packages are installed: `npm install --legacy-peer-deps`

---

## 📝 Advanced: Manual File Management

If you prefer manual control, you can:

1. **Manually add video:**
   ```bash
   echo "your video content" > src/assets/videos/my_video.mp4
   npm run extract:thumbnails
   npm run build
   ```

2. **Manually add photo:**
   ```bash
   echo "your photo content" > src/assets/gallery/new/my_photo.jpg
   npm run build
   ```

3. **Manually add player:**
   Edit `src/data/playerProfilesData.js` and add entry with `isNew: true`

---

## 🎉 Features

✅ **One-Click Upload** - No manual steps  
✅ **Automatic Thumbnails** - For videos  
✅ **Automatic Rebuild** - App updates instantly  
✅ **Automatic IDs** - No manual ID management  
✅ **Automatic Data Updates** - `.js` files updated automatically  
✅ **NewlyAdded Section** - With ⭐ badge  
✅ **Multi-Select** - Upload many files at once  
✅ **Real-Time Status** - See what's happening  

---

## 🚀 Tips

1. **Keep upload-server running** - Open it in a separate terminal
2. **Check browser refresh** - Sometimes you need F5 after upload
3. **Monitor build process** - Larger videos might take longer to process
4. **Use "new" category** - Safer than choosing specific category for photos

---

## 📞 Support

If something breaks:
1. Check upload-server terminal for error messages
2. Look at browser console (F12 → Console)
3. Try restarting both servers:
   - Stop upload-server (Ctrl+C)
   - Stop React app (Ctrl+C)
   - Run `npm run upload-server` and `npm start` again

---

**Happy uploading!** 🎉
