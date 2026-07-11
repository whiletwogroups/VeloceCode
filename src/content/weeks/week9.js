export const week9 = {
  "phase": 3,
  "week": 9,
  "title": "Authentication & Databases",
  "goal": "Connect databases and implement secure JWT authentication.",
  "days": [
    {
      "day": "Mon",
      "learn": "Non-relational data clusters configurations (MongoDB setups)",
      "build": "Spin up MongoDB Atlas cloud instance, connect via local client driver",
      "learnLinks": [
        {
          "label": "MongoDB Atlas docs",
          "url": "https://www.mongodb.com/docs/",
          "type": "doc"
        },
        {
          "label": "MongoDB Crash Course — Traversy",
          "url": "https://www.youtube.com/watch?v=-56x56UppqQ",
          "type": "video"
        }
      ],
      "buildLinks": [
        {
          "label": "Mongoose schema guides",
          "url": "https://mongoosejs.com/docs/guide.html",
          "type": "doc"
        }
      ]
    },
    {
      "day": "Tue",
      "learn": "Relational database systems (PostgreSQL tables maps)",
      "build": "Install local PostgreSQL db server instance, connect via pgAdmin utility",
      "learnLinks": [
        {
          "label": "PostgreSQL Tutorial",
          "url": "https://www.postgresqltutorial.com/",
          "type": "doc"
        },
        {
          "label": "PostgreSQL Video — Traversy",
          "url": "https://www.youtube.com/watch?v=qw--VYLpxG4",
          "type": "video"
        }
      ],
      "buildLinks": [
        {
          "label": "PostgreSQL data types",
          "url": "https://www.postgresql.org/docs/current/datatype.html",
          "type": "doc"
        }
      ]
    },
    {
      "day": "Wed",
      "learn": "Password encryption hashes algorithms (bcrypt parameters)",
      "build": "Implement bcrypt hashing filters on register controller password database records",
      "learnLinks": [
        {
          "label": "bcrypt npm API",
          "url": "https://www.npmjs.com/package/bcrypt",
          "type": "doc"
        },
        {
          "label": "Bcrypt Hashing Video",
          "url": "https://www.youtube.com/watch?v=Az6gC5S6mco",
          "type": "video"
        }
      ],
      "buildLinks": [
        {
          "label": "bcrypt usage details",
          "url": "https://www.npmjs.com/package/bcrypt#usage",
          "type": "doc"
        }
      ]
    },
    {
      "day": "Thu",
      "learn": "JSON Web Token signing algorithms and authorization verification headers",
      "build": "Generate session JWT keys tokens on login route, build guard authorization middleware",
      "learnLinks": [
        {
          "label": "JWT Introduction",
          "url": "https://jwt.io/introduction",
          "type": "doc"
        },
        {
          "label": "JWT Authentication Video",
          "url": "https://www.youtube.com/watch?v=mbsmsi7l3r4",
          "type": "video"
        }
      ],
      "buildLinks": [
        {
          "label": "jsonwebtoken npm package",
          "url": "https://www.npmjs.com/package/jsonwebtoken",
          "type": "doc"
        }
      ]
    },
    {
      "day": "Fri",
      "learn": "GitHub repository secrets configurations, environment variables injection in Actions runner jobs",
      "build": "Protect secure backend environment files (DB URLs, JWT keys), inject secrets to automate pipeline tests safely",
      "learnLinks": [
        {
          "label": "GitHub Encrypted Secrets",
          "url": "https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions",
          "type": "doc"
        },
        {
          "label": "GitHub Secrets & Env Variables",
          "url": "https://www.youtube.com/watch?v=scEDHsr3APg",
          "type": "video"
        }
      ],
      "buildLinks": [
        {
          "label": "Using env in Workflows",
          "url": "https://docs.github.com/en/actions/learn-github-actions/variables",
          "type": "doc"
        }
      ]
    }
  ]
};
