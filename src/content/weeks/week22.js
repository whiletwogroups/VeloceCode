export const week22 = {
  "phase": 4,
  "week": 22,
  "title": "Portfolio Project 2 — \"FinTrack Pro\" (CI/CD Deployment)",
  "goal": "Build and deploy production docker images to GHCR registry and configure VPS Nginx servers.",
  "days": [
    {
      "day": "Mon",
      "learn": "Angular components framework integration inside Next.js projects scopes",
      "build": "Bootstrap simple Angular widgets compiling reactive data charts grids UI templates",
      "learnLinks": [
        {
          "label": "Angular elements guides",
          "url": "https://angular.dev/guide/elements",
          "type": "doc"
        },
        {
          "label": "Angular components Video",
          "url": "https://www.youtube.com/watch?v=3qIevm4g4-c",
          "type": "video"
        }
      ],
      "buildLinks": []
    },
    {
      "day": "Tue",
      "learn": "RxJS data streams filters events pipeline mappings observables",
      "build": "Write Angular services integrating cashflow update events to RxJS streams operators",
      "learnLinks": [
        {
          "label": "RxJS Operators list API",
          "url": "https://rxjs.dev/guide/operators",
          "type": "doc"
        },
        {
          "label": "RxJS components Video",
          "url": "https://www.youtube.com/watch?v=f2G930HtefU",
          "type": "video"
        }
      ],
      "buildLinks": []
    },
    {
      "day": "Wed",
      "learn": "Nginx server reverse proxy files configurations ports forwarding rules",
      "build": "Configure Nginx server block proxies routing SSL requests to Next.js node ports",
      "learnLinks": [
        {
          "label": "Nginx proxy configs guide",
          "url": "https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/",
          "type": "doc"
        },
        {
          "label": "Nginx reverse proxy Video",
          "url": "https://www.youtube.com/watch?v=JKxlhsZX0d4",
          "type": "video"
        }
      ],
      "buildLinks": []
    },
    {
      "day": "Thu",
      "learn": "PM2 background execution scripts daemons configurations clustering modes",
      "build": "Daemonize web application background node process using PM2 cluster control rules",
      "learnLinks": [
        {
          "label": "PM2 keymetrics reference manual",
          "url": "https://pm2.keymetrics.io/docs/usage/quick-start/",
          "type": "doc"
        },
        {
          "label": "PM2 configurations Video",
          "url": "https://www.youtube.com/watch?v=Jm2q2_6nF80",
          "type": "video"
        }
      ],
      "buildLinks": []
    },
    {
      "day": "Fri",
      "learn": "GitHub Actions workflow container deployments GHCR registry push strategies",
      "build": "Write Actions workflow to build, sign, and push docker images to GHCR registry profiles",
      "learnLinks": [
        {
          "label": "CI/CD in Production with Jenkins — DevOps Course",
          "url": "https://www.youtube.com/watch?v=Jm2q2_6nF80",
          "type": "video"
        },
        {
          "label": "CI/CD Full Course 2026 (Real DevOps Pipeline)",
          "url": "https://www.youtube.com/watch?v=JKxlhsZX0d4",
          "type": "video"
        },
        {
          "label": "GitHub Actions Course — DevOps Directive",
          "url": "https://www.youtube.com/watch?v=R8_veQiYt68",
          "type": "video"
        }
      ],
      "buildLinks": []
    }
  ],
  "deliverable": "Set up automated image deployment: pushing updates to GHCR must trigger live container rolling updates."
};
