const fs = require('fs');
const path = require('path');
const { app } = require('electron');

class DNSManager {
  constructor() {
    this.configPath = path.join(app.getPath('userData'), 'config.json');
    this.config = this.loadConfig();
  }

  loadConfig() {
    try {
      // Try to load from userData first, fallback to local config.json
      if (fs.existsSync(this.configPath)) {
        const data = fs.readFileSync(this.configPath, 'utf8');
        return JSON.parse(data);
      } else if (fs.existsSync(path.join(__dirname, 'config.json'))) {
        const data = fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading config:', error);
    }
    // Return default config
    return {
      dns: {
        enabled: false,
        servers: ['8.8.8.8', '8.8.4.4'],
        doh: {
          enabled: false,
          provider: 'cloudflare',
          url: 'https://cloudflare-dns.com/dns-query'
        },
        localDomains: {
          enabled: false,
          domains: {}
        }
      },
      company: {
        name: 'Company Browser',
        homepage: 'https://www.google.com',
        bookmarks: [],
        customCss: '',
        logo: ''
      },
      ui: {
        fontFamily: 'system'
      },
      network: {
        proxy: {
          enabled: false,
          host: '',
          port: '',
          type: 'http'
        }
      }
    };
  }

  saveConfig() {
    try {
      // Ensure userData directory exists
      const userDataDir = app.getPath('userData');
      if (!fs.existsSync(userDataDir)) {
        fs.mkdirSync(userDataDir, { recursive: true });
      }
      fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
      return true;
    } catch (error) {
      console.error('Error saving config:', error);
      return false;
    }
  }

  applyDNSSettings() {
    // Apply local domain mappings via host-resolver-rules
    if (this.config.dns.localDomains && this.config.dns.localDomains.enabled) {
      const domains = this.config.dns.localDomains.domains;
      const rules = [];
      
      for (const [domain, ip] of Object.entries(domains)) {
        if (domain && ip) {
          rules.push(`MAP ${domain} ${ip}`);
          // Also map www subdomain if not already specified
          if (!domains[`www.${domain}`]) {
            rules.push(`MAP www.${domain} ${ip}`);
          }
        }
      }
      
      if (rules.length > 0) {
        app.commandLine.appendSwitch('host-resolver-rules', rules.join(','));
      }
    }

    // Apply custom DNS servers
    // Note: Electron/Chromium DNS configuration is limited
    // Custom DNS servers require system-level changes or proxy configuration
    if (this.config.dns.enabled && this.config.dns.servers && this.config.dns.servers.length > 0) {
      const dnsServers = this.config.dns.servers.filter(s => s.trim()).join(',');
      if (dnsServers) {
        // Try to set DNS servers (may require admin privileges on some systems)
        app.commandLine.appendSwitch('host-resolver-rules', `DNS ${dnsServers}`);
        console.log('Custom DNS servers configured:', dnsServers);
        console.log('Note: DNS server changes may require restart and admin privileges');
      }
    }

    // Apply DNS over HTTPS if enabled
    if (this.config.dns.doh && this.config.dns.doh.enabled) {
      app.commandLine.appendSwitch('enable-features', 'dns-over-https');
      // Chromium's DoH support is limited, this enables the feature flag
      console.log('DNS over HTTPS feature enabled');
      console.log('Note: Full DoH support may require additional configuration');
    }
  }

  resolveLocalDomain(hostname) {
    if (!this.config.dns.localDomains.enabled) {
      return null;
    }

    const domains = this.config.dns.localDomains.domains;
    if (domains[hostname]) {
      return domains[hostname];
    }

    // Check for wildcard subdomains
    for (const [domain, ip] of Object.entries(domains)) {
      if (hostname.endsWith('.' + domain) || hostname === domain) {
        return ip;
      }
    }

    return null;
  }

  getConfig() {
    return this.config;
  }

  updateConfig(updates) {
    this.config = { ...this.config, ...updates };
    this.saveConfig();
  }

  updateDNSConfig(dnsConfig) {
    this.config.dns = { ...this.config.dns, ...dnsConfig };
    this.saveConfig();
  }

  updateCompanyConfig(companyConfig) {
    this.config.company = { ...this.config.company, ...companyConfig };
    this.saveConfig();
  }
}

module.exports = DNSManager;

