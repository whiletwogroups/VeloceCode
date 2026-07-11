export const week18 = {
  "phase": 4,
  "week": 18,
  "title": "DevOps Deployment Essentials (Nginx, PM2, SSL, DNS)",
  "goal": "Configure Nginx servers, set up reverse proxies, secure domains with HTTPS/SSL, and run servers under PM2 process managers.",
  "days": [
    {
      "day": "Mon",
      "learn": "Nginx web server installation, configuration directories (/etc/nginx/sites-available), basic HTML hosting",
      "build": "Install Nginx on a Linux instance, create custom server blocks, and host static HTML pages",
      "learnLinks": [
        {
          "label": "Nginx Beginner Guide",
          "url": "http://nginx.org/en/docs/beginners_guide.html",
          "type": "doc"
        },
        {
          "label": "Nginx Configuration Walkthrough",
          "url": "https://www.youtube.com/watch?v=9t9Mp0BGnyI",
          "type": "video"
        }
      ],
      "buildLinks": [
        {
          "label": "Nginx Config Generator",
          "url": "https://www.digitalocean.com/community/tools/nginx",
          "type": "doc"
        }
      ]
    },
    {
      "day": "Tue",
      "learn": "Nginx reverse proxy, request header forwarding (X-Forwarded-For, X-Real-IP, Host)",
      "build": "Route incoming web request traffic from port 80 to internal Node.js port 3000/5000",
      "learnLinks": [
        {
          "label": "Nginx Reverse Proxy Guide",
          "url": "https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/",
          "type": "doc"
        },
        {
          "label": "Nginx Reverse Proxy Video",
          "url": "https://www.youtube.com/watch?v=JKxlhsZX0d4",
          "type": "video"
        }
      ],
      "buildLinks": [
        {
          "label": "Proxy Pass Configuration",
          "url": "https://linuxize.com/post/nginx-reverse-proxy/",
          "type": "doc"
        }
      ]
    },
    {
      "day": "Wed",
      "learn": "DNS records mapping (A, CNAME, TXT), Let's Encrypt CA validation, Certbot SSL automation",
      "build": "Map a domain name to server IP, install Certbot, and generate SSL certificates for HTTPS access",
      "learnLinks": [
        {
          "label": "DNS Records Explained",
          "url": "https://www.cloudflare.com/learning/dns/dns-records/",
          "type": "doc"
        },
        {
          "label": "Certbot & SSL Walkthrough",
          "url": "https://www.youtube.com/watch?v=UqI57K9Xg68",
          "type": "video"
        },
        {
          "label": "Certbot Official Documentation",
          "url": "https://certbot.eff.org/",
          "type": "doc"
        }
      ],
      "buildLinks": [
        {
          "label": "Let's Encrypt SSL Check",
          "url": "https://www.ssllabs.com/ssltest/",
          "type": "doc"
        }
      ]
    },
    {
      "day": "Thu",
      "learn": "PM2 node process manager: clustering, background daemons, monitoring logs, startup scripts",
      "build": "Expose your Node REST API in background using PM2 daemon processes, configure systemd launch hooks",
      "learnLinks": [
        {
          "label": "PM2 Quick Start Guide",
          "url": "https://pm2.keymetrics.io/docs/usage/quick-start/",
          "type": "doc"
        },
        {
          "label": "PM2 Daemon Manager Video",
          "url": "https://www.youtube.com/watch?v=Jm2q2_6nF80",
          "type": "video"
        }
      ],
      "buildLinks": [
        {
          "label": "PM2 CLI Command Reference",
          "url": "https://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/",
          "type": "doc"
        }
      ]
    },
    {
      "day": "Fri",
      "learn": "Server security configurations, Uncomplicated Firewall (UFW), blocking raw IP requests, DDoS shielding",
      "build": "Enable UFW firewall rules, restrict ports to SSH and HTTP/S, and secure proxy servers",
      "learnLinks": [
        {
          "label": "DevOps Full Course 2026 — Beginner to Advanced",
          "url": "https://www.youtube.com/watch?v=h4Sl21mgoM4",
          "type": "video"
        },
        {
          "label": "Server Security Checklist",
          "url": "https://github.com/imthenachoman/How-To-Secure-A-Linux-Server",
          "type": "doc"
        }
      ],
      "buildLinks": [
        {
          "label": "Fail2ban Configurations",
          "url": "https://www.fail2ban.org/",
          "type": "doc"
        }
      ]
    }
  ],
  "deliverable": "Configure reverse proxy exposed via Nginx secure server blocks under Certbot SSL encryption, with UFW restrictive firewalls."
};
