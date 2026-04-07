## Quick Start Guide

### 1. Development Server
The development server should already be running on http://localhost:3000

If not, run:
```bash
npm run dev
```

### 2. First Steps
1. Open http://localhost:3000 in your browser
2. You'll see a default board with 3 lists (To Do, In Progress, Done)
3. Click "Add Card" in any list to create your first task
4. Watch your XP bar at the top as you complete tasks!

### 3. Try These Features
- **Create a card**: Click "Add Card" and enter a title
- **Open card details**: Click on any card to add description, labels, due dates, checklists, and comments
- **Complete a task**: Click the circle icon on a card to mark it complete and earn XP
- **Drag and drop**: Drag cards between lists
- **Add labels**: Open a card and add colorful labels
- **Set due dates**: Add deadlines to track important tasks
- **Create checklists**: Break down complex tasks into steps
- **Watch your creature grow**: Your egg will evolve as you earn XP!

### 4. XP System
- Complete a task: +10 XP
- Complete before due date: +5 bonus XP
- Complete all tasks in a list: +20 bonus XP

### 5. Egg Evolution
- 0 XP: 🥚 Egg
- 100 XP: 🐣 Baby (name your creature!)
- 300 XP: 🐉 Adult (fully evolved!)

### 6. Deploy to Vercel
When ready to deploy:
```bash
npm install -g vercel
vercel
```

Or connect your GitHub repo to Vercel dashboard for automatic deployments.

## Troubleshooting

### Server won't start?
Make sure port 3000 is available:
```bash
# Kill any process using port 3000 (Windows)
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```

### Dependencies issue?
Try cleaning and reinstalling:
```bash
Remove-Item -Recurse -Force node_modules, .next
npm install
```

### Build fails?
Check TypeScript errors:
```bash
npm run lint
```
