export const week20 = {
  "phase": 4,
  "week": 20,
  "title": "PostgreSQL Deep Dive & Optimization",
  "goal": "Optimize SQL query operations and compile schema indexes.",
  "days": [
    {
      "day": "Mon",
      "learn": "PostgreSQL analytical query layouts (SQL Window functions partitions)",
      "build": "Write window data queries partitioning record logs by category bounds",
      "learnLinks": [
        {
          "label": "PostgreSQL Window functions",
          "url": "https://www.postgresql.org/docs/current/tutorial-window.html",
          "type": "doc"
        },
        {
          "label": "SQL Window Functions Video",
          "url": "https://www.youtube.com/watch?v=wz6TevF2xrs",
          "type": "video"
        }
      ],
      "buildLinks": [
        {
          "label": "PG window function list",
          "url": "https://www.postgresql.org/docs/current/functions-window.html",
          "type": "doc"
        }
      ]
    },
    {
      "day": "Tue",
      "learn": "Relational query execution structures plans (Explain Analyze diagnostics output)",
      "build": "Analyze query execution plans detecting performance indexes leaks scopes",
      "learnLinks": [
        {
          "label": "EXPLAIN PostgreSQL guide",
          "url": "https://www.postgresql.org/docs/current/using-explain.html",
          "type": "doc"
        },
        {
          "label": "Explain Analyze Video",
          "url": "https://www.youtube.com/watch?v=1m8V5f-tpxk",
          "type": "video"
        }
      ],
      "buildLinks": [
        {
          "label": "EXPLAIN statement options spec",
          "url": "https://www.postgresql.org/docs/current/sql-explain.html",
          "type": "doc"
        }
      ]
    },
    {
      "day": "Wed",
      "learn": "Database indexes designs parameters (B-Tree indexes and Hash indexes)",
      "build": "Deploy table column indexes verify search acceleration rate on records",
      "learnLinks": [
        {
          "label": "PostgreSQL Index Types",
          "url": "https://www.postgresql.org/docs/current/indexes-types.html",
          "type": "doc"
        },
        {
          "label": "Database Indexing Video",
          "url": "https://www.youtube.com/watch?v=aGgOsz7fRVA",
          "type": "video"
        }
      ],
      "buildLinks": [
        {
          "label": "Prisma db index settings",
          "url": "https://www.prisma.io/docs/orm/prisma-schema/data-model/indexes",
          "type": "doc"
        }
      ]
    },
    {
      "day": "Thu",
      "learn": "Database transaction blocks structures, isolation locks rules parameters",
      "build": "Write safe transaction queries enforcing isolation limits prevent dirty reads",
      "learnLinks": [
        {
          "label": "PostgreSQL transaction blocks",
          "url": "https://www.postgresql.org/docs/current/tutorial-transactions.html",
          "type": "doc"
        },
        {
          "label": "SQL Transaction Isolation Video",
          "url": "https://www.youtube.com/watch?v=RCTHSFf6Yns",
          "type": "video"
        }
      ],
      "buildLinks": [
        {
          "label": "Prisma Client Transactions API",
          "url": "https://www.prisma.io/docs/orm/prisma-client/queries/transactions",
          "type": "doc"
        }
      ]
    },
    {
      "day": "Fri",
      "learn": "System cron tasks logs triggers, shell data backups automation scripts",
      "build": "Write cron shell scripts backing up databases records tables files regularly",
      "learnLinks": [
        {
          "label": "Linux Cron Scheduling guide",
          "url": "https://linuxize.com/post/postgres-backup-and-restore/",
          "type": "doc"
        },
        {
          "label": "PG Backups scripts Video",
          "url": "https://www.youtube.com/watch?v=mGgOsz7fRVA",
          "type": "video"
        }
      ],
      "buildLinks": [
        {
          "label": "Crontab scheduling calculator",
          "url": "https://crontab.guru/",
          "type": "doc"
        }
      ]
    }
  ]
};
