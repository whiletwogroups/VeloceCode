export const week8 = {
  "phase": 3,
  "week": 8,
  "title": "Node.js & Express Foundations (Basic CI Level 1)",
  "goal": "Build Express servers and set up basic CI (Lint & Build checks).",
  "days": [
    {
      "day": "Mon",
      "learn": "Node runtime environment, CJS vs ESM modularity, fs module, paths",
      "build": "Initialize npm project, run raw Node HTTP server returning JSON",
      "learnLinks": [
        {
          "label": "Node.js Intro",
          "url": "https://nodejs.org/en/learn/getting-started/introduction-to-nodejs",
          "type": "doc"
        },
        {
          "label": "Node.js Crash Course — Traversy",
          "url": "https://www.youtube.com/watch?v=fBNz5xF-Kx4",
          "type": "video"
        }
      ],
      "buildLinks": [
        {
          "label": "http module Node",
          "url": "https://nodejs.org/api/http.html",
          "type": "doc"
        }
      ]
    },
    {
      "day": "Tue",
      "learn": "Express framework routes maps, requests query keys parameters",
      "build": "Build Express REST server exposing GET/POST/PUT/DELETE API endpoints",
      "learnLinks": [
        {
          "label": "Express Routing Guide",
          "url": "https://expressjs.com/en/guide/routing.html",
          "type": "doc"
        },
        {
          "label": "Express Crash Course — Traversy",
          "url": "https://www.youtube.com/watch?v=SccSCuHhOw0",
          "type": "video"
        }
      ],
      "buildLinks": [
        {
          "label": "HTTP Status codes MDN",
          "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status",
          "type": "doc"
        }
      ]
    },
    {
      "day": "Wed",
      "learn": "Middleware execution queues, request logger, custom errors middleware interceptors",
      "build": "Add CORS permissions, custom errors filter middleware to Express server",
      "learnLinks": [
        {
          "label": "Express Middleware Guide",
          "url": "https://expressjs.com/en/guide/using-middleware.html",
          "type": "doc"
        },
        {
          "label": "Express Middleware Video",
          "url": "https://www.youtube.com/watch?v=lY6icfhap2o",
          "type": "video"
        }
      ],
      "buildLinks": [
        {
          "label": "cors npm package",
          "url": "https://www.npmjs.com/package/cors",
          "type": "doc"
        }
      ]
    },
    {
      "day": "Thu",
      "learn": "JSON schema validator schema declarations (Zod schemas types validation)",
      "build": "Inject Zod validation schema controllers to secure all server inputs",
      "learnLinks": [
        {
          "label": "Zod Docs",
          "url": "https://zod.dev/",
          "type": "doc"
        },
        {
          "label": "Zod Schema Video — Fireship",
          "url": "https://www.youtube.com/watch?v=L6BE-U3oy80",
          "type": "video"
        }
      ],
      "buildLinks": [
        {
          "label": "Zod Basic Usage",
          "url": "https://zod.dev/?id=basic-usage",
          "type": "doc"
        }
      ]
    },
    {
      "day": "Fri",
      "learn": "GitHub Actions concepts, custom lint pipelines, code compilation verifications (tsc compiler)",
      "build": "Write .github/workflows/ci-basic.yml, automate ESLint audit runs and TS type checks on every incoming Pull Request",
      "learnLinks": [
        {
          "label": "GitHub Actions Documentation",
          "url": "https://docs.github.com/en/actions",
          "type": "doc"
        },
        {
          "label": "Complete GitHub Actions Course — DevOps Directive",
          "url": "https://www.youtube.com/watch?v=R8_veQiYt68",
          "type": "video"
        }
      ],
      "buildLinks": [
        {
          "label": "TS Compiler Options",
          "url": "https://www.typescriptlang.org/tsconfig/",
          "type": "doc"
        }
      ]
    }
  ]
};
