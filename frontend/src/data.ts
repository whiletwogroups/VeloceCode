export interface PhaseColor {
  accent: string;
  bg: string;
  text: string;
  label: string;
}

export interface DayTask {
  day: string;
  learn: string;
  build: string;
}

export interface WeekData {
  week: number;
  title: string;
  goal?: string;
  days: DayTask[];
  deliverable?: string;
  note?: string;
}

export interface Phase {
  phase: number;
  title: string;
  subtitle: string;
  weeks: string;
  desc: string;
  weeks_data: WeekData[];
}

export interface Project {
  id: string;
  number: string;
  name: string;
  tagline: string;
  phase: string;
  weeks: string;
  color: string;
  status: string;
  tech: string[];
  milestones: string[];
}

export interface Rule {
  icon: string;
  title: string;
  text: string;
  highlight?: boolean;
}

export interface SkillDemand {
  skill: string;
  demand: 'high' | 'medium' | 'growing' | 'niche';
  notes: string;
}

export const PHASE_COLORS: Record<number, PhaseColor> = {
  1: { accent: '#6366f1', bg: 'rgba(99,102,241,0.12)', text: '#a5b4fc', label: 'Phase 1' },
  2: { accent: '#8b5cf6', bg: 'rgba(139,92,246,0.12)', text: '#c4b5fd', label: 'Phase 2' },
  3: { accent: '#06b6d4', bg: 'rgba(6,182,212,0.12)', text: '#67e8f9', label: 'Phase 3' },
  4: { accent: '#10b981', bg: 'rgba(16,185,129,0.12)', text: '#6ee7b7', label: 'Phase 4' },
  5: { accent: '#f97316', bg: 'rgba(249,115,22,0.12)', text: '#fdba74', label: 'Phase 5' },
  6: { accent: '#ec4899', bg: 'rgba(236,72,153,0.12)', text: '#f9a8d4', label: 'Phase 6' },
};

export const ROADMAP: Phase[] = [
  {
    phase: 1,
    title: 'Web Foundations',
    subtitle: 'HTML + CSS + JavaScript',
    weeks: 'Weeks 1–3 · Days 1–15',
    desc: 'Master the fundamentals that everything is built on.',
    weeks_data: [
      {
        week: 1, title: 'HTML + CSS',
        goal: 'Build 3 fully responsive web pages from scratch, no framework.',
        days: [
          { day: 'Mon', learn: 'HTML5 semantics, document structure, forms, meta tags', build: 'Build: Personal profile page (pure HTML, no CSS yet)' },
          { day: 'Tue', learn: 'CSS Box Model, specificity, selectors, inheritance', build: 'Style your profile page — make it look real' },
          { day: 'Wed', learn: 'Flexbox — complete mastery (all properties, all use cases)', build: 'Build: Navigation bar + Card grid layout using Flexbox' },
          { day: 'Thu', learn: 'CSS Grid — complete mastery, responsive grid systems', build: 'Build: Dashboard layout using Grid' },
          { day: 'Fri', learn: 'Media queries, CSS variables, transitions, animations', build: 'Build: Responsive landing page (mobile + desktop)' },
        ],
        deliverable: '3 pages committed to GitHub. No frameworks. Pure HTML + CSS.'
      },
      {
        week: 2, title: 'JavaScript Core',
        goal: 'Understand closures, async/await, and the event loop deeply enough to explain them.',
        days: [
          { day: 'Mon', learn: 'Variables (var/let/const), data types, operators, control flow, functions', build: '20 small JS exercises — functions, loops, conditions' },
          { day: 'Tue', learn: 'Scope, Hoisting, Closures — go slow, read MDN, write examples', build: 'Solve 5 closure puzzles. Write your own closure examples' },
          { day: 'Wed', learn: 'this keyword (4 contexts), Prototype chain, class syntax', build: 'Build a simple Bank Account class using OOP concepts' },
          { day: 'Thu', learn: 'Callbacks → Promises → async/await, try/catch, Promise.all', build: 'Fetch data from a public API (weather or jokes) and display it' },
          { day: 'Fri', learn: 'Event Loop deep dive (Call Stack, Web APIs, Task Queue, Microtask Queue)', build: 'Write 3 examples showing you understand execution order. Explain it out loud.' },
        ],
        deliverable: "Close laptop. On paper, explain the event loop with a diagram. If you can't — re-learn Monday."
      },
      {
        week: 3, title: 'JavaScript Advanced + DOM',
        goal: 'Build a complete vanilla JS app. No React. No libraries.',
        days: [
          { day: 'Mon', learn: 'ES6+: Destructuring, Spread/Rest, Optional Chaining, Nullish Coalescing, Modules', build: 'Refactor Week 2 exercises using ES6+ syntax' },
          { day: 'Tue', learn: 'Higher-Order Functions: map, filter, reduce, find, every, some, flat, flatMap', build: '15 array exercises using ONLY HOFs — no for loops' },
          { day: 'Wed', learn: 'DOM Manipulation: querySelector, events, createElement, classList, dataset', build: 'Build: Live search filter on a list of items' },
          { day: 'Thu', learn: 'LocalStorage, SessionStorage, JSON.parse/stringify, fetch + error handling', build: 'Build: Todo list app with localStorage persistence' },
          { day: 'Fri', learn: 'Mini-Project Day — no learning, only building', build: 'Deploy: Weather App — live weather API, city search, recent searches. Deploy on Netlify/Vercel.' },
        ],
        deliverable: '🌐 Weather App LIVE on the internet. Share the link. This is your first live project.'
      }
    ]
  },
  {
    phase: 2,
    title: 'Programming Brain',
    subtitle: 'OOP + Arrays + Patterns + DSA',
    weeks: 'Weeks 4–6 · Days 16–30',
    desc: 'Build the algorithmic foundation that gets you through technical screens.',
    weeks_data: [
      {
        week: 4, title: 'OOP + Arrays + Patterns',
        goal: 'Code all 4 OOP pillars + 20 array problems + print 5 patterns.',
        days: [
          { day: 'Mon', learn: 'OOP: Class, Object, Constructor, Encapsulation (#privateField)', build: 'Build: Library management system using classes' },
          { day: 'Tue', learn: 'Inheritance, Polymorphism, method overriding, super keyword', build: 'Extend Library: Add Book, DVD, Magazine using inheritance' },
          { day: 'Wed', learn: 'Abstraction, SOLID — S (Single Responsibility), O (Open/Closed)', build: 'Refactor Library code to follow S and O principles' },
          { day: 'Thu', learn: 'SOLID — L, I, D principles + Factory & Observer design patterns', build: 'Implement Observer pattern: EventEmitter from scratch' },
          { day: 'Fri', learn: 'Arrays: Two Pointer, Sliding Window, Prefix Sum + Pattern printing', build: 'Solve 15 LeetCode Easy + Print 5 patterns (star, number, pyramid)' },
        ]
      },
      {
        week: 5, title: 'DSA Part 1: Arrays, Strings, Hash Maps',
        goal: '30 problems solved. Can explain Big-O of each solution.',
        days: [
          { day: 'Mon', learn: 'Big-O Notation: O(1), O(n), O(n²), O(log n), O(n log n)', build: 'Solve: Two Sum, Best Time to Buy/Sell Stock, Contains Duplicate' },
          { day: 'Tue', learn: 'Sorting: Bubble, Selection, Merge Sort (understand each)', build: "Solve: Product of Array Except Self, Maximum Subarray (Kadane's)" },
          { day: 'Wed', learn: 'Binary Search — template, left/right boundaries', build: 'Solve: Binary Search, Search Insert Position, Find Peak Element' },
          { day: 'Thu', learn: 'Hash Maps — frequency counting, index storage', build: 'Solve: Valid Anagram, Group Anagrams, Two Sum (hash map)' },
          { day: 'Fri', learn: 'Sliding Window — fixed vs variable window', build: 'Solve: Longest Substring Without Repeating, Max Sum Subarray K' },
        ],
        note: "After every problem: explain it out loud as if you're in an interview."
      },
      {
        week: 6, title: 'DSA Part 2: Linked Lists, Stacks, Trees',
        goal: '60 total problems. Comfortable with trees and recursion.',
        days: [
          { day: 'Mon', learn: 'Linked Lists — Node structure, traversal, insertion, deletion', build: 'Solve: Reverse Linked List, Middle of Linked List, Merge Two Sorted Lists' },
          { day: 'Tue', learn: 'Floyd\'s Cycle Detection + fast/slow pointer pattern', build: 'Solve: Detect Cycle, Find Duplicate Number, Happy Number' },
          { day: 'Wed', learn: 'Stacks & Queues — array and linked list implementations', build: 'Solve: Valid Parentheses, Min Stack, Implement Queue using Stacks' },
          { day: 'Thu', learn: 'Binary Trees — structure, DFS (pre/in/postorder), BFS', build: 'Solve: Max Depth, Invert Binary Tree, Symmetric Tree, Level Order Traversal' },
          { day: 'Fri', learn: 'Recursion deep dive + Tree problems', build: 'Solve: Diameter of Binary Tree, Path Sum, Lowest Common Ancestor' },
        ],
        deliverable: '60 Problems ✅ DSA Done for fresher interviews.'
      }
    ]
  },
  {
    phase: 3,
    title: 'Full-Stack Core',
    subtitle: 'Node.js + Express + MongoDB + PostgreSQL + React + TypeScript',
    weeks: 'Weeks 7–14 · Days 31–70',
    desc: 'Build complete full-stack applications with production-grade patterns.',
    weeks_data: [
      {
        week: 7, title: 'Node.js + Express Foundations',
        goal: 'Build a working Express API with validation and error handling.',
        days: [
          { day: 'Mon', learn: 'Node.js: runtime, modules (CJS vs ESM), fs, path, http', build: 'Build a raw HTTP server (no Express) serving JSON' },
          { day: 'Tue', learn: 'Express: routing, middleware, req/res, status codes', build: 'Build: Express server with 5 routes (GET, POST, PUT, DELETE)' },
          { day: 'Wed', learn: 'Middleware: custom, express.json(), cors, error handling middleware', build: 'Add error handling + request logging middleware to your server' },
          { day: 'Thu', learn: 'Environment variables with dotenv, project structure, nodemon', build: 'Structure: routes/ controllers/ middleware/ config/' },
          { day: 'Fri', learn: 'Request validation with Zod, proper error response format', build: 'Add Zod validation to all routes. Every bad request returns a proper error.' },
        ]
      },
      {
        week: 8, title: 'Authentication + Databases',
        goal: 'Working auth + MongoDB + first SQL queries.',
        days: [
          { day: 'Mon', learn: 'JWT: access token + refresh token pattern, jsonwebtoken library', build: 'Build: Register + Login routes, return JWT on login' },
          { day: 'Tue', learn: 'bcrypt hashing, token verification middleware, protected routes', build: 'Add password hashing + auth middleware — protect your routes' },
          { day: 'Wed', learn: 'MongoDB + Mongoose: schema, CRUD, indexes, virtuals', build: 'Connect MongoDB Atlas — build User and Task schemas' },
          { day: 'Thu', learn: 'PostgreSQL: tables, data types, constraints, basic queries', build: 'Install PostgreSQL locally, create a database, run SQL queries manually' },
          { day: 'Fri', learn: 'SQL: all JOINs, GROUP BY, HAVING, subqueries, CTEs', build: 'Write 10 SQL queries on a practice dataset' },
        ]
      },
      {
        week: 9, title: 'PostgreSQL + Prisma + Advanced Backend',
        goal: 'Production-ready backend with Prisma ORM and security middleware.',
        days: [
          { day: 'Mon', learn: 'Prisma ORM: schema.prisma, prisma generate, prisma migrate', build: 'Set up Prisma with PostgreSQL — model User, Project, Task' },
          { day: 'Tue', learn: 'Prisma: CRUD, relations (one-to-many, many-to-many), transactions', build: 'Build CRUD routes using Prisma — no raw SQL' },
          { day: 'Wed', learn: 'File uploads with multer + Cloudinary, pagination, search', build: 'Add file upload endpoint + paginated list endpoint' },
          { day: 'Thu', learn: 'Rate limiting (express-rate-limit), Helmet.js, CORS hardening', build: 'Secure your API — add rate limiting and security headers' },
          { day: 'Fri', learn: 'API documentation with Postman / Swagger', build: 'Document all your API routes in Postman. Export collection to GitHub.' },
        ]
      },
      {
        week: 10, title: 'React + TypeScript Foundations',
        goal: 'Build typed React components with hooks and custom hooks.',
        days: [
          { day: 'Mon', learn: 'TypeScript basics: types, interfaces, type vs interface, any vs unknown', build: 'Convert your vanilla JS todo app to TypeScript' },
          { day: 'Tue', learn: 'React: JSX, props, state, event handlers — with TypeScript from day 1', build: 'Build: Counter + User card components with typed props' },
          { day: 'Wed', learn: 'useState, useEffect (dependencies, cleanup), conditional rendering', build: 'Build: Fetch and display a list of users from your API' },
          { day: 'Thu', learn: 'useContext, useReducer — React\'s built-in state management', build: 'Build: Dark mode toggle using Context' },
          { day: 'Fri', learn: 'useMemo, useCallback, useRef, Custom Hooks', build: 'Build custom hook: useFetch<T>() — typed, loading + error states' },
        ]
      },
      {
        week: 11, title: 'React Advanced + Routing',
        goal: 'Multi-page app with React Router, React Query, Zustand, and RHF.',
        days: [
          { day: 'Mon', learn: 'React Router v6: routes, navigate, params, Outlet', build: 'Set up routing for a multi-page app' },
          { day: 'Tue', learn: 'Protected routes, layout routes, loader functions', build: 'Add auth guard — redirect to login if no token' },
          { day: 'Wed', learn: 'TanStack Query: useQuery, useMutation, invalidateQueries', build: 'Replace all your useEffect fetches with React Query' },
          { day: 'Thu', learn: 'Zustand state management — store, actions, selectors', build: 'Add Zustand store for auth state (user, token, isLoggedIn)' },
          { day: 'Fri', learn: 'React Hook Form + Zod validation', build: 'Build: Login form + Register form with full validation' },
        ]
      },
      {
        week: 12, title: 'TypeScript Deep Dive',
        goal: 'Full TypeScript mastery with strict mode enabled.',
        days: [
          { day: 'Mon', learn: 'Generics: <T>, generic functions, generic interfaces', build: 'Write 5 generic utility functions' },
          { day: 'Tue', learn: 'Utility types: Partial, Required, Readonly, Pick, Omit, Record', build: 'Type your entire API response shapes using utility types' },
          { day: 'Wed', learn: 'Union/Intersection types, Type Guards, in, typeof, instanceof', build: 'Refactor 3 components to use proper type narrowing' },
          { day: 'Thu', learn: 'TypeScript + Express: typed Request, Response, typed middleware', build: 'Add TypeScript to your backend API' },
          { day: 'Fri', learn: 'TypeScript strict mode — fix all any types, enable strict: true', build: 'Enable strict mode — fix every error. Don\'t suppress, fix.' },
        ]
      },
      {
        week: 13, title: '🚀 Project 1 — DevBoard (Week 1)',
        goal: 'Kanban + Team Collaboration App — backend complete.',
        days: [
          { day: 'Mon', learn: 'Project setup: monorepo structure, Express backend + React frontend', build: 'Initialize repo, configure TypeScript, set up folder structure' },
          { day: 'Tue', learn: 'Auth flow: Register, Login, JWT + Refresh token, protected routes', build: 'Build full auth system with access + refresh tokens' },
          { day: 'Wed', learn: 'Database schema: Users, Projects, Boards, Columns, Cards (Prisma + PG)', build: 'Design and migrate the full schema' },
          { day: 'Thu', learn: 'Backend: CRUD APIs for Projects and Columns', build: 'Implement all Project and Column endpoints' },
          { day: 'Fri', learn: 'Backend: CRUD APIs for Cards — assignment, due date, priority', build: 'Complete all Card endpoints with filtering and sorting' },
        ]
      },
      {
        week: 14, title: '🚀 Project 1 — DevBoard (Week 2)',
        goal: 'Frontend complete + deployed live.',
        days: [
          { day: 'Mon', learn: 'Frontend: Auth pages (Login/Register) with React Hook Form + Zod', build: 'Build login + register pages with full validation' },
          { day: 'Tue', learn: 'Frontend: Dashboard + Project list — React Query + Zustand', build: 'Build dashboard with live data from API' },
          { day: 'Wed', learn: 'Frontend: Kanban board — drag and drop with @dnd-kit', build: 'Implement drag-and-drop between columns' },
          { day: 'Thu', learn: 'Frontend: Task detail modal, comments, file upload', build: 'Build task modal + file upload feature' },
          { day: 'Fri', learn: 'Deploy: Railway (backend) + Vercel (frontend)', build: 'Deploy, write README with screenshots, add live URL to CV' },
        ],
        deliverable: '✅ PROJECT 1 DONE. DevBoard live URL on your CV.'
      }
    ]
  },
  {
    phase: 4,
    title: 'Advanced Stack',
    subtitle: 'Next.js 14 + Angular + PostgreSQL Deep Dive',
    weeks: 'Weeks 15–20 · Days 71–100',
    desc: 'Level up with Next.js App Router, real SQL mastery, and Project 2.',
    weeks_data: [
      {
        week: 15, title: 'Next.js 14 App Router',
        goal: 'Build a Next.js app with Server Components, ISR, and Server Actions.',
        days: [
          { day: 'Mon', learn: 'App Router: folder structure, page.tsx, layout.tsx, loading.tsx', build: 'Set up Next.js 14 app — create 5 routes with nested layouts' },
          { day: 'Tue', learn: 'Server vs Client Components — when to use each', build: 'Refactor: Move data fetching to Server Components' },
          { day: 'Wed', learn: 'Data fetching in Server Components + fetch caching options', build: 'Build: Blog page with SSG (cache: force-cache) and ISR (revalidate: 60)' },
          { day: 'Thu', learn: 'Server Actions: forms without API routes, revalidatePath', build: 'Build: Add comment form using Server Action (no client-side fetch)' },
          { day: 'Fri', learn: 'generateStaticParams, generateMetadata, Next.js Image + Font', build: 'Add SEO metadata + optimize images' },
        ]
      },
      {
        week: 16, title: 'Next.js Auth + API Routes',
        goal: 'OAuth login, protected routes, and Prisma in Server Components.',
        days: [
          { day: 'Mon', learn: 'NextAuth.js v5: setup, Google provider, session management', build: 'Set up OAuth login with Google' },
          { day: 'Tue', learn: 'NextAuth: email magic link, protecting API routes, middleware', build: 'Add email sign-in + route protection middleware' },
          { day: 'Wed', learn: 'Next.js API Routes — when to use vs Server Actions', build: 'Build API routes for data called from client' },
          { day: 'Thu', learn: 'Prisma + Next.js — database access from Server Components', build: 'Connect Supabase PostgreSQL via Prisma to Next.js app' },
          { day: 'Fri', learn: 'Middleware for auth, redirects, A/B testing, locale', build: 'Write middleware: redirect unauthenticated users, add request logging' },
        ]
      },
      {
        week: 17, title: 'Angular + RxJS (Refresher)',
        goal: '1 real Angular feature: transaction history data grid with RxJS.',
        days: [
          { day: 'Mon', learn: 'Angular refresh: Components, Services, DI, *ngFor, *ngIf, [ngClass]', build: 'Build: User list component with a Service fetching from your API' },
          { day: 'Tue', learn: 'Angular Router: lazy loading, route guards. RxJS: Observable, Subject, BehaviorSubject, switchMap, debounceTime', build: 'Build: Live search bar with debounced RxJS HTTP call' },
          { day: 'Wed', learn: 'HttpClient + interceptors (auth header, error). Reactive Forms.', build: 'Build: Login form (Reactive Forms) + HttpClient interceptor' },
          { day: 'Thu', learn: 'Angular Signals (v17+). Custom pipes.', build: 'Build: Currency formatter pipe + refactor component to signals' },
          { day: 'Fri', learn: 'Angular Feature Complete: Transaction history data grid', build: 'Build search, sort, filter data grid — used in Project 2' },
        ]
      },
      {
        week: 18, title: 'PostgreSQL Deep Dive',
        goal: 'Write 10 complex queries. Add indexes. Design 3 schemas from scratch.',
        days: [
          { day: 'Mon', learn: 'Advanced JOINs, CTEs (WITH clause), window functions (ROW_NUMBER, RANK, LAG, LEAD)', build: 'Write 10 complex queries on a sample e-commerce dataset' },
          { day: 'Tue', learn: 'Indexes: B-Tree, GIN, partial indexes. EXPLAIN ANALYZE — read query plans', build: 'Add indexes to Project 1 DB. Compare query time before/after.' },
          { day: 'Wed', learn: 'Database normalization (1NF, 2NF, 3NF), schema design patterns, junction tables', build: 'Design 3 schemas from scratch: Blog, E-commerce, Chat App' },
          { day: 'Thu', learn: 'Transactions, ACID properties, FOR UPDATE, deadlock prevention', build: 'Write a transaction for a bank transfer — handle rollback on failure' },
          { day: 'Fri', learn: 'Connection pooling (pg-pool), N+1 problem detection + fix, Prisma optimizations', build: 'Find and fix an N+1 query in Project 1 using Prisma include' },
        ]
      },
      {
        week: 19, title: '🚀 Project 2 — FinTrack Pro (Week 1)',
        goal: 'Finance & Budget SaaS — core features built.',
        days: [
          { day: 'Mon', learn: 'Next.js 14 setup: App Router, NextAuth (Google OAuth), Prisma + Supabase', build: 'Initialize project, configure auth, connect database' },
          { day: 'Tue', learn: 'Database schema: Users, Accounts, Transactions, Categories, Budgets', build: 'Design and migrate the full financial schema' },
          { day: 'Wed', learn: 'Dashboard page: account balances, recent transactions (Server Components)', build: 'Build the main dashboard with real data' },
          { day: 'Thu', learn: 'Transaction CRUD: add, edit, delete, categorize (Server Actions)', build: 'Implement all transaction operations' },
          { day: 'Fri', learn: 'Budget management: set limits, show progress bars, alert at 80%', build: 'Build budget tracking feature' },
        ]
      },
      {
        week: 20, title: '🚀 Project 2 — FinTrack Pro (Week 2)',
        goal: 'Analytics, Angular embed, export — deploy live.',
        days: [
          { day: 'Mon', learn: 'Analytics page: spending by category (Recharts), month-over-month trend', build: 'Build analytics charts and trend visualization' },
          { day: 'Tue', learn: 'Embed Angular component: Transaction history data grid (from Week 17)', build: 'Integrate Angular microfrontend into Next.js app' },
          { day: 'Wed', learn: 'Search + filters: date range, category, amount range', build: 'Build advanced search and filtering system' },
          { day: 'Thu', learn: 'PDF export (jsPDF), responsive mobile design', build: 'Add PDF export feature, polish mobile layout' },
          { day: 'Fri', learn: 'Deploy: Vercel. Write README with screenshots + architecture diagram.', build: 'Deploy, document, add live URL to CV' },
        ],
        deliverable: '✅ PROJECT 2 DONE. FinTrack Pro live URL on your CV.'
      }
    ]
  },
  {
    phase: 5,
    title: 'The Differentiator Layer',
    subtitle: 'AI Integration + System Design + Docker + Kubernetes',
    weeks: 'Weeks 21–30 · Days 101–150',
    desc: 'The skills that make you the only candidate in the room who has all of this.',
    weeks_data: [
      {
        week: 21, title: 'AI Integration Foundations',
        goal: 'Make real API calls to OpenAI. Build a streaming code explainer.',
        days: [
          { day: 'Mon', learn: 'How LLMs work: tokens, context window, temperature, top-p', build: 'Read OpenAI API docs. Make your first API call — chat completion' },
          { day: 'Tue', learn: 'Prompt Engineering: system prompts, few-shot, chain-of-thought, JSON output', build: 'Build: "Explain this code" tool using GPT-4o' },
          { day: 'Wed', learn: 'Streaming responses — ReadableStream, Vercel AI SDK, useChat hook', build: 'Add streaming to your code explainer — show tokens as they arrive' },
          { day: 'Thu', learn: 'Embeddings: text-embedding-3-small, cosine similarity, what vectors mean', build: 'Generate embeddings for 10 sentences. Find the most similar pair.' },
          { day: 'Fri', learn: 'pgvector extension in PostgreSQL — storing and querying vectors', build: 'Set up pgvector in Supabase. Store embeddings. Run similarity search.' },
        ]
      },
      {
        week: 22, title: 'RAG Pipeline + AI Features',
        goal: 'Build a "Chat with a document" feature end-to-end.',
        days: [
          { day: 'Mon', learn: 'RAG architecture: chunking → embedding → storage → retrieval → generation', build: 'Draw the RAG pipeline on paper. Build a simple version.' },
          { day: 'Tue', learn: 'LangChain.js: chains, document loaders, text splitters, vector stores', build: 'Build: Upload a PDF → chunk it → embed it → store in pgvector' },
          { day: 'Wed', learn: 'Q&A over documents: retrieve chunks → pass to LLM → get answer', build: 'Build: "Chat with a document" feature' },
          { day: 'Thu', learn: 'Function calling / Tool use: structured JSON output from LLM', build: 'Build: AI that returns structured data (extract info from job description)' },
          { day: 'Fri', learn: 'Google Gemini API — same concepts, different provider', build: 'Repeat Monday\'s exercise using Gemini API instead of OpenAI' },
        ]
      },
      {
        week: 23, title: 'System Design',
        goal: 'Design 5 systems from scratch. Draw architectures with confidence.',
        days: [
          { day: 'Mon', learn: 'Scalability, Load Balancing, CDN, Horizontal vs Vertical scaling', build: 'Design: URL Shortener — draw the architecture' },
          { day: 'Tue', learn: 'Caching: Redis (read-through, write-through, eviction), CDN strategy', build: 'Design: Notification Service — add Redis caching layer' },
          { day: 'Wed', learn: 'Database: Read replicas, Sharding, Connection pooling, N+1 problem', build: 'Design: E-commerce Catalog — identify and fix N+1 in Project 1' },
          { day: 'Thu', learn: 'Message Queues: Kafka/RabbitMQ, pub/sub, event-driven architecture', build: 'Design: Real-time Chat System with WebSockets + Redis pub/sub' },
          { day: 'Fri', learn: 'CAP Theorem, API Gateway, Microservices vs Monolith trade-offs', build: 'Design: Rate Limiter from scratch (whiteboard style)' },
        ]
      },
      {
        week: 24, title: 'Docker',
        goal: 'Full project running locally with docker-compose. Instructions in README.',
        days: [
          { day: 'Mon', learn: 'Docker concepts: images, containers, layers, registry', build: 'Pull an nginx image. Run it. Inspect it.' },
          { day: 'Tue', learn: 'Write a Dockerfile for Node.js backend (multi-stage build)', build: 'Dockerize your Project 1 backend' },
          { day: 'Wed', learn: 'docker-compose.yml — multi-container: app + postgres + redis', build: 'Write docker-compose for Project 1: all 3 services with one command' },
          { day: 'Thu', learn: 'Docker volumes, networks, environment variables, .dockerignore', build: 'Run your full stack locally with docker-compose' },
          { day: 'Fri', learn: 'Push to Docker Hub. Pull on a clean machine. It should just work.', build: 'Add Docker instructions to your README' },
        ]
      },
      {
        week: 25, title: 'Kubernetes',
        goal: 'K8s manifests committed to GitHub. README says: "kubectl apply -f k8s/"',
        days: [
          { day: 'Mon', learn: 'K8s concepts: Pods, Nodes, Cluster, Control Plane', build: 'Install Minikube. Start a cluster. Run a Pod.' },
          { day: 'Tue', learn: 'Deployments, ReplicaSets, rolling updates', build: 'Write a Deployment YAML for backend. Apply it. Scale to 3 replicas.' },
          { day: 'Wed', learn: 'Services (ClusterIP, NodePort, LoadBalancer), Ingress', build: 'Expose your deployment via a Service. Access it from your browser.' },
          { day: 'Thu', learn: 'ConfigMaps, Secrets, environment variables in K8s', build: 'Move .env values to K8s Secrets. Inject them into Pods.' },
          { day: 'Fri', learn: 'Full K8s manifests. Commit to GitHub.', build: 'Add to README: "Kubernetes-ready. Deploy with kubectl apply -f k8s/"' },
        ]
      },
      {
        week: 26, title: '🚀 Capstone — NexaAI (Setup + Kanban)',
        goal: 'Project initialized and Feature 1 complete.',
        days: [
          { day: 'Mon', learn: 'Next.js 14 + TypeScript + Prisma + PostgreSQL + NextAuth setup', build: 'Initialize monorepo, configure all tools' },
          { day: 'Tue', learn: 'Database schema: Users, Projects, Tasks, Documents, AIInteractions', build: 'Design and migrate the full capstone schema' },
          { day: 'Wed', learn: 'Smart Kanban board — columns, cards, drag-and-drop', build: 'Build Kanban board (better than Project 1)' },
          { day: 'Thu', learn: 'Kanban: assignment, due dates, priority, labels', build: 'Add rich card features' },
          { day: 'Fri', learn: 'Kanban: real-time updates with Socket.io', build: 'Add live presence and real-time updates' },
        ]
      },
      {
        week: 27, title: '🚀 Capstone — NexaAI (AI Features)',
        goal: 'AI Code Review + Document Q&A features working.',
        days: [
          { day: 'Mon', learn: 'Feature 2: AI Code Review — paste code → get structured feedback', build: 'Build code review input + OpenAI integration' },
          { day: 'Tue', learn: 'Code Review: streaming response, syntax highlighting result', build: 'Add streaming + render formatted feedback' },
          { day: 'Wed', learn: 'Feature 3: Document Q&A — upload PDF → embed → chat', build: 'Build PDF upload + embedding pipeline' },
          { day: 'Thu', learn: 'RAG: retrieve chunks → LLM → display answer with sources', build: 'Build chat interface with source citations' },
          { day: 'Fri', learn: 'Feature 4: AI Standup Generator — GitHub commits → standup', build: 'Integrate GitHub API + AI standup generation' },
        ]
      },
      {
        week: 28, title: '🚀 Capstone — NexaAI (Infrastructure)',
        goal: 'Redis caching, Docker Compose, K8s manifests — all committed.',
        days: [
          { day: 'Mon', learn: 'Redis caching layer — cache AI responses, rate limit endpoints', build: 'Add Redis to the project, implement caching' },
          { day: 'Tue', learn: 'Rate limiting on AI endpoints (protect against abuse)', build: 'Add rate limiting + graceful degradation' },
          { day: 'Wed', learn: 'Docker Compose: app + postgres + redis + frontend', build: 'Write full docker-compose.yml for the capstone' },
          { day: 'Thu', learn: 'K8s manifests for all services', build: 'Write all K8s YAML files, test with Minikube' },
          { day: 'Fri', learn: 'CI/CD: GitHub Actions — tests + linting on every PR', build: 'Write .github/workflows/test.yml and ci.yml' },
        ]
      },
      {
        week: 29, title: '🚀 Capstone — NexaAI (Testing)',
        goal: '60%+ test coverage on critical paths.',
        days: [
          { day: 'Mon', learn: 'Jest: unit tests for AI service, auth middleware, task CRUD', build: 'Write unit tests — aim for critical path coverage' },
          { day: 'Tue', learn: 'Supertest: integration tests for all major API endpoints', build: 'Write API integration tests with test database' },
          { day: 'Wed', learn: 'RTL: tests for KanbanBoard, ChatWidget, Dashboard components', build: 'Write React component tests' },
          { day: 'Thu', learn: 'Test coverage report — identify gaps, write missing tests', build: 'Run coverage, add tests to reach 60% on critical paths' },
          { day: 'Fri', learn: 'Polish and bug fixes from test failures', build: 'Fix all failing tests, clean up console errors' },
        ]
      },
      {
        week: 30, title: '🚀 Capstone — NexaAI (Deploy + Demo)',
        goal: 'NexaAI live on the internet. 3-minute demo video recorded.',
        days: [
          { day: 'Mon', learn: 'Deploy: Vercel (frontend) + Railway (backend) + Supabase', build: 'Deploy all services, test end-to-end in production' },
          { day: 'Tue', learn: 'Full README: screenshots, architecture diagram, setup guide', build: 'Write world-class README' },
          { day: 'Wed', learn: 'Architecture diagram: draw all services and their connections', build: 'Create architecture diagram (use Excalidraw or Mermaid)' },
          { day: 'Thu', learn: 'Record a 3-minute Loom demo video — walk through all features', build: 'Record and edit the demo video' },
          { day: 'Fri', learn: 'Final polish: fix UI bugs, check all features work in prod', build: 'End-to-end smoke test, final touches' },
        ],
        deliverable: '✅ CAPSTONE DONE. NexaAI live + demo video recorded. This is the project that gets you hired.'
      }
    ]
  },
  {
    phase: 6,
    title: 'Interview Grind + Polish',
    subtitle: 'Interview Prep + Portfolio + Applications',
    weeks: 'Weeks 31–36 · Days 151–180',
    desc: 'Every morning: 2 LeetCode. Every afternoon: one deep-dive topic. Apply to 20 companies.',
    weeks_data: [
      {
        week: 31, title: 'Technical Preparation (Week 1)',
        goal: 'Daily LeetCode + JavaScript + React internals mastery.',
        days: [
          { day: 'Mon', learn: 'JavaScript internals deep-dive', build: 'Explain closures, event loop, prototypes — no notes' },
          { day: 'Tue', learn: 'React internals', build: 'Explain virtual DOM, reconciliation, fiber, Suspense' },
          { day: 'Wed', learn: 'Node.js + REST APIs', build: 'Design and explain your Project 1 API architecture' },
          { day: 'Thu', learn: 'Databases', build: 'Write SQL JOINs from memory. Explain indexing.' },
          { day: 'Fri', learn: 'System Design practice', build: 'Design 1 system using the 5-step framework' },
        ]
      },
      {
        week: 32, title: 'Technical Preparation (Week 2)',
        goal: 'Confident in every technical topic. Weak areas eliminated.',
        days: [
          { day: 'Mon', learn: 'TypeScript advanced patterns + DSA review', build: 'Mock coding round — 2 medium problems in 45 minutes' },
          { day: 'Tue', learn: 'Backend architecture + API design patterns', build: 'Explain your backend architecture without looking at code' },
          { day: 'Wed', learn: 'Docker + Kubernetes conceptual questions', build: 'Answer: "What is a pod? What is a deployment? What is a service?"' },
          { day: 'Thu', learn: 'AI/ML concepts for non-ML engineers', build: 'Explain RAG, embeddings, and function calling simply' },
          { day: 'Fri', learn: 'Full mock technical interview (2 hours)', build: 'Simulate a real technical interview. Record yourself.' },
        ]
      },
      {
        week: 33, title: 'Portfolio + Resume',
        goal: '1-page resume done. Portfolio site live. LinkedIn optimized.',
        days: [
          { day: 'Mon', learn: 'Resume writing: Action + Tech + Result format', build: 'Write resume — 1 page. Lead with Projects.' },
          { day: 'Tue', learn: 'Portfolio design: About, Projects, Skills, Contact', build: 'Build portfolio website in Next.js' },
          { day: 'Wed', learn: 'README polish: screenshots, live links, setup', build: 'Polish all 3 GitHub project READMEs' },
          { day: 'Thu', learn: 'LinkedIn optimization: headline, projects, skills', build: 'Update LinkedIn — professional headline, projects section' },
          { day: 'Fri', learn: 'Demo videos for each project', build: 'Record a 3-minute Loom video for each project' },
        ]
      },
      {
        week: 34, title: 'Applications Round 1',
        goal: 'Send 20 applications. Internshala, LinkedIn Easy Apply, AngelList.',
        days: [
          { day: 'Mon', learn: 'Research target companies — make a list of 30', build: 'Apply to 4–5 companies. Send personalized LinkedIn DMs.' },
          { day: 'Tue', learn: 'Customize resume and cover letter for each company', build: 'Apply to 4–5 more. Track applications in a spreadsheet.' },
          { day: 'Wed', learn: 'Network: reach out to alumni, attend virtual meetups', build: 'Apply to 4–5 more. Follow up on applications from Monday.' },
          { day: 'Thu', learn: 'Prepare answers for common HR questions', build: 'Apply to 4–5 more. Ask for referrals.' },
          { day: 'Fri', learn: 'Review and improve application materials based on feedback', build: 'Send remaining applications. Update tracker.' },
        ]
      },
      {
        week: 35, title: 'Mock Interviews',
        goal: 'Mock interview every day. Fix weaknesses. Get better each session.',
        days: [
          { day: 'Mon', learn: 'Pramp: 1 mock interview (peer-to-peer)', build: "Do mock, get feedback, write what you'll improve" },
          { day: 'Tue', learn: 'Interviewing.io: recorded mock interview', build: 'Do mock, review recording, fix weak areas' },
          { day: 'Wed', learn: 'System design mock with a friend or mentor', build: 'Design a system you haven\'t practiced before' },
          { day: 'Thu', learn: 'Behavioral interview practice — STAR method', build: 'Answer 10 behavioral questions. Record yourself.' },
          { day: 'Fri', learn: 'Full loop mock interview: DSA + System Design + Behavioral', build: 'Simulate a full interview day. Review and improve.' },
        ]
      },
      {
        week: 36, title: 'Real Interviews + Iteration',
        goal: 'Real interviews. Learn from every rejection. Ask for feedback.',
        days: [
          { day: 'Mon', learn: 'Prepare for scheduled interviews — review relevant tech', build: 'Go into every interview prepared, not hoping' },
          { day: 'Tue', learn: 'After each interview: write what went well + what to fix', build: 'Update your notes, practice weak areas' },
          { day: 'Wed', learn: 'Send thank-you emails. Ask for feedback on rejections.', build: 'Follow up on every interview outcome' },
          { day: 'Thu', learn: 'Keep sending applications — pipeline is everything', build: 'Apply to 5 more companies' },
          { day: 'Fri', learn: 'The journey continues — You are a developer now.', build: 'Celebrate progress. Keep building. Keep learning.' },
        ],
        deliverable: '🎉 You made it. The only way this fails is if you stop.'
      }
    ]
  }
];

export const PROJECTS: Project[] = [
  {
    id: 'devboard',
    number: '01',
    name: 'DevBoard',
    tagline: 'Kanban + Team Collaboration App',
    phase: 'Phase 3 — Weeks 13–14',
    weeks: 'Weeks 13–14 + 14B (Testing)',
    color: '#6366f1',
    status: 'not-started',
    tech: ['React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Prisma', 'JWT', 'Socket.io', 'React Query', 'Zustand', '@dnd-kit', 'Jest', 'Supertest', 'RTL'],
    milestones: [
      'Project setup: monorepo structure',
      'Auth flow: JWT + refresh tokens + protected routes',
      'Database schema: Users, Projects, Boards, Columns, Cards',
      'Backend CRUD APIs for all entities',
      'Frontend Auth pages with RHF + Zod',
      'Dashboard + Project list with React Query',
      'Kanban board with drag-and-drop (@dnd-kit)',
      'Task detail modal + comments + file upload',
      'Backend tests: auth, routes, Zod validators (Jest + Supertest)',
      'Frontend tests: KanbanBoard, auth redirect (RTL)',
      'GitHub Actions CI/CD pipeline',
      'Deploy: Railway + Vercel',
      'README with screenshots + live URL'
    ]
  },
  {
    id: 'fintrack',
    number: '02',
    name: 'FinTrack Pro',
    tagline: 'Finance & Budget SaaS',
    phase: 'Phase 4 — Weeks 19–20',
    weeks: 'Weeks 19–20 + 20B (Testing)',
    color: '#10b981',
    status: 'not-started',
    tech: ['Next.js 14', 'TypeScript', 'NextAuth v5', 'Prisma', 'Supabase', 'PostgreSQL', 'Server Actions', 'Angular', 'RxJS', 'Recharts', 'jsPDF', 'Jest', 'RTL'],
    milestones: [
      'Next.js 14 + NextAuth (Google OAuth) setup',
      'Database schema: Users, Accounts, Transactions, Categories, Budgets',
      'Dashboard: account balances + recent transactions',
      'Transaction CRUD with Server Actions',
      'Budget management + progress bars + 80% alert',
      'Analytics: spending charts (Recharts), month-over-month',
      'Angular transaction history data grid embedded',
      'Search + filters: date range, category, amount',
      'PDF export (jsPDF)',
      'Responsive mobile design',
      'Unit tests: Prisma services + utility functions (Jest)',
      'Component tests: Dashboard, TransactionList, BudgetCard (RTL)',
      'Deploy: Vercel + README with architecture diagram'
    ]
  },
  {
    id: 'nexaai',
    number: '03',
    name: 'NexaAI',
    tagline: 'AI-Powered Developer Productivity Platform',
    phase: 'Phase 5 — Weeks 26–30',
    weeks: 'Weeks 26–30 (Full Build)',
    color: '#f97316',
    status: 'not-started',
    tech: ['Next.js 14', 'TypeScript', 'Node.js', 'PostgreSQL', 'MongoDB', 'OpenAI API', 'Gemini API', 'pgvector', 'LangChain.js', 'Redis', 'Socket.io', 'Docker', 'Kubernetes', 'Vercel', 'Railway'],
    milestones: [
      'Project setup: Next.js 14 + TypeScript + Prisma + PostgreSQL + NextAuth',
      'Schema: Users, Projects, Tasks, Documents, AIInteractions',
      'Feature 1: Smart Kanban board (real-time with Socket.io)',
      'Feature 2: AI Code Review (streaming GPT-4o feedback)',
      'Feature 3: Document Q&A with RAG pipeline',
      'Feature 4: AI Standup Generator (GitHub API + LLM)',
      'Redis caching layer + rate limiting on AI endpoints',
      'Docker Compose: app + postgres + redis + frontend',
      'Kubernetes manifests for all services',
      'CI/CD: GitHub Actions (tests + linting on every PR)',
      'Backend tests: AI service, auth middleware, task CRUD',
      'API tests: all major endpoints (Supertest)',
      'Frontend tests: KanbanBoard, ChatWidget, Dashboard (RTL)',
      'Deploy: Vercel + Railway + Supabase',
      'Architecture diagram + full README',
      '3-minute Loom demo video'
    ]
  }
];

export const RULES: Rule[] = [
  {
    icon: '🔴',
    title: 'Git Commit Every Single Day',
    text: "No exceptions. Even if it's one line of code. Even if it's broken. The habit of committing daily is what builds the GitHub profile recruiters look at.",
    highlight: true
  },
  {
    icon: '📅',
    title: 'Never Skip Friday',
    text: "That's project day — the most important day. This is when you build things that go on your CV. Skipping Friday means skipping a week of growth.",
  },
  {
    icon: '🤔',
    title: 'Struggle First',
    text: 'If you don\'t understand something by Wednesday, Google + MDN + docs before watching a tutorial. The struggle is the learning. Tutorials are a shortcut that leads nowhere.',
  },
  {
    icon: '🗣️',
    title: 'Explain Out Loud Every Friday Evening',
    text: "Explain what you built to yourself out loud. If you can't explain it simply, you don't understand it yet. This is how you prepare for interviews without knowing it.",
  },
  {
    icon: '🚫',
    title: 'No DSA During Project Weeks',
    text: 'Context switching kills momentum. Don\'t grind LeetCode when you should be building. Project weeks are sacred. Two problems in the morning slot only.',
  },
  {
    icon: '🛠️',
    title: 'No New Tool Until You\'ve Used the Current One',
    text: 'Master one thing before moving to the next. The fastest way to know nothing about everything is to chase every new framework before shipping anything.',
  }
];

export const SKILLS_DEMAND: SkillDemand[] = [
  { skill: 'TypeScript', demand: 'high', notes: 'Not optional anymore. JS-only CVs get filtered.' },
  { skill: 'Next.js / React', demand: 'high', notes: 'App Router knowledge specifically asked in 2026.' },
  { skill: 'PostgreSQL + SQL', demand: 'high', notes: 'Backend roles — SQL round is standard.' },
  { skill: 'System Design (basics)', demand: 'medium', notes: 'Even freshers get "design a URL shortener".' },
  { skill: 'DSA (Easy–Medium)', demand: 'high', notes: 'Phone screen filter at 80% of product companies.' },
  { skill: 'Docker basics', demand: 'medium', notes: '"Have you Dockerized a project?" — yes/no filter.' },
  { skill: 'AI integration', demand: 'growing', notes: 'Differentiator in 2026 — most freshers have zero.' },
  { skill: 'Testing (Jest/RTL)', demand: 'growing', notes: '"Do your projects have tests?" shows maturity.' },
  { skill: 'Angular', demand: 'niche', notes: 'Enterprise/service companies, not startups.' },
  { skill: 'Kubernetes', demand: 'niche', notes: 'Knowing basics is enough for fresher level.' },
];

export const QUOTES: string[] = [
  "The only way this fails is if you skip days or stay passive.",
  "Depth of explanation beats number of projects every time.",
  "Avg CS degree is 1200-1500 hrs. You are doing same in 9 months but with better projects.",
  "Don't say you built a project. Say you solved an engineering problem.",
  "The struggle is the learning. Tutorials are a shortcut that leads nowhere.",
  "Every git commit is a proof of work that exists on the internet permanently.",
  "You will be the only fresher who can explain RAG, embeddings, and function calling technically.",
  "Explain closures, event loop, prototypes — no notes. If you can't, you don't know it.",
  "Most bootcamps charge $15,000 for this. You're doing it yourself. That already sets you apart.",
  "3 projects you can explain deeply beats 10 projects you copied from tutorials.",
];
