# TaskQuest - TODO List with XP & Egg Hatching 🐉

A Trello-inspired TODO list application with gamification features including XP rewards and creature egg hatching. Built with Next.js and deployed on Vercel.

## Features

### 🎯 Trello-Inspired Features
- **Multiple Boards**: Create and manage multiple project boards
- **Lists & Cards**: Organize tasks in customizable lists
- **Drag & Drop**: Intuitive drag-and-drop interface powered by dnd-kit
- **Labels**: Color-coded tags for easy categorization
- **Due Dates**: Set deadlines and get visual indicators
- **Descriptions**: Add detailed descriptions to tasks
- **Checklists**: Break down tasks into subtasks
- **Comments**: Add notes and updates to tasks

### 🎮 Gamification System
- **XP Rewards**: Earn experience points for completing tasks
  - Base XP for task completion
  - Bonus XP for completing tasks before due date
  - Extra XP for completing all tasks in a list
- **Level Up**: Progress through levels as you complete more tasks
- **Egg Hatching**: Watch your creature evolve as you earn XP
  - Egg Stage 🥚
  - Baby Stage 🐣
  - Adult Stage 🐉
- **Name Your Creature**: Personalize your companion

### 🎨 Design
- Sleek dark blue gradient theme
- Smooth animations and transitions
- Responsive layout
- Modern UI with shadcn/ui components

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Drag & Drop**: @dnd-kit
- **Storage**: localStorage (client-side persistence)
- **Deployment**: Vercel

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Deployment to Vercel

### Option 1: Deploy with Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts to complete deployment

### Option 2: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Next.js and configure settings
6. Click "Deploy"

## Usage

### Creating Your First Board
1. Click "New Board" in the sidebar
2. Enter a board name
3. Start adding lists (columns)

### Adding Tasks
1. Click "Add Card" in any list
2. Enter a task title
3. Click on the card to add details:
   - Description
   - Labels
   - Due date
   - Checklists
   - Comments

### Earning XP
- Complete tasks: **+10 XP**
- Complete before due date: **+5 bonus XP**
- Complete all tasks in a list: **+20 bonus XP**

### Hatching Your Creature
1. Complete tasks to earn XP
2. Watch your egg progress bar fill up
3. Your creature evolves at certain XP thresholds:
   - **Egg** → **Baby** (100 XP)
   - **Baby** → **Adult** (300 XP)
4. Name your creature when it hatches!
5. Once fully evolved, you can choose to start a new egg

## Project Structure

```
├── app/
│   ├── globals.css          # Global styles with Tailwind
│   ├── layout.tsx            # Root layout
│   └── page.tsx             # Main app page
├── components/
│   ├── ui/                   # Reusable UI components
│   ├── Board.tsx             # Board container with DnD
│   ├── List.tsx              # List/column component
│   ├── Card.tsx              # Task card component
│   ├── CardModal.tsx         # Card detail modal
│   ├── Sidebar.tsx           # Board navigation
│   ├── XPBar.tsx             # XP progress bar
│   └── EggDisplay.tsx        # Creature display
├── hooks/
│   └── useLocalStorage.ts   # localStorage persistence
├── lib/
│   └── utils.ts             # Utility functions
└── types/
    └── index.ts             # TypeScript type definitions
```

## Data Persistence

All data is stored in the browser's localStorage:
- Boards and tasks persist between sessions
- XP progress and egg state saved automatically
- Works offline after initial load

## Customization

### Changing XP Values
Edit `types/index.ts`:
```typescript
export const XP_VALUES = {
  TASK_COMPLETE: 10,
  TASK_BEFORE_DUE_DATE: 5,
  LIST_COMPLETE: 20,
};
```

### Modifying Evolution Stages
Edit `types/index.ts`:
```typescript
export const EGG_STAGES = [
  { name: "Egg", xpRequired: 0, emoji: "🥚" },
  { name: "Baby", xpRequired: 100, emoji: "🐣" },
  { name: "Adult", xpRequired: 300, emoji: "🐉" },
];
```

### Adjusting Theme Colors
Edit `tailwind.config.ts` and `app/globals.css` for color scheme changes.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

MIT

## Acknowledgments

- Inspired by Trello's kanban board design
- Gamification concepts from habit-tracking apps
- Built with modern web technologies

---

**Happy Task Questing! 🚀✨**
