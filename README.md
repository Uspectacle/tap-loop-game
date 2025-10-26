# 🎮 Tap Loop Game

A **grid-based path-drawing puzzle game** where you must create loops that pass through every block!

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-4.7.4-3178C6?logo=typescript)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Deployed-brightgreen?logo=github)

---

<p align="center">
  <a href="https://uspectacle.github.io/tap-loop-game/play" target="_blank">
    <strong>✨ Click Here To Play Tap Loop Game ✨</strong>
  </a>
</p>

---

> 🧠 _AI assistance was used during this project._

---

## 🎯 Gameplay Overview

You are the **blue arrow**, starting at the **blue dot**.
Your goal: **tap all activated blocks** and **return to your starting position**, forming a complete loop.

You can walk over your **own path**, but not over **obstacles**.

### Controls

Move the player using any of the following methods:

- 🖱️ **Click/Touch** on the desired destination
- ⌨️ **Arrow keys** to move
- 📱 **Swipe** in the desired direction

Use **Undo**, **Redo**, or **Reset** at any time to retry or adjust your path.

---

## 🧩 Board Editor

Customize the level directly from the editor:

- 🎯 **Move the start** by dragging the blue dot
- 🔲 **Activate/deactivate a block** by clicking on it
- 🚧 **Toggle an obstacle** by clicking between blocks
- ➕➖ **Add or remove** rows and columns using the `+ / -` buttons

---

## 🚀 Getting Started (Development)

Follow these steps to set up the project locally:

1. **Clone the repository**

   ```bash
   git clone https://github.com/Uspectacle/tap-loop-game.git
   cd tap-loop-game
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to **[http://localhost:3000](http://localhost:3000)**

---

### 🔥 Firebase Highscore Setup (Optional)

To enable the online highscore database, create a `.local.env` file and fill in your Firebase credentials:

```
NEXT_PUBLIC_FIREBASE_API_KEY="xxx"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="xxx"
NEXT_PUBLIC_FIREBASE_DATABASE_URL="xxx"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="xxx"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="xxx"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="xxx"
NEXT_PUBLIC_FIREBASE_APP_ID="xxx"
```

---

## 🤝 Contributing

Contributions are welcome!
If you find a bug, want to suggest a feature, or improve the code:

- Open an **issue**
- Submit a **pull request**

Let’s make the game better together 💪

---

## 📜 License

This project is licensed under the **GNU General Public License v3.0**.
See the [LICENSE](LICENSE) file for details.
