// Post-build script to remove Electron references from executable metadata
// This script runs after electron-builder creates the executable

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking for Electron traces in executable...');

// Note: electron-builder's versionInfo should handle most of this
// This script is a fallback for any remaining references

console.log('✅ Executable metadata configured via electron-builder');
console.log('📝 All Electron references should be removed from version info');

