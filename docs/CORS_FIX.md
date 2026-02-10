# Solution: CORS Error / White Screen Issue

## The Problem

When you try to open `index.html` by double-clicking it in your file explorer, you see:
- ❌ **White/blank screen**
- ❌ **CORS error in console**: `Cross-Origin Request blocked: The Same Origin Policy disallows reading the remote resource at file:///src/main.js`

## Why This Happens

Modern web browsers **block ES6 module imports** from the `file://` protocol for security reasons. Since this game uses JavaScript modules (`<script type="module">`), it **requires an HTTP server** to function.

Think of it like this:
- Opening a file directly = `file://` protocol (❌ Blocked for modules)
- Using a web server = `http://` protocol (✅ Works perfectly)

## The Solution (3 Simple Steps)

### Step 1: Install Node.js
If you don't have it already, download from: https://nodejs.org
(Choose the LTS version)

### Step 2: Open Terminal/Command Prompt
- **Windows**: Press `Win + R`, type `cmd`, press Enter
- **Mac**: Press `Cmd + Space`, type `terminal`, press Enter
- **Linux**: Press `Ctrl + Alt + T`

Navigate to the game folder:
```bash
cd path/to/Jamy
```

### Step 3: Run These Commands
```bash
npm install
npm run gen-assets
npm run dev
```

**That's it!** The game will automatically open in your browser at `http://localhost:3000`

## What We've Added to Help You

When you try to open `index.html` directly now, you'll see a **friendly error message** instead of a confusing white screen. The message includes:

✅ Clear explanation of the problem
✅ Step-by-step instructions to fix it
✅ Command examples you can copy/paste
✅ Link to download Node.js

## Alternative Method: Build First

If you prefer, you can build the game and then preview it:

```bash
npm run build
npm run preview
```

This creates an optimized production version in the `dist/` folder.

## Quick Reference

| ❌ Don't Do This | ✅ Do This Instead |
|-----------------|-------------------|
| Double-click `index.html` | Run `npm run dev` |
| Open file directly | Use HTTP server |
| Use `file://` protocol | Use `http://localhost:3000` |

## Still Having Issues?

Check the full [README.md](README.md) for more troubleshooting tips, or check the Troubleshooting section which covers:
- Node.js installation
- Port conflicts
- Asset generation
- Browser cache issues

## For Developers

This is a **fundamental requirement** for modern JavaScript applications using ES modules. The game uses:
- Phaser 3 (game engine)
- Vite (build tool and dev server)
- ES6 modules (requires HTTP server)

There's no workaround for this - it's a browser security feature. You **must** use a development server or build the project.

---

**Remember**: Modern web apps need modern tools. Running `npm run dev` is just as simple as double-clicking a file, and it gives you hot-reload, better debugging, and the full development experience! 🚀
