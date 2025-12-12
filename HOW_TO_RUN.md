# How to Run the Daily Standup App

## Quick Start

### Option 1: Using the Start Script (Recommended)
This automatically kills port 5173 before starting the dev server:

```bash
npm start
```

### Option 2: Using Dev Only
If you're sure port 5173 is free:

```bash
npm run dev
```

## What Happens

1. **Port Check**: The `kill-port.ps1` script checks if port 5173 is in use
2. **Port Cleanup**: If the port is occupied, it kills all processes using it
3. **Server Start**: Vite dev server starts on port 5173 (fixed, no random ports)

## Configuration

### Vite Config (`vite.config.ts`)
- **Fixed Port**: 5173
- **Strict Port**: Server will exit if port is already in use (when using `npm run dev`)
- **Host**: Exposed to network

### Package.json Scripts
- `npm start` - Kill port 5173 and start dev server (recommended)
- `npm run dev` - Start dev server only
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Access Your App

Once started, open your browser to:
**http://localhost:5173**

## Troubleshooting

### If port 5173 is still in use:
Run the kill script manually:
```bash
powershell -ExecutionPolicy Bypass -File ./kill-port.ps1
```

### To manually kill the port:
```bash
# Find processes using port 5173
netstat -ano | Select-String ":5173"

# Kill specific process by PID
Stop-Process -Id <PID> -Force
```

### To use a different port:
Edit `vite.config.ts` and change the port number in the server configuration.

## Files Modified

1. **vite.config.ts** - Added fixed port configuration
2. **package.json** - Added `start` script
3. **kill-port.ps1** - New script to clean up port 5173
4. **postcss.config.js** - Updated for Tailwind CSS v4
5. **index.css** - Updated for Tailwind CSS v4 syntax
6. **tailwind.config.js** - Fixed configuration

## All Fixed Issues

✅ TypeScript import errors
✅ Tailwind CSS v4 compatibility
✅ PostCSS configuration
✅ Fixed port configuration
✅ Automatic port cleanup before starting

