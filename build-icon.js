// Script to create a simple placeholder icon if none exists
// This is a temporary solution - replace with your actual icon

const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, 'build');
const iconPath = path.join(buildDir, 'icon.ico');

// Create build directory if it doesn't exist
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

// Check if icon exists
if (!fs.existsSync(iconPath)) {
  console.log('⚠️  No icon.ico found in build/ directory');
  console.log('📝 Please add your custom icon.ico file to build/icon.ico');
  console.log('📖 See build/README-ICON.md for instructions');
  console.log('');
  console.log('💡 For now, electron-builder will use a default icon.');
  console.log('   You can build without an icon, but it\'s recommended to add one.');
}

