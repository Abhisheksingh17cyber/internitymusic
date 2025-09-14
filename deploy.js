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
        
        // Create a simple README for GitHub Pages
        const readmeContent = `# INTERNITY MUSIC 🎵

## Free Global Music Streaming Platform

A completely **ad-free** and **donation-free** music streaming platform that brings you music from around the world!

### Features:
- 🌍 **Global Music Collection** - Music from every culture
- 🎵 **Completely Free** - No payments or ads ever
- 🎧 **High Quality Audio** - Great sound quality
- ❤️ **Like System** - Save your favorite songs
- 🔍 **Genre Filtering** - Discover by genre
- 📱 **Mobile Responsive** - Works on all devices

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