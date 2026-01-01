# Akimbo Labs

A high-performance, immersive portfolio experience built for **Akimbo Labs**. This project pushes the boundaries of traditional web design by merging an "Architectural HUD" aesthetic with futuristic glassmorphism and smooth, physics-based interactions.

![Portfolio Preview Showcase](adev-icon.jpg)

## 🚀 Key Features

### 🛠️ Architectural HUD Project Cards
- **3D Perspective Shift**: Projects rotate in 3D space on hover using `preserve-3d`.
- **Active Lock-On System**: Digital corner brackets (HUD elements) that react and scale upon selection.
- **Cinematic Scanline**: A moving vertical light beam that "scans" project previews in real-time.
- **Floating Data Tags**: Technical metadata (ID, Status) slides in with a terminal-inspired animation.

### ✨ Immersive Visuals
- **Fluid Particle Engine**: A background powered by Three.js/Canvas providing a sense of depth and motion.
- **Glassmorphic Bento Grid**: A premium navigation system utilizing high-level blur effects and interactive tiles.
- **Dynamic Noise Texture**: A global grain/noise overlay for a cinematic "film-like" finish.
- **Custom Cursor**: A magnetic, reactive pointer that interacts with clickable elements.

### 📬 Stealth Communication
- **AJAX-Only Forms**: Contact submissions are handled entirely via background fetch (no page reloads).
- **Web3Forms Integration**: Secure, serverless email handling with spam protection.
- **Dynamic Success Modals**: Custom-designed glassmorphic feedback for users.

## 🛠️ Tech Stack

- **Structure**: Semantic HTML5
- **Design**: Vanilla CSS3 (Custom Variables, Flexbox, CSS Grid)
- **Logic**: Vanilla ES6+ JavaScript
- **Animations**: CSS Keyframes & Web Animations API
- **Icons**: Remix Icon & BoxIcons

## 📦 Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/aksh120/akimbolabs-portfolio.git
   ```

2. **Open `index.html`**:
   Simply open the file in any modern browser. For the contact form to work properly (avoiding CORS issues), it is recommended to use a local development server like **VS Code Live Server**.

3. **Configure Contact Form**:
   Replace the `access_key` value in the `index.html` contact form with your own key from [Web3Forms](https://web3forms.com/).

---

*“Constructing the unseen. Crafted for impact.”*
