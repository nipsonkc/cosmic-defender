# 🚀 Cosmic Defender - Professional Space Shooter Game

A modern, high-quality **space shooter game** built with **Python Flask** backend and **HTML5 Canvas** frontend. Features 3 unique levels, boss battles, power-ups, particle effects, and smooth gameplay.

---

## 🎮 Gameplay Overview

- **3 Unique Levels**
  - 🌌 **Asteroid Field** – Balanced gameplay
  - 🌠 **Nebula Storm** – Fast-paced action
  - 🌑 **Black Hole** – Ultimate challenge
- **Wave-based combat** with progressive difficulty
- **Boss battles** every 5 waves with unique attack patterns
- **4 Enemy Types:** Basic, Fast, Tank, Shooter
- **4 Power-ups:** Shield, Rapid Fire, Spread Shot, Extra Life
- **Dynamic Scoring** and persistent high scores

---

## 🕹️ Controls

| Action | Key |
|:--|:--|
| Move | Arrow Keys (← ↑ ↓ →) |
| Fire | Space |
| Pause / Resume | P |

### Objective
- Destroy enemies to advance through waves  
- Collect power-ups to gain temporary boosts  
- Defeat bosses to unlock new stages  
- Avoid enemy fire and aim for the **highest score**

### Scoring System
| Enemy Type | Points |
|:--|:--|
| Basic | 10 |
| Fast | 20 |
| Tank | 30 |
| Shooter | 25 |
| Boss | 200 |
| Wave Bonus | 50 × Wave Number |

---

## 🧠 Technical Features

- Professional UI/UX with smooth transitions  
- Particle effects for explosions and trails  
- Modular, object-oriented architecture  
- Background music and sound effects  
- Persistent high-score tracking  

---

## 🛠️ Tech Stack

**Backend**
- Python 3.7+
- Flask Framework

**Frontend**
- HTML5 Canvas for rendering
- Vanilla JavaScript (ES6+) for logic
- CSS3 for animations and styling
- Web Audio API for sound effects

---

## 🧩 Code Architecture

| Class | Function |
|:--|:--|
| `Game` | Core game loop and state management |
| `Player` | Ship controls and actions |
| `Enemy` | Enemy spawning and behavior |
| `Boss` | Boss mechanics and special attacks |
| `PowerUp` | Power-up logic |
| `ParticleSystem` | Visual effects |
| `AudioSystem` | Sound management |
| `UIManager` | Handles HUD and interface |

---

## ⚙️ Installation & Setup

### 1. Prerequisites
- Python 3.7 or higher  
- `pip` installed  

### 2. Install Dependencies
```bash
pip install -r requirements.txt
