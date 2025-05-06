# AI‑Driven Endangered Language Revitalization Toolkit

Empowering communities to preserve, teach, and revitalize endangered languages with AI-generated lessons, adaptive learning, and community-driven practice.

---

## 🚀 Overview

This open-source platform enables community linguists and learners to collaboratively upload language data, generate interactive lessons, and track progress. The toolkit leverages AI to create engaging, adaptive learning experiences and fosters community practice for language preservation.

---

## ✨ Key Features

- **Secure, Role-Based Access**: Powered by Clerk (Linguist, Learner roles)
- **Language Data Upload**: Word lists, grammar rules, audio samples
- **AI-Generated Lessons**: Flashcards, pronunciation drills, story-based dialogues
- **Adaptive Learning**: Monitors progress, adjusts difficulty, recommends practice partners
- **Community Practice**: Connects learners for collaborative sessions
- **Reminders & Recommendations**: Inngest-powered notifications and lesson updates
- **Progress Analytics**: Visualize retention and receive targeted reinforcement
- **Modern UI**: Built with Tailwind CSS and Shadcn UI

---

## 🛠️ Tech Stack

- **Next.js** (App Router, SSR/SSG)
- **React 19**
- **Prisma** (PostgreSQL or SQLite)
- **Clerk** (Authentication & User Management)
- **Gemini API** (AI lesson generation)
- **Inngest** (Background jobs, reminders)
- **Tailwind CSS** + **Shadcn UI** (UI components)

---

## ⚡ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/ai-language-preservation
cd ai-language-preservation
```

### 2. Install dependencies

```bash
pnpm install
# or
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory. Example:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/yourdb
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
```

### 4. Set up the database

```bash
npx prisma migrate dev --name init
```

### 5. Run the development server

```bash
pnpm dev
# or
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the app.

---

## 🧑‍💻 Contributing

1. Fork the repo and create your branch: `git checkout -b feature/your-feature`
2. Make your changes and commit: `git commit -am 'Add new feature'`
3. Push to your fork: `git push origin feature/your-feature`
4. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgements

- Community linguists and language activists
- Open-source contributors
- [Clerk](https://clerk.com/), [Prisma](https://prisma.io/), [Inngest](https://www.inngest.com/), [Gemini API](https://ai.google.dev/gemini-api)
