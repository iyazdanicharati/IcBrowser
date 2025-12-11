# Quick Build Instructions

## Step 1: Add Custom Icon (Optional)

Place your icon file at: `build/icon.ico`

If you don't have an icon, the build will still work but use a default icon.

## Step 2: Build Portable Executable

```bash
npm run build:win
```

## Step 3: Find Your Executable

The portable `.exe` will be in: `dist/IcBrows-1.0.0-portable.exe`

## Features

✅ **Portable** - No installation required  
✅ **Custom Icon** - Uses your icon.ico file  
✅ **No Electron Traces** - Executable shows "IcBrows Browser" in properties  
✅ **Single File** - Everything bundled in one .exe  

## Customization

Edit `package.json` to customize:
- Company name
- Product name  
- Copyright information
- Executable name

See `README-BUILD.md` for detailed instructions.

