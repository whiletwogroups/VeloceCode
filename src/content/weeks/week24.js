export const week24 = {
  "phase": 5,
  "week": 24,
  "title": "Retrieval-Augmented Generation (RAG)",
  "goal": "Build context-aware pipelines matching user prompts to internal PostgreSQL data structures.",
  "days": [
    {
      "day": "Mon",
      "learn": "Retrieval-Augmented Generation (RAG) conceptual maps pipeline architectures",
      "build": "Design documents upload chunks embeddings indices database registers mappings",
      "learnLinks": [
        {
          "label": "RAG Pipeline Overview",
          "url": "https://www.promptingguide.ai/research/rag",
          "type": "doc"
        },
        {
          "label": "RAG Concepts Video",
          "url": "https://www.youtube.com/watch?v=T-D1OfcDW1M",
          "type": "video"
        }
      ],
      "buildLinks": [
        {
          "label": "LangChain RAG concept guide",
          "url": "https://js.langchain.com/docs/tutorials/rag",
          "type": "doc"
        }
      ]
    },
    {
      "day": "Tue",
      "learn": "Text files parsing chunk splitters setups index configurations",
      "build": "Write script dividing uploaded documents text chunks storing indexes databases",
      "learnLinks": [
        {
          "label": "Document Chunking strategies",
          "url": "https://js.langchain.com/docs/how_to/#text-splitters",
          "type": "doc"
        },
        {
          "label": "Document Splitters Video",
          "url": "https://www.youtube.com/watch?v=klTvEwg3o1Q",
          "type": "video"
        }
      ],
      "buildLinks": [
        {
          "label": "LangChain Recursive character splitter",
          "url": "https://js.langchain.com/docs/how_to/recursive_text_splitter",
          "type": "doc"
        }
      ]
    },
    {
      "day": "Wed",
      "learn": "pgvector cosine similarity query indices filters criteria search",
      "build": "Write DB query matching user text searches embeddings to vector records tables",
      "learnLinks": [
        {
          "label": "pgvector querying operators",
          "url": "https://github.com/pgvector/pgvector#querying",
          "type": "doc"
        },
        {
          "label": "pgvector search Video",
          "url": "https://www.youtube.com/watch?v=RCTHSFf6Yns",
          "type": "video"
        }
      ],
      "buildLinks": [
        {
          "label": "Prisma $queryRaw PG queries",
          "url": "https://www.prisma.io/docs/orm/prisma-client/queries/raw-database-access/raw-queries",
          "type": "doc"
        }
      ]
    },
    {
      "day": "Thu",
      "learn": "AI context inject structures, system prompts builders queries controllers",
      "build": "Enrich OpenAI/Gemini prompt templates context strings with database matching records log details",
      "learnLinks": [
        {
          "label": "System prompt setups RAG",
          "url": "https://platform.openai.com/docs/guides/reasoning/prompt-engineering",
          "type": "doc"
        },
        {
          "label": "RAG context Video",
          "url": "https://www.youtube.com/watch?v=obDILpY528M",
          "type": "video"
        }
      ],
      "buildLinks": [
        {
          "label": "LangChain RAG Prompt template",
          "url": "https://js.langchain.com/docs/how_to/qa_chat_history_how_to",
          "type": "doc"
        }
      ]
    },
    {
      "day": "Fri",
      "learn": "GitHub Secrets management workflows config files credentials variables keys",
      "build": "Protect secure OpenAI/Gemini API credentials variables in GitHub Actions workflow setups",
      "learnLinks": [
        {
          "label": "Actions Repository Secrets",
          "url": "https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions",
          "type": "doc"
        },
        {
          "label": "GitHub Secrets Video",
          "url": "https://www.youtube.com/watch?v=scEDHsr3APg",
          "type": "video"
        }
      ],
      "buildLinks": [
        {
          "label": "GitHub Actions env specs",
          "url": "https://docs.github.com/en/actions/learn-github-actions/variables",
          "type": "doc"
        }
      ]
    }
  ]
};
