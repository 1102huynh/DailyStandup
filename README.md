# 📊 Daily Standup Generator

A modern, beautiful web application to generate professional daily standup updates in seconds. Built with React, TypeScript, Tailwind CSS, Shadcn UI, and Firebase.

![Daily Standup Generator](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/react-19.2.0-61dafb)
![TypeScript](https://img.shields.io/badge/typescript-5.9.3-3178c6)
![Vite](https://img.shields.io/badge/vite-7.2.5-646cff)

## ✨ Features

### Core Features
- 📝 **Smart Generation**: Convert your bullet points into professionally formatted standup updates
- 🎨 **Multiple Tones**: Choose from Formal, Casual, or Humorous tones
- 🎯 **Multiple Styles**: Short, Standard, Manager, or Developer styles
- 📋 **One-Click Copy**: Copy generated text to clipboard instantly
- 💾 **Auto-Save**: Automatic save to localStorage
- 📜 **History**: View and reuse past standup entries
- 🔐 **Google Authentication**: Sign in to sync across devices

### Advanced Features
- ☁️ **Cloud Sync**: Save your history to Firebase (when logged in)
- 📤 **Export**: Download your standup history as JSON
- 💡 **Smart Suggestions**: Get helpful tips as you type
- 🎨 **Beautiful UI**: Modern design with Shadcn UI components
- 📱 **Responsive**: Works perfectly on desktop and mobile

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase account (for authentication and cloud storage)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd DailyStandup
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   
   Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   
   Enable the following services:
   - Authentication (Google Sign-In)
   - Firestore Database
   
   Update `src/lib/firebase.ts` with your Firebase config:
   ```typescript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```

4. **Set up Firestore Security Rules**
   
   Go to Firestore Database → Rules and add:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /standups/{standupId} {
         allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
         allow create: if request.auth != null;
       }
     }
   }
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   
   Navigate to `http://localhost:5173`

## 📦 Tech Stack

- **Frontend Framework**: React 19.2.0
- **Language**: TypeScript 5.9.3
- **Build Tool**: Vite 7.2.5 (Rolldown)
- **Styling**: Tailwind CSS 3.x
- **UI Components**: Shadcn UI + Radix UI
- **Icons**: Lucide React
- **Backend**: Firebase (Auth + Firestore)
- **State Management**: React Hooks

## 🎯 Usage

### Generating a Standup

1. **Fill in your updates**:
   - Yesterday: What you accomplished yesterday
   - Today: What you'll work on today
   - Blockers: (Optional) Any issues or blockers

2. **Choose your preferences**:
   - **Tone**: Formal 💼 | Casual 👋 | Humorous 😄
   - **Style**: Short ⚡ | Standard 📝 | Manager 👔 | Developer 💻

3. **Generate**: Click "Generate Standup" button

4. **Copy & Share**: Use the "Copy to Clipboard" button to paste into Slack, Teams, or Jira

### Using History

- Click on any previous entry to load it
- Edit and regenerate with different tone/style
- Export your entire history as JSON

## 🗂️ Project Structure

```
DailyStandup/
├── src/
│   ├── components/
│   │   ├── ui/              # Shadcn UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── label.tsx
│   │   │   └── textarea.tsx
│   │   ├── CopyButton.tsx
│   │   ├── Header.tsx
│   │   ├── HistoryList.tsx
│   │   └── StandupForm.tsx  # Main form component
│   ├── hooks/
│   │   └── useAuth.ts       # Authentication hook
│   ├── lib/
│   │   ├── firebase.ts      # Firebase configuration
│   │   └── utils.ts         # Utility functions
│   ├── services/
│   │   ├── authService.ts   # Authentication logic
│   │   ├── standupGenerator.ts  # Text generation logic
│   │   └── storageService.ts    # Local & cloud storage
│   ├── types/
│   │   └── index.ts         # TypeScript types
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── public/
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## 🔧 Configuration

### Tailwind Configuration
The project uses custom CSS variables for theming. Modify `src/index.css` to customize colors.

### Firebase Configuration
Update `src/lib/firebase.ts` with your Firebase project credentials.

## 📝 Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## 🎨 Customization

### Adding New Tones
Edit `src/services/standupGenerator.ts` and add to `toneTemplates`:

```typescript
myTone: {
  prefix: '🎉 ',
  bulletPoint: '→ ',
  yesterdayLabel: 'Previous Day:',
  todayLabel: 'Current Day:',
  blockersLabel: 'Issues:',
  separator: '\n\n'
}
```

### Adding New Styles
Add to `styleModifiers` in `standupGenerator.ts`:

```typescript
myStyle: (text: string[]) => text.map(t => `[Custom] ${t}`)
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Upload 'dist' folder to Netlify
```

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase init hosting
npm run build
firebase deploy
```

## 🔮 Future Features (Roadmap)

### Pro Version Ideas
- ✅ **Jira Integration**: Auto-fetch tickets/issues
- ✅ **GitHub Integration**: Auto-read commits and PRs
- ✅ **Team Dashboard**: View entire team's standups
- ✅ **Weekly Summary**: Auto-generate weekly reports
- ✅ **Slack Bot**: Auto-send daily reminders
- ✅ **AI Enhancement**: Use GPT to improve text quality
- ✅ **Templates**: Save custom templates
- ✅ **Analytics**: Track your productivity patterns

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Shadcn UI](https://ui.shadcn.com/) - Beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Firebase](https://firebase.google.com/) - Backend services
- [Lucide](https://lucide.dev/) - Beautiful icons
- [Vite](https://vitejs.dev/) - Lightning-fast build tool

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

Made with ❤️ for developers | Daily Standup Generator © 2025

