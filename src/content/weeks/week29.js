export const week29 = {
  "phase": 5,
  "week": 29,
  "title": "Capstone Project — \"NexaAI\" (Phase 2 LLM Integration & Testing)",
  "goal": "Build streaming prompt queries, semantic similarity matches inside pgvector tables, and test coverage logs.",
  "days": [
    {
      "day": "Mon",
      "learn": "OpenAI/Gemini APIs integration, chat state structures, prompt constraints",
      "build": "Connect frontend chats layouts to the streaming completion route in backend API controller",
      "learnLinks": [
        {
          "label": "OpenAI Node SDK",
          "url": "https://github.com/openai/openai-node",
          "type": "doc"
        },
        {
          "label": "LLM Integration Tutorial",
          "url": "https://www.youtube.com/watch?v=obDILpY528M",
          "type": "video"
        }
      ],
      "buildLinks": []
    },
    {
      "day": "Tue",
      "learn": "Vector search indexes, document processing layouts, splitters configurations",
      "build": "Write file upload index routes: chunk files, generate embeddings, and populate pgvector tables",
      "learnLinks": [
        {
          "label": "pgvector Indexing options",
          "url": "https://github.com/pgvector/pgvector#indexing",
          "type": "doc"
        },
        {
          "label": "Vector Databases in 100 Seconds",
          "url": "https://www.youtube.com/watch?v=klTvEwg3o1Q",
          "type": "video"
        }
      ],
      "buildLinks": []
    },
    {
      "day": "Wed",
      "learn": "Retrieval-Augmented Generation context query matching (cosine similarity)",
      "build": "Integrate semantic indexing search to enrich chat context prompts with query records details",
      "learnLinks": [
        {
          "label": "Semantic search docs",
          "url": "https://github.com/pgvector/pgvector#querying",
          "type": "doc"
        },
        {
          "label": "RAG Explained Simply",
          "url": "https://www.youtube.com/watch?v=T-D1OfcDW1M",
          "type": "video"
        }
      ],
      "buildLinks": []
    },
    {
      "day": "Thu",
      "learn": "Mocking AI responses, testing edge constraints, validating system filters",
      "build": "Write backend validation tests verifying pgvector relations and prompt fallback states using Supertest",
      "learnLinks": [
        {
          "label": "Mocking fetch calls Jest",
          "url": "https://jestjs.io/docs/mock-functions",
          "type": "doc"
        },
        {
          "label": "Testing LLM Applications",
          "url": "https://www.youtube.com/watch?v=cM3cIevm4g4",
          "type": "video"
        }
      ],
      "buildLinks": []
    },
    {
      "day": "Fri",
      "learn": "Real-time websocket events logs, notification systems components",
      "build": "Implement socket notification hooks alerting users when document embeddings generation completes",
      "learnLinks": [
        {
          "label": "Socket.io Node guide",
          "url": "https://socket.io/docs/v4/server-initialization/",
          "type": "doc"
        },
        {
          "label": "WebSockets in 100 Seconds",
          "url": "https://www.youtube.com/watch?v=1BfCnjr_Vjg",
          "type": "video"
        }
      ],
      "buildLinks": []
    }
  ],
  "deliverable": "Deliver Project 3 meeting all 9 deliverable criteria."
};
