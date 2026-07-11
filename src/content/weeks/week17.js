export const week17 = {
  "phase": 4,
  "week": 17,
  "title": "Next.js Auth, Middleware & Databases",
  "goal": "Secure Next.js applications and manage relational database schemas.",
  "days": [
    {
      "day": "Mon",
      "learn": "NextAuth.js authentication integrations, custom login providers mappings configurations",
      "build": "Connect credential providers hooks user accounts registers structures user credentials",
      "learnLinks": [
        {
          "label": "NextAuth.js credentials config",
          "url": "https://next-auth.js.org/providers/credentials",
          "type": "doc"
        },
        {
          "label": "NextAuth Integration Video",
          "url": "https://www.youtube.com/watch?v=obDILpY528M",
          "type": "video"
        }
      ],
      "buildLinks": [
        {
          "label": "NextAuth API endpoints reference",
          "url": "https://next-auth.js.org/getting-started/introduction",
          "type": "doc"
        }
      ]
    },
    {
      "day": "Tue",
      "learn": "Next.js middleware router guards, session cookies parse intercepts path locks",
      "build": "Write middleware.ts script protecting dashboard URL paths from guest visitors redirects",
      "learnLinks": [
        {
          "label": "Next.js Middleware guides",
          "url": "https://nextjs.org/docs/app/building-your-application/routing/middleware",
          "type": "doc"
        },
        {
          "label": "Next Middleware Video",
          "url": "https://www.youtube.com/watch?v=V8_veQiYt68",
          "type": "video"
        }
      ],
      "buildLinks": [
        {
          "label": "Next.js NextResponse API",
          "url": "https://nextjs.org/docs/app/api-reference/functions/next-response",
          "type": "doc"
        }
      ]
    },
    {
      "day": "Wed",
      "learn": "Serverless database topologies integrations (Supabase cloud setups)",
      "build": "Connect external Prisma Client drivers to Supabase cloud PostgreSQL server instances",
      "learnLinks": [
        {
          "label": "Supabase PG connections",
          "url": "https://supabase.com/docs/guides/database/connecting-to-postgres",
          "type": "doc"
        },
        {
          "label": "Supabase setup Video",
          "url": "https://www.youtube.com/watch?v=H5GJZTa__W4",
          "type": "video"
        }
      ],
      "buildLinks": [
        {
          "label": "Supabase Javascript Client API",
          "url": "https://supabase.com/docs/reference/javascript/introduction",
          "type": "doc"
        }
      ]
    },
    {
      "day": "Thu",
      "learn": "Relational data query optimizations indexes indexes configurations patterns",
      "build": "Analyze database execution speed plans optimizing key filters scopes queries",
      "learnLinks": [
        {
          "label": "Database Indexing techniques",
          "url": "https://www.postgresqltutorial.com/postgresql-indexes/",
          "type": "doc"
        },
        {
          "label": "Query Optimization Video",
          "url": "https://www.youtube.com/watch?v=1m8V5f-tpxk",
          "type": "video"
        }
      ],
      "buildLinks": [
        {
          "label": "Explain Analyze PG API",
          "url": "https://www.postgresql.org/docs/current/sql-explain.html",
          "type": "doc"
        }
      ]
    },
    {
      "day": "Fri",
      "learn": "Docker network topologies, custom bridge networks, container name mappings, env variable bindings",
      "build": "Link Next.js web application containers directly to database containers using safe private docker networks",
      "learnLinks": [
        {
          "label": "Docker Bridge Network",
          "url": "https://docs.docker.com/network/drivers/bridge/",
          "type": "doc"
        },
        {
          "label": "Docker Networks Explained",
          "url": "https://www.youtube.com/watch?v=bKFMS5C4CG0",
          "type": "video"
        }
      ],
      "buildLinks": [
        {
          "label": "Docker Networking Commands",
          "url": "https://docs.docker.com/network/#network-commands",
          "type": "doc"
        }
      ]
    }
  ]
};
