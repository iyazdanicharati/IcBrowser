# IcBrows Browser

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-ISC-green.svg)
![Platform](https://img.shields.io/badge/platform-Windows-lightgrey.svg)
![Electron](https://img.shields.io/badge/electron-39.2.6-blue.svg)

**A customizable browser for companies and local networks with custom DNS support**

[Features](#features) • [Installation](#installation) • [Building](#building) • [Usage](#usage) • [Configuration](#configuration)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Building from Source](#building-from-source)
- [Usage](#usage)
- [Configuration](#configuration)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Technical Details](#technical-details)
- [Contributing](#contributing)
- [License & Copyright](#license--copyright)

## 🎯 Overview

IcBrows is a lightweight, customizable web browser built with Electron.js, designed specifically for small companies and local networks. It provides advanced DNS configuration, local domain resolution, and company branding capabilities while maintaining a clean, modern interface.

### Key Highlights

- **Portable Executable** - No installation required, runs directly from `.exe` file
- **Custom DNS** - Configure custom DNS servers and DNS-over-HTTPS (DoH)
- **Local Network Support** - Map local domain names to IP addresses
- **Tabbed Browsing** - Multiple tabs with session persistence
- **Company Branding** - Customize homepage, bookmarks, and company name
- **Privacy Focused** - No Electron traces in executable metadata

## ✨ Features

### Core Features

- ✅ **Multi-Tab Support** - Open multiple URLs simultaneously
- ✅ **Session Persistence** - Automatically restores tabs on restart
- ✅ **Custom DNS Configuration** - Use custom DNS servers or DNS-over-HTTPS
- ✅ **Local Domain Resolution** - Map internal domains (e.g., `server.local` → `192.168.1.100`)
- ✅ **Company Customization** - Custom homepage, bookmarks, and branding
- ✅ **Font Customization** - Choose from 20+ font families
- ✅ **Visual Loading Indicators** - Spinner in tabs and colorized status bar
- ✅ **Frameless Window** - Custom window controls with modern UI

### Advanced Features

- 🔒 **DNS-over-HTTPS (DoH)** - Secure DNS queries with multiple provider options
- 🌐 **Local Network Domains** - Perfect for company intranets
- 💾 **Session Management** - Remembers your browsing session
- 🎨 **UI Customization** - Custom fonts and company branding
- ⌨️ **Keyboard Shortcuts** - Full keyboard navigation support

## 📦 Installation

### Portable Version (Recommended)

1. Download the latest release: `IcBrows-1.0.0-portable.exe`
2. Run the executable - no installation required
3. The browser will create a settings file in your user data directory

### System Requirements

- **OS**: Windows 10/11 (64-bit)
- **RAM**: 2GB minimum (4GB recommended)
- **Disk Space**: ~150MB for the portable executable
- **Network**: Internet connection for web browsing

## 🔨 Building from Source

### Prerequisites

- Node.js 16.x or higher
- npm 8.x or higher
- Windows 10/11 (for Windows builds)

### Build Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd IcBrows
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Add custom icon (optional)**
   - Place your `.ico` file at `build/icon.ico`
   - See `build/README-ICON.md` for details

4. **Build portable executable**
   ```bash
   npm run build:win
   ```

5. **Find your executable**
   - Location: `dist/IcBrows-1.0.0-portable.exe`
   - Size: ~85-90 MB (includes all dependencies)

### Build Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Run in development mode |
| `npm run build:win` | Build portable Windows executable |
| `npm run build:win:dir` | Build to directory (for testing) |
| `npm run build` | General build command |

## 🚀 Usage

### First Launch

1. Run `IcBrows-1.0.0-portable.exe`
2. The browser opens with your configured homepage (default: Google)
3. Start browsing immediately

### Basic Navigation

- **Address Bar**: Type URLs or search queries
- **Tabs**: Click the `+` button or press `Ctrl+T` to create new tabs
- **Close Tabs**: Click the `×` on a tab or press `Ctrl+W`
- **Settings**: Click the `⚙` button in the navigation bar

### Configuration

Access settings via the ⚙ button in the navigation bar:

1. **DNS Configuration**
   - Enable custom DNS servers
   - Configure DNS-over-HTTPS
   - Set up local domain mappings

2. **Company Customization**
   - Set company name
   - Configure homepage URL
   - Add bookmarks

3. **UI Settings**
   - Select font family
   - Customize appearance

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+T` / `Cmd+T` | New tab |
| `Ctrl+W` / `Cmd+W` | Close current tab |
| `Ctrl+Tab` / `Ctrl+PageDown` | Next tab |
| `Ctrl+Shift+Tab` / `Ctrl+PageUp` | Previous tab |
| `Ctrl+1-9` | Switch to tab by number |
| `Ctrl+L` / `Cmd+L` | Focus address bar |
| `Ctrl+R` / `Cmd+R` | Reload page |
| `F5` | Reload page |
| `Alt+Left` | Go back |
| `Alt+Right` | Go forward |
| `Escape` | Close settings / Blur address bar |

## ⚙️ Configuration

### DNS Settings

Configure custom DNS servers in Settings → DNS Configuration:

- **Custom DNS Servers**: Add IP addresses (e.g., `8.8.8.8`, `1.1.1.1`)
- **DNS-over-HTTPS**: Enable DoH with providers:
  - Cloudflare
  - Google
  - Quad9
  - Custom URL

### Local Domain Resolution

Map local domain names to IP addresses:

```
server.local → 192.168.1.100
portal.company → 192.168.1.50
mail.company → 192.168.1.25
```

### Company Settings

- **Company Name**: Displayed in browser title
- **Homepage**: Default page on startup
- **Bookmarks**: Format: `Name|URL` (one per line)

### Configuration File Location

Settings are stored in:
- **Windows**: `%APPDATA%\IcBrows\config.json`
- **Session**: `%APPDATA%\IcBrows\session.json`

## 🔧 Technical Details

### Architecture

- **Framework**: Electron.js 39.2.6
- **Runtime**: Node.js (bundled)
- **Rendering**: Chromium (bundled)
- **Build Tool**: electron-builder 26.0.12

### Project Structure

```
IcBrows/
├── main.js              # Main Electron process
├── preload.js           # Preload script (security)
├── renderer.js          # Renderer process (UI logic)
├── index.html           # Main UI
├── dns-manager.js       # DNS configuration manager
├── config.json          # Default configuration
├── package.json         # Project configuration
└── build/               # Build resources
    └── icon.ico         # Application icon (optional)
```

### Security Features

- **Context Isolation**: Enabled
- **Node Integration**: Disabled in renderer
- **Preload Script**: Secure IPC communication
- **Content Security**: Webview isolation

### Performance

- **Startup Time**: ~2-3 seconds
- **Memory Usage**: ~150-200 MB per tab
- **Executable Size**: ~85-90 MB (portable)

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style
- Add comments for complex logic
- Test on Windows 10/11
- Update documentation for new features

## 📄 License & Copyright

### Copyright Notice

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║                         IcBrows Browser                                      ║
║                         Version 1.0.0                                        ║
║                                                                              ║
║                    Copyright © 2024 Your Company                             ║
║                         All Rights Reserved                                  ║
║                                                                              ║
║  This software and associated documentation files (the "Software") are      ║
║  proprietary and confidential. Unauthorized copying, modification,          ║
║  distribution, or use of this Software, via any medium, is strictly         ║
║  prohibited without the express written permission of Your Company.         ║
║                                                                              ║
║  For licensing inquiries, please contact:                                   ║
║  Email: legal@yourcompany.com                                                ║
║  Website: https://www.yourcompany.com                                       ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

### License

This software is licensed under the ISC License:

```
ISC License

Copyright (c) 2024, Your Company

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
```

### Version Information

**Current Version**: `1.0.0`  
**Release Date**: December 2024  
**Build Number**: `2024.12.11.1900`  
**Product Name**: IcBrows Browser  
**Internal Name**: IcBrows  
**File Version**: 1.0.0.0

### Trademark Notice

IcBrows™ and the IcBrows logo are trademarks of Your Company. All other
trademarks, registered trademarks, product names and company names or logos
mentioned herein are the property of their respective owners.

### Third-Party Licenses

This software includes the following open-source components:

- **Electron** - Copyright (c) Electron contributors (MIT License)
- **Chromium** - Copyright (c) The Chromium Authors (BSD License)
- **Node.js** - Copyright (c) Node.js contributors (MIT License)

See `LICENSE` file for full license details.

## 📞 Support & Contact

### Technical Support

For technical issues, questions, or feature requests:

- **GitHub Issues**: [Open an issue](https://github.com/yourcompany/icbrows/issues)
- **Email Support**: support@yourcompany.com
- **Documentation**: See `BUILD-INSTRUCTIONS.md` for build details
- **Configuration Guide**: See `config.json` for default settings

### Legal & Licensing

For licensing inquiries or legal matters:

- **Email**: legal@yourcompany.com
- **Website**: https://www.yourcompany.com/legal

### Company Information

**Your Company**  
Address: [Your Company Address]  
Phone: [Your Phone Number]  
Email: info@yourcompany.com  
Website: https://www.yourcompany.com

## 🗺️ Roadmap

### Planned Features

- [ ] Bookmarks bar
- [ ] Download manager
- [ ] History management
- [ ] Extensions support
- [ ] Proxy configuration UI
- [ ] Certificate management
- [ ] Dark mode
- [ ] Multi-language support

### Version History

#### Version 1.0.0 (Current Release) - December 2024
**Build**: 2024.12.11.1900  
**Status**: Stable Release

**Features**:
- ✅ Initial release
- ✅ Multi-tab support with session persistence
- ✅ Custom DNS configuration (DNS servers & DNS-over-HTTPS)
- ✅ Local domain resolution for company networks
- ✅ Company customization (homepage, bookmarks, branding)
- ✅ Font selection (20+ font families)
- ✅ Visual loading indicators (spinner & status bar)
- ✅ Frameless window with custom controls
- ✅ Keyboard shortcuts support
- ✅ Portable executable (no installation required)

**Technical Specifications**:
- Electron: 39.2.6
- Node.js: Bundled
- Chromium: Bundled
- Platform: Windows 10/11 (64-bit)
- Architecture: x64

**Known Issues**:
- None reported

**Upgrade Notes**:
- This is the initial release. No upgrade path required.

---

<div align="center">

**Made with ❤️ for companies and local networks**

[⬆ Back to Top](#icbrows-browser)

</div>
