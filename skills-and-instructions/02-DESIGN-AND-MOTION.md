# 02. Anti-AI-Slop UI/UX & Motion Engineering

This guide consolidates the design craft standards from **Emil Kowalski Motion**, **Taste Skill Anti-Slop**, and **Impeccable Style**.

---

## 1. Emil Kowalski Motion Tokens (Vanilla CSS)

Add to `globals.css`:
```css
:root {
  /* Emil Kowalski Motion Tokens */
  --ease-snappy: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-smooth: cubic-bezier(0.65, 0, 0.35, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --duration-fast: 150ms;
  --duration-normal: 220ms;
  --duration-slow: 350ms;
}

/* Tactile Button Press Physics */
button, .button, a.button {
  transition: transform var(--duration-fast) var(--ease-snappy),
              background-color var(--duration-fast) ease,
              border-color var(--duration-fast) ease,
              box-shadow var(--duration-fast) ease;
}

button:active, .button:active {
  transform: scale(0.98);
}
```

---

## 2. Anti-AI-Slop Design Principles (Taste Skill)

| ❌ AI-Slop Cliché | ✨ Bespoke High-Craft Standard |
|---|---|
| Harsh pitch-black (`#000000`) with glowing neon green blur orbs | Deep obsidian slate (`#090e13`) with subtle architectural gradient grid |
| Repetitive generic "Book Now" buttons on every card | Contextual, descriptive CTAs (*"Schedule Skilled Nursing"*, *"Explore Protocol"*) |
| Generic SaaS card grids with fake statistics | Bespoke clinical cards with real procedure tags, duration, and transparent pricing |
| Floating spinning shapes / unanchored decorative blobs | Multi-layered ambient drop shadows and 1px crisp translucent borders |

---

## 3. Impeccable Style Precision

```css
/* Architectural Grid Canvas */
.architectural-grid {
  position: absolute;
  inset: 0;
  height: 1200px;
  width: 100%;
  background-image: 
    linear-gradient(to right, rgba(255, 255, 255, 0.025) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%);
  -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%);
  pointer-events: none;
  z-index: 0;
}

/* Translucent Glass Card with Inner Bevel Highlight */
.service-card, .glass-card {
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  background: rgba(15, 25, 33, 0.75);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 16px 36px -12px rgba(0, 0, 0, 0.4);
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1),
              border-color 0.2s ease,
              box-shadow 0.2s ease;
}

.service-card:hover, .glass-card:hover {
  transform: translateY(-4px);
  border-color: rgba(52, 211, 153, 0.35);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 20px 48px -12px rgba(0, 0, 0, 0.6);
}
```
