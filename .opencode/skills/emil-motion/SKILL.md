---
name: emil-motion
description: Design engineering and micro-interaction principles by Emil Kowalski (Vercel, Linear). Restraint-first motion, spring physics, tactile feedback, and polished UI transitions.
---

# Emil Kowalski — Motion & Interaction Engineering

## 1. Core Motion Philosophy: Restraint-First
- **Motion must have intent**: Never add animation for decoration alone. Motion exists to guide focus, communicate state transitions, and provide physical confirmation of user input.
- **Fast and crisp**: Micro-interactions should be 150ms–250ms. Never make the user wait for a transition to finish before they can interact.
- **Natural easing curves**: Use high-quality cubic-bezier curves rather than browser `ease` or `linear`:
  - Snappy Ease Out: `cubic-bezier(0.16, 1, 0.3, 1)` (for entrances and reveals)
  - Smooth Ease In-Out: `cubic-bezier(0.65, 0, 0.35, 1)` (for layout shifts and resizing)
  - Subtle Spring: `cubic-bezier(0.34, 1.56, 0.64, 1)` (for light tactile rebounds)

## 2. Tactile Feedback & Micro-Interactions
- **Active Press State**: Interactive buttons, cards, and pills should give immediate tactile response:
  ```css
  .btn:active {
    transform: scale(0.98);
    transition: transform 0.08s ease;
  }
  ```
- **Hover Transitions**: Subtle elevation and lighting change:
  ```css
  .card {
    transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease, border-color 0.2s ease;
  }
  .card:hover {
    transform: translateY(-2px);
    border-color: rgba(52, 211, 153, 0.35);
  }
  ```

## 3. Focus & Accessibility
- **Respect Reduced Motion**: Always wrap continuous or transform animations with `@media (prefers-reduced-motion: reduce)`.
- **Keyboard Rings**: Use high-contrast, offset focus outlines (`outline: 2px solid #34d399; outline-offset: 2px;`) for keyboard navigation.
