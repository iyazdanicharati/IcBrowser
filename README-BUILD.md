# Building IcBrows as Portable Executable

## Prerequisites

1. Install dependencies:
   ```bash
   npm install
   ```

2. Add your custom icon (optional but recommended):
   - Create or obtain an `.ico` file
   - Save it as `build/icon.ico`
   - See `build/README-ICON.md` for detailed instructions

## Building

### Build Portable Executable (Recommended)

```bash
npm run build:win
```

This will create a portable `.exe` file in the `dist/` directory:
- **Output**: `dist/IcBrows-1.0.0-portable.exe`
- **Portable**: No installation required, just run the .exe
- **No Electron traces**: Executable metadata shows "IcBrows Browser" instead of Electron

### Build Directory (for testing)

```bash
npm run build:win:dir
```

This creates the executable in a directory structure (useful for testing before creating the final portable).

### General Build

```bash
npm run build
```

## Customization

### Change Company Name

Edit `package.json`:
- Update `author` field
- Update `build.win.versionInfo.CompanyName`
- Update `build.win.versionInfo.LegalCopyright`

### Change Executable Name

Edit `package.json`:
- Update `build.win.executableName`
- Update `build.win.versionInfo.OriginalFilename`

### Change Product Name

Edit `package.json`:
- Update `productName`
- Update `build.productName`
- Update `build.win.versionInfo.ProductName` and `FileDescription`

## Output

After building, you'll find:
- **Portable executable**: `dist/IcBrows-1.0.0-portable.exe`
- **All dependencies**: Bundled inside the executable
- **No installation needed**: Just run the .exe file

## Verification

To verify the executable metadata (no Electron traces):
1. Right-click the `.exe` file
2. Select "Properties"
3. Go to "Details" tab
4. Check that it shows "IcBrows Browser" and your company name, not "Electron"

## Troubleshooting

- **Icon not showing**: Make sure `build/icon.ico` exists and is a valid ICO file
- **Build fails**: Make sure all dependencies are installed (`npm install`)
- **Large file size**: This is normal - Electron apps bundle Chromium (~100-150MB)

