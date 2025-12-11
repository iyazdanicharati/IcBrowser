# Changelog

All notable changes to IcBrows Browser will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-12-11

### Added
- Initial release of IcBrows Browser
- Multi-tab browsing with tab management
- Session persistence - restores tabs and URLs on restart
- Custom DNS server configuration
- DNS-over-HTTPS (DoH) support with multiple providers
- Local domain resolution for internal networks
- Company customization (name, homepage, bookmarks)
- Font selection with 20+ font options
- Loading indicators (spinner in tabs, colorized status bar)
- Keyboard shortcuts for efficient navigation
- Frameless window with custom window controls
- Portable executable build (no installation required)
- Settings UI for all configuration options
- URL bar with search functionality
- Navigation controls (back, forward, reload)

### Technical
- Electron 39.2.6 framework
- Windows portable executable format
- Configuration persistence
- Session data storage
- Custom executable metadata (no Electron traces)

### Security
- Context isolation enabled
- Node integration disabled
- Secure IPC communication
- No telemetry or tracking

---

## [Unreleased]

### Planned Features
- Bookmark manager UI
- Download manager
- History viewer
- Print functionality
- Developer tools integration
- Theme customization
- Extension support (future consideration)

---

[1.0.0]: https://github.com/yourcompany/icbrows/releases/tag/v1.0.0

