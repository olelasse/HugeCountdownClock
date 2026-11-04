# ⏱️ Huge Screen Countdown Clock

A sleek, distraction-free countdown clock engineered to fill the entire screen. Built with pure JavaScript, Tailwind CSS, and the Web Audio API—completely zero external audio dependencies.

Ideal for presentations, stage countdowns, focus/Pomodoro sessions, workout intervals, classroom timers, and livestream overlays.

---

## ✨ Features

- **Massive Screen-Filling Display**: Uses fluid `clamp()` sizing and strict line heights so numbers dynamically occupy nearly 100% of the viewport height and width.
- **Tabular Numerics**: Zero layout shifting or digit jumping as numbers count down.
- **Zero MP3 / Zero Asset Audio**: Synthesizes clean audio on the fly using the browser's native **Web Audio API**:
  - Crisp ticking clock sound effects during the final 5 seconds.
  - Deep harmonic gong / chime when time expires.
- **Fullscreen Mode**: Toggle with one click or press <kbd>F</kbd>. Includes auto-dimming chrome after 3 seconds of inactivity.
- **Slide-in Drawer Controls**: Easily set custom hours, minutes, and seconds or select fast 1m, 5m, 15m, or 1h presets.
- **Responsive & Dark Mode Native**: True black (`#000000`) background designed for OLED panels and stage monitors.

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
| --- | --- |
| <kbd>Space</kbd> | Start / Pause timer |
| <kbd>F</kbd> | Toggle Fullscreen |
| <kbd>C</kbd> | Open / Close Controls Drawer |
| <kbd>Esc</kbd> | Close Controls Drawer |
| *Click Anywhere* | Toggle Start / Pause |

---

## 📂 Project Structure

```text
├── LICENSE           # MIT License
├── index.html        # App markup and Tailwind layout
├── style.css         # Typography clamp rules, animations, and dark styling
├── script.js         # Countdown logic and Web Audio synthesis
└── README.md         # Project documentation
```

## 🚀 Getting Started

1. Clone or download the repository:

```bash
git clone [https://github.com/your-username/huge-countdown-clock.git](https://github.com/your-username/huge-countdown-clock.git)
cd huge-countdown-clock
```

2. Open `index.html` in any modern web browser.
3. No build tools, package managers, or local web servers are required!

## 📄 License

This project is open-source and available under the MIT License.
