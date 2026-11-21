# Kindora — Community Volunteering Platform

**Kindora** is a community volunteering platform that helps neighbours turn good intentions into shared action. Discover local initiatives, create your own, and join hands with people who care about the same causes.

**Live site:** https://your-live-site-url.com

> Replace the URL above with your deployed site link before submitting.

## Features

- **Discover local events** — Browse upcoming cleanups, plantations, donation drives, education and health initiatives happening near you.
- **Search & filter** — Find an event instantly by title or location and narrow results by event type (Cleanup, Plantation, Donation, Education, Health, Other).
- **Create your own initiative** — Publish a community event with a title, description, type, image, location and date, all from a single form.
- **One-click joining** — Join any event with a single click and keep track of everything you have signed up for.
- **Manage your events** — View the events you created, edit their details, or delete them. Edit and delete actions live right inside each event card.
- **Personal dashboards** — Dedicated "Events you joined" and "Manage your events" pages, protected so you only ever see your own data.
- **Secure authentication** — Email/password sign-up and sign-in powered by better-auth, with JWT-protected API requests and owner-only editing.
- **Dark & light theme** — A polished, fully responsive design system that adapts to the user's preferred colour scheme.

## Tech Stack

- **Framework:** Next.js 16 (App Router, React 19, React Compiler, Cache Components)
- **Styling:** Tailwind CSS v4 + a hand-rolled design system (`src/app/globals.css`)
- **Auth:** [better-auth](https://www.better-auth.com) with the JWT plugin, backed by MongoDB
- **Database:** MongoDB
- **API:** Sibling Express API (`../togetherly-server`, port 5000)
- **UI extras:** lucide-react icons, react-hot-toast notifications, next-themes

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
MONGODB_URL=your-mongodb-connection-string
BETTER_AUTH_SECRET=your-auth-secret
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Start the API server

The data API lives in the sibling repository:

```bash
cd ../togetherly-server
node index.js
```

### 4. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command         | Description                     |
| --------------- | ------------------------------- |
| `npm run dev`   | Start the development server    |
| `npm run build` | Create a production build       |
| `npm run start` | Run the production build        |
| `npm run lint`  | Lint the project with ESLint    |

## Project Structure

```
src/
├── app/                 # App Router pages (events, create-event, manage-events, profile, auth)
│   └── api/auth/        # better-auth catch-all route handler
├── components/          # Navbar, footer, event cards and home sections
├── lib/                 # API client, auth client and server auth config
└── types/               # Shared TypeScript types
```

## License

This project was built for learning and community impact.
