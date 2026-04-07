# TaskQuest - TODO List with Creature Evolution 🐉

A Trello-inspired task management app with gamification. Complete tasks to earn XP and evolve your creature from an egg to a mighty dragon!

![TaskQuest Banner](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 🎯 Complete Trello Functionality
- **Multiple Boards** - Create unlimited project boards
- **Drag & Drop** - Smooth card movement between lists
- **Drag to Delete** - Intuitive trash zone for easy deletion
- **Labels** - Color-coded tags with custom text
- **Due Dates** - Visual indicators for deadlines and overdue tasks
- **Recurring Tasks** - Auto-recreate tasks daily, weekly, or monthly
- **Rich Descriptions** - Markdown-style task details
- **Checklists** - Subtasks with progress tracking
- **Comments** - Timestamped notes and updates

### 🎮 Gamification System
- **XP Rewards**
  - 10 XP for completing tasks
  - +5 XP bonus for finishing before due date
  - +20 XP bonus for completing all tasks in a list
- **Creature Evolution** (3 Stages)
  - 🥚 **Egg** (0 XP) - Your journey begins
  - 🐣 **Baby** (100 XP) - It's hatching!
  - 🐉 **Dragon** (300 XP) - Fully evolved
- **XP Notifications** - Visual popups when you earn points
- **Custom Names** - Name your creature companion
- **Progress Tracking** - Stats dashboard with total XP and tasks completed

### 🎨 Beautiful Design
- Dark blue gradient theme
- Smooth animations & transitions
- Glassmorphism effects
- Clean, distraction-free interface
- Fully responsive layout

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 16.2** | React framework with App Router |
| **TypeScript 5.4** | Type-safe development |
| **Tailwind CSS 3.4** | Utility-first styling |
| **shadcn/ui** | High-quality UI components |
| **@dnd-kit** | Modern drag-and-drop library |
| **date-fns 3.6** | Date manipulation |
| **localStorage** | Client-side data persistence |
| **Vercel** | Deployment platform |

## 🚀 Running Locally

### Prerequisites

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download here](https://git-scm.com/)

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/SamuiKuma/TODO-list.git
cd TODO-list

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open browser
# Navigate to http://localhost:3000
```

That's it! The app should now be running on your machine.

### Available Scripts

```bash
npm run dev      # Start development server (hot reload enabled)
npm run build    # Build for production
npm start        # Run production build locally
npm run lint     # Run ESLint checks
```

### Building for Production

```bash
# Create optimized production build
npm run build

# Test production build locally
npm start
```

## 📁 Project Structure

```
TODO-list/
├── app/                      # Next.js App Router
│   ├── globals.css          # Global styles & Tailwind
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Main home page
│
├── components/              # React components
│   ├── Board.tsx            # DnD context & board logic
│   ├── Card.tsx             # Individual task card
│   ├── CardModal.tsx        # Full card editor modal
│   ├── DeleteZone.tsx       # Drag-to-delete trash zone
│   ├── EggDisplay.tsx       # Creature evolution display
│   ├── List.tsx             # Column/list component
│   ├── Sidebar.tsx          # Board navigation panel
│   ├── XPNotification.tsx   # XP popup notifications
│   ├── DebugPanel.tsx       # localStorage inspector
│   └── ui/                  # shadcn/ui components
│       ├── button.tsx
│       ├── input.tsx
│       └── textarea.tsx
│
├── hooks/                   # Custom React hooks
│   └── useLocalStorage.ts  # localStorage persistence hook
│
├── types/                   # TypeScript definitions
│   └── index.ts            # All interfaces & types
│
├── lib/                     # Utilities
│   └── utils.ts            # Helper functions (cn, etc.)
│
├── public/                  # Static assets
│
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── tailwind.config.ts       # Tailwind config
├── next.config.mjs          # Next.js config
└── vercel.json              # Vercel deployment config
```

## 💡 How to Use

### Getting Started
1. **Create your first board** - Click "New Board" in the left sidebar
2. **Add lists** - Click "Add List" to create columns (e.g., "To Do", "Doing", "Done")
3. **Create tasks** - Click "Add Card" in any list

### Managing Tasks
- **Edit task** - Click on the card title to open the editor
- **Move task** - Drag the grip handle (⋮⋮) to move between lists
- **Delete task** - Drag card to the red trash zone at the bottom
- **Complete task** - Click the checkbox to mark as done

### Card Features
| Feature | How to Use |
|---------|------------|
| **Labels** | Click "Add Label" → Choose color → Enter text |
| **Due Date** | Set datetime → Get visual indicators for deadlines |
| **Recurrence** | Select frequency (daily/weekly/monthly) |
| **Description** | Click description area → Add detailed notes |
| **Checklists** | Add checklist → Create subtasks |
| **Comments** | Add timestamped notes and updates |

### Earning XP & Evolving
1. **Complete tasks** to earn XP (shown in popup notifications)
2. **Watch the progress bar** in the creature panel on the right
3. **Evolve your creature** at XP milestones:
   - 100 XP: 🥚 Egg → 🐣 Baby
   - 300 XP: 🐣 Baby → 🐉 Dragon
4. **Name your creature** when it hatches
5. **Start a new egg** after reaching full evolution

### XP Earning Guide
- ✅ Complete any task: **+10 XP**
- ⏰ Beat the due date: **+5 bonus XP**
- 🎯 Complete entire list: **+20 bonus XP**

### Debug Panel
Click the bug icon (🐛) in the bottom-right to:
- Inspect localStorage data
- View raw JSON
- Clear all data (fresh start)
- Auto-refresh every second

## 🌐 Deployment

### Deploying to Vercel

**Option 1: GitHub Integration (Recommended)**

1. Push your code to GitHub
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. Go to [vercel.com](https://vercel.com) and sign in with GitHub

3. Click "Add New Project"

4. Import your repository

5. Click "Deploy" (Vercel auto-detects Next.js settings)

6. Get your live URL! 🎉

**Option 2: Vercel CLI**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow the prompts
```

### Auto-Deploy
Every push to the `main` branch automatically triggers a new deployment on Vercel.

## 🔧 Customization

### Change XP Values

Edit `types/index.ts`:
```typescript
export const XP_VALUES = {
  TASK_COMPLETE: 10,           // Base XP per task
  TASK_BEFORE_DUE_DATE: 5,     // Bonus for early completion
  LIST_COMPLETE: 20,           // Bonus for completing all tasks
};
```

### Modify Evolution Stages

Edit `types/index.ts`:
```typescript
export const EGG_STAGES = [
  { name: "Egg", xpRequired: 0, emoji: "🥚" },
  { name: "Baby", xpRequired: 100, emoji: "🐣" },
  { name: "Adult", xpRequired: 300, emoji: "🐉" },
  // Add more stages here!
];
```

### Customize Theme

Edit `app/globals.css` for colors:
```css
@layer base {
  body {
    @apply bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700;
  }
}
```

Modify `tailwind.config.ts` for Tailwind customization.

## 💾 Data Storage

- **localStorage** - All data stored in browser (no server needed)
- **Automatic saving** - Changes persist instantly
- **Per-device** - Data is device/browser specific
- **No login required** - Perfect for personal use
- **Privacy** - All data stays on your device

### Data Structure
```typescript
{
  boards: [
    {
      id: string,
      title: string,
      lists: [...]
    }
  ],
  userProgress: {
    totalXP: number,
    eggProgress: number,
    eggStage: number,
    creatureName: string,
    tasksCompleted: number
  }
}
```

## 🐛 Troubleshooting

### Development server won't start

```bash
# Kill existing process
taskkill /PID <PID> /F

# Or just restart
npm run dev
```

### Build fails

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Changes not saving

1. Open Debug Panel (🐛 icon)
2. Check if data appears in localStorage
3. Try clearing browser cache
4. Disable browser extensions that block localStorage

### Port 3000 already in use

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use a different port
PORT=3001 npm run dev
```

## 🚀 Future Ideas

Potential enhancements:
- [ ] Multiple creature types to choose from
- [ ] Achievement badges system
- [ ] Task priority levels (high/medium/low)
- [ ] Search and filter functionality
- [ ] Export/import boards as JSON
- [ ] Dark/light theme toggle
- [ ] Keyboard shortcuts
- [ ] Team collaboration features
- [ ] Mobile responsive improvements
- [ ] PWA (Progressive Web App) support

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - Free to use for personal and commercial projects.

## 🙏 Acknowledgments

- **Trello** - Inspiration for the kanban board design
- **Habitica** - Gamification and habit-tracking concepts
- **shadcn/ui** - Beautiful component library
- **Vercel** - Seamless deployment platform

## 📞 Support

If you encounter issues:
1. Check the [Troubleshooting](#-troubleshooting) section
2. Open an issue on GitHub
3. Check existing issues for solutions

---

**Built with ❤️ by [SamuiKuma](https://github.com/SamuiKuma)**

**Happy Task Questing! 🐉✨**
