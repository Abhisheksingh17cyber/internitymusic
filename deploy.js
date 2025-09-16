const fs = require('fs').promises;
const path = require('path');

async function deployToGitHubPages() {
    console.log('🚀 Deploying INTERNITY MUSIC to GitHub Pages...');
    
    try {
        // Copy index.html to root for GitHub Pages
        const sourcePath = path.join(__dirname, 'frontend', 'public', 'index.html');
        const targetPath = path.join(__dirname, 'index.html');
        
        await fs.copyFile(sourcePath, targetPath);
        console.log('✅ Copied index.html to root directory');
        
        // Copy JS files
        const jsDir = path.join(__dirname, 'js');
        await fs.mkdir(jsDir, { recursive: true });
        
        const musicApiSource = path.join(__dirname, 'js', 'music-api.js');
        const musicApiTarget = path.join(jsDir, 'music-api.js');
        
        try {
            await fs.copyFile(musicApiSource, musicApiTarget);
            console.log('✅ Copied music-api.js');
        } catch (error) {
            console.log('⚠️ music-api.js not found, skipping');
        }
        
        // Copy database files
        const dbDir = path.join(__dirname, 'database');
        await fs.mkdir(dbDir, { recursive: true });
        
        const dbSource = path.join(__dirname, 'database', 'music_database.json');
        const dbTarget = path.join(dbDir, 'music_database.json');
        
        try {
            await fs.copyFile(dbSource, dbTarget);
            console.log('✅ Copied music_database.json');
        } catch (error) {
            console.log('⚠️ music_database.json not found, skipping');
        }
        
        // Copy database viewer
        const viewerSource = path.join(__dirname, 'database-viewer.html');
        const viewerTarget = path.join(__dirname, 'database-viewer.html');
        
        try {
            await fs.copyFile(viewerSource, viewerTarget);
            console.log('✅ Copied database-viewer.html');
        } catch (error) {
            console.log('⚠️ database-viewer.html not found, skipping');
        }
        
        // Create enhanced README for GitHub Pages
        const readmeContent = `# INTERNITY MUSIC 🎵

## Free Music Streaming Platform with Real Artist Database

A completely **ad-free** and **donation-free** music streaming platform featuring **real artist tracks** from around the world!

### ✨ NEW: Real Artist Database
- � **Authentic Tracks** from Taylor Swift, Ed Sheeran, Drake, BTS, Arijit Singh & more
- 📊 **50+ Real Songs** from major artists across multiple genres
- 🌍 **Global Artists** from USA, India, UK, South Korea, and more
- 🔍 **Enhanced Search** by artist, album, or track name

### Features:
- 🚫 **Completely Free** - No payments, ads, or donations ever
- � **Real Music Database** - Authentic artist tracks with metadata
- 🔀 **Smart Playlists** - Non-repeating, diverse music selection
- ❤️ **Like System** - Save your favorite songs
- 🎧 **High Quality Audio** - Great sound quality
- 📱 **Mobile Responsive** - Works perfectly on all devices

### Live Demo:
🔗 **[Try INTERNITY MUSIC Now!](https://abhisheksingh17cyber.github.io/internitymusic/)**

---

*Enjoy unlimited free music streaming from around the world! 🌟*
`;
        
        await fs.writeFile(path.join(__dirname, 'README.md'), readmeContent);
        console.log('✅ Updated README.md for GitHub Pages');
        
        console.log('\n🎉 Deployment files prepared!');
        console.log('\n📝 Next steps:');
        console.log('1. Commit and push these changes');
        console.log('2. Enable GitHub Pages in repository settings');
        console.log('3. Your site will be live at: https://abhisheksingh17cyber.github.io/internitymusic/');
        
    } catch (error) {
        console.error('❌ Deployment failed:', error);
    }
}

deployToGitHubPages();