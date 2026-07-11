export const week7 = {
  "phase": 2,
  "week": 7,
  "title": "Linux Systems & Terminal Mastery",
  "goal": "Master the Linux filesystem, file permissions, user groups, processes, and basic shell navigation.",
  "days": [
    {
      "day": "Mon",
      "learn": "Filesystem hierarchy, path navigation, file viewing (ls -la, cd, pwd, mkdir -p, cat, less, nano/vim)",
      "build": "Practice terminal navigation, creating folders, writing and editing configuration files with Vim/Nano",
      "learnLinks": [
        {
          "label": "Linux Directory Structure",
          "url": "https://www.howtogeek.com/117457/htg-explains-the-linux-directory-structure-explained/",
          "type": "doc"
        },
        {
          "label": "Linux Filesystem Explained",
          "url": "https://www.youtube.com/watch?v=HbgzrKJvDRw",
          "type": "video"
        },
        {
          "label": "Vim Beginner Guide",
          "url": "https://www.youtube.com/watch?v=IiwGbcd8S7I",
          "type": "video"
        }
      ],
      "buildLinks": [
        {
          "label": "Linux Command Reference",
          "url": "https://tldr.sh/",
          "type": "doc"
        }
      ]
    },
    {
      "day": "Tue",
      "learn": "File permissions (chmod 755/600), users & groups (chown, useradd, groupadd, passwd, sudoers)",
      "build": "Configure custom permissions on files, restrict folder access to specific user groups",
      "learnLinks": [
        {
          "label": "Linux Permissions Explained",
          "url": "https://www.guru99.com/file-permissions.html",
          "type": "doc"
        },
        {
          "label": "Chmod & Chown Tutorial",
          "url": "https://www.youtube.com/watch?v=APgqf7Nl8nU",
          "type": "video"
        },
        {
          "label": "Users and Groups in Linux",
          "url": "https://www.youtube.com/watch?v=e7bWlW7rTco",
          "type": "video"
        }
      ],
      "buildLinks": [
        {
          "label": "Chmod Calculator",
          "url": "https://chmod-calculator.com/",
          "type": "doc"
        }
      ]
    },
    {
      "day": "Wed",
      "learn": "Finding & filtering files/text (grep, find, locate), pipe operations (|), redirecting input/output (>, >>)",
      "build": "Search logs for error tokens using grep, direct results to a summary file, perform requests with curl",
      "learnLinks": [
        {
          "label": "Grep Guide — freeCodeCamp",
          "url": "https://www.freecodecamp.org/news/grep-command-tutorial-how-to-search-for-a-file-in-linux/",
          "type": "doc"
        },
        {
          "label": "Linux Pipes & Redirects",
          "url": "https://www.youtube.com/watch?v=bKzOnHJElgA",
          "type": "video"
        },
        {
          "label": "Find & Grep Walkthrough",
          "url": "https://www.youtube.com/watch?v=vgqnN1-v1d0",
          "type": "video"
        }
      ],
      "buildLinks": [
        {
          "label": "Curl Command Examples",
          "url": "https://curl.se/docs/manpage.html",
          "type": "doc"
        }
      ]
    },
    {
      "day": "Thu",
      "learn": "Network diagnostics, remote management (ssh, scp), environment variables (export, .bashrc)",
      "build": "Configure SSH key pairs, secure login credentials, customize terminal prompts via env profiles",
      "learnLinks": [
        {
          "label": "SSH Keys Setup — DigitalOcean",
          "url": "https://www.digitalocean.com/community/tutorials/how-to-set-up-ssh-keys-on-ubuntu-20-04",
          "type": "doc"
        },
        {
          "label": "SSH Connections Tutorial",
          "url": "https://www.youtube.com/watch?v=ORi3H1LPhcs",
          "type": "video"
        },
        {
          "label": "Linux Env Variables",
          "url": "https://www.youtube.com/watch?v=hZ8Z_rP5fC8",
          "type": "video"
        }
      ],
      "buildLinks": [
        {
          "label": "SSH Config Guide",
          "url": "https://linuxize.com/post/using-ssh-config-file/",
          "type": "doc"
        }
      ]
    },
    {
      "day": "Fri",
      "learn": "Process monitoring, background jobs (&, fg, bg, jobs), services management (systemctl, htop, top)",
      "build": "Daemonize a background service, inspect CPU/memory resource bottlenecks, read logs using journalctl",
      "learnLinks": [
        {
          "label": "Systemd & Systemctl Guide",
          "url": "https://www.digitalocean.com/community/tutorials/systemd-essentials-working-with-services-units-and-the-journal",
          "type": "doc"
        },
        {
          "label": "Linux Services & Systemd",
          "url": "https://www.youtube.com/watch?v=NMD_mB273F8",
          "type": "video"
        },
        {
          "label": "Htop Resource Monitoring",
          "url": "https://www.youtube.com/watch?v=5rT1g6SgB-U",
          "type": "video"
        }
      ],
      "buildLinks": [
        {
          "label": "Htop Guide",
          "url": "https://www.howtoforge.com/a-beginners-guide-to-htop/",
          "type": "doc"
        }
      ]
    }
  ],
  "deliverable": "Secure VPS server initialized: SSH configured, environment variables verified, and logs monitoring working."
};
