export const week13 = {
  "phase": 3,
  "week": 13,
  "title": "🚀 Portfolio Project 1 — \"DevBoard\" Dashboard (Week 1)",
  "goal": "Build a multi-tenant Kanban tool with auth, tasks, status logs, database sync, and a working CI pipeline (Linting, Building, and Testing).",
  "days": [
    {
      "day": "Mon",
      "learn": "Project directories configurations, monorepos package maps config files",
      "build": "Initialize git workspace structure, create packages, run local compilers configs",
      "learnLinks": [
        {
          "label": "Monorepos guides",
          "url": "https://turbo.build/repo/docs/handbook",
          "type": "doc"
        },
        {
          "label": "Vite Config Video",
          "url": "https://www.youtube.com/watch?v=ydkQlJodeOc",
          "type": "video"
        }
      ],
      "buildLinks": []
    },
    {
      "day": "Tue",
      "learn": "Relational schema database structures (Boards Columns Cards model relations)",
      "build": "Write Prisma user columns models schema, deploy local database PG migrations",
      "learnLinks": [
        {
          "label": "Prisma CLI migrations schema",
          "url": "https://www.prisma.io/docs/orm/prisma-schema/data-model/relations",
          "type": "doc"
        },
        {
          "label": "Migrations Video",
          "url": "https://www.youtube.com/watch?v=mGgOsz7fRVA",
          "type": "video"
        }
      ],
      "buildLinks": []
    },
    {
      "day": "Wed",
      "learn": "Register auth encryption hashing endpoints (Bcrypt controllers security)",
      "build": "Build API register user endpoints returning cookies session tokens checks keys",
      "learnLinks": [
        {
          "label": "JWT cookies setups",
          "url": "https://jwt.io/introduction",
          "type": "doc"
        },
        {
          "label": "Auth Endpoint Video",
          "url": "https://www.youtube.com/watch?v=mbsmsi7l3r4",
          "type": "video"
        }
      ],
      "buildLinks": []
    },
    {
      "day": "Thu",
      "learn": "Task card database queries updates methods (CRUD controllers configurations)",
      "build": "Write card get routes, validation requests parameters schemas controllers",
      "learnLinks": [
        {
          "label": "Prisma client query API",
          "url": "https://www.prisma.io/docs/orm/prisma-client/queries/crud",
          "type": "doc"
        },
        {
          "label": "Express CRUD Video",
          "url": "https://www.youtube.com/watch?v=vjf774RKrLc",
          "type": "video"
        }
      ],
      "buildLinks": []
    },
    {
      "day": "Fri",
      "learn": "Backend integration testing, HTTP endpoints diagnostic validations tests schemas",
      "build": "Write endpoint mock databases integration tests logs using Supertest and Jest",
      "learnLinks": [
        {
          "label": "Supertest API testing",
          "url": "https://github.com/ladjs/supertest",
          "type": "doc"
        },
        {
          "label": "Integration Testing Video",
          "url": "https://www.youtube.com/watch?v=Sc8P-6w_nF4",
          "type": "video"
        }
      ],
      "buildLinks": []
    }
  ],
  "deliverable": "Deliver Project 1 meeting all 9 deliverable criteria."
};
