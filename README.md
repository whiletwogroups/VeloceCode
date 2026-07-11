# ⚡ VeloceCode — Premium Developer Training & Roadmap Platform

VeloceCode is a world-class, premium engineering tracker designed to help self-directed learners master full-stack software development, cloud systems, AI engineering, and technical algorithm tracks. 

Inspired by Linear, Raycast, and Apple Human Interface Guidelines, the interface is styled using customized glassmorphism, dynamic color themes, and highly accessible responsive layouts.

---

## ✨ Features

### 🎓 1. Multi-Course Catalog
* Select and study from **8 custom curriculum roadmaps**:
  1. **Full-Stack Web Development** (HTML, JS, React, Node.js, Prisma, SQL)
  2. **AI & Machine Learning Engineering** (Python, PyTorch, LLMs, LangChain, RAG)
  3. **Data Science & Analytics** (Pandas, Scikit-learn, SQL, Tableau)
  4. **Cybersecurity & Defenses** (Linux Shell, Networking, Penetration Testing)
  5. **Android App Engineering** (Kotlin, Jetpack Compose, MVVM, Room DB)
  6. **DevOps & Site Reliability** (Docker, Kubernetes, AWS Cloud, CI/CD)
  7. **UI/UX Product Design** (Figma, Design Systems, UX Research)
  8. **Cloud Architect Engineering** (AWS, Azure, GCP, Serverless Architecture)
* **Single Active Course Constraint**: Enforces focused, sequential learning by limiting students to one active curriculum path at a time. Switching paths warns the user and resets prior checklists to prevent progress clutter.

### 📊 2. Dynamic Progress Dashboard
* Track global XP progress, coder levels, and Git flame streaks.
* Single-row stats banner showing **Day of Journey**, **Tasks Completed**, **Finished Projects**, **Hours Studied**, and **Git Commits**.
* Interactive curriculum allocation charts (SVG Ring charts) and daily activity heatmap contribution calendars.

### 🗺️ 3. Expandable Weekly Timelines
* Browse phase modules. Click week cards to expand daily checklists.
* Check off **📖 LEARN** reading logs and **🛠️ BUILD** coding milestones.
* Confetti burst celebration animations when completing all days inside a week.

### ⏱️ 4. Pomodoro Focus Timer & Ambient Synthesizer
* Focus timers with custom duration presets (25m Focus, 50m Learn, 5m Rest, 15m Break).
* Integrated **Web Audio API Ambient Synthesizer** generating white noise, deep rain pitter-patter, or space drones to isolate your workspace.

### 🧩 5. DSA Problems Register
* Track progress towards 230 target challenges.
* Log challenges with difficulty ratings (Easy 🟢, Medium 🟡, Hard 🔴), topics, and target study phases.
* Register table with difficulty/phase filters and custom deletion confirmation overlays.

### 📜 6. Weekly Certificates
* Unlocks printable/downloadable weekly completion badges once all day checklist items in that week are checked off.

### 🔒 7. Cloud Sync & Fallback Auth Modals
* Built on a hybrid database sync. Connects to Google Firebase Auth and Firestore Cloud or falls back to offline browser JSON databases automatically.

---

## 🛠️ Stack & Technologies

1. **Frontend Core**: React 19, JavaScript (JSX)
2. **Bundler & Compiler**: Vite 8, Rolldown
3. **Styling**: Modern CSS Custom Properties (Blueprint, Parchment, Verdigris, and Ember themes)
4. **Backend Sync**: Firebase Client API SDK (Auth, Firestore)
5. **Notifications**: Custom React Modals and Slide-Up Toasts

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open `http://localhost:8080/` in your browser.

### 3. Compile Production Static Bundle
```bash
npm run build
```
The compiled output will be generated inside the `dist/` directory, ready to be hosted on Vercel or Netlify.

---

## 📋 Rules & Coder Conduct
1. **Daily Commits (Non-Negotiable)**: Make at least one valid Git commit daily to build consistency.
2. **Time Isolation**: Block focus study sessions in 25-minute Pomodoro intervals.
3. **Review Checkpoints**: Perform end-of-day reviews and write logs in your study journal.
