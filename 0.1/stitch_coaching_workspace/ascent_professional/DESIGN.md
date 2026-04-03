# Design System: The Executive Precision Framework

## 1. Overview & Creative North Star: "The Digital Concierge"
The design system for this coaching platform is built upon the **"Digital Concierge"** philosophy. In a high-end coaching environment, the UI should never shout; it should anticipate. We are moving away from the "Dashboard-as-a-Grid" trope and toward a **Symphonic Layout**—where intentional asymmetry, overlapping layers, and high-contrast typography scales create a sense of bespoke craftsmanship.

The goal is to provide a sense of "Quiet Authority." We achieve this by rejecting the standard boxed-in web look in favor of an editorial experience that feels as fluid and professional as a private coaching session.

---

## 2. Colors & Tonal Architecture
The palette is rooted in deep, authoritative blues and grays, punctuated by a "Vibrant Pulse" for primary actions.

### Tonal Strategy
- **Primary (`#0055c9`):** Our "Command Blue." Used for high-level brand moments and primary status.
- **Secondary (`#4f5e7e`):** The "Subtle Foundation." Used for secondary actions and supporting information.
- **Tertiary (`#00685f`):** The "Momentum Teal." Reserved for growth-oriented actions, progress indicators, and success states.

### The "No-Line" Rule
**Explicit Instruction:** Traditional 1px solid borders are strictly prohibited for sectioning. Structural definition must be achieved through:
1.  **Background Shifts:** Transitioning from `surface` (`#f9f9fc`) to `surface-container-low` (`#f3f3f6`).
2.  **Negative Space:** Using the spacing scale (e.g., `8` or `10`) to create "islands" of content.

### Surface Hierarchy & Nesting
Think of the UI as physical sheets of matte-finish acrylic.
*   **Base:** `surface` (`#f9f9fc`)
*   **Sectioning:** `surface-container-low` (`#f3f3f6`)
*   **Interactive Cards:** `surface-container-lowest` (`#ffffff`) placed atop `surface-container` tiers to create a soft, natural "pop."

### The "Glass & Gradient" Rule
To elevate the "Modern" requirement, floating elements (like sidebars or hovering action menus) should utilize **Glassmorphism**. 
*   **Formula:** `surface-container-lowest` at 80% opacity + `backdrop-blur: 20px`.
*   **Signature Textures:** For Hero CTAs, use a subtle linear gradient from `primary` (`#0055c9`) to `primary-container` (`#206df1`) at 135 degrees. This adds "soul" and depth that flat hex codes lack.

---

## 3. Typography: Editorial Authority
We utilize a dual-font strategy to balance character with utility.

*   **Display & Headlines (Public Sans):** This is our "Editorial Voice." Large scales like `display-lg` (3.5rem) should be used with tight tracking (-0.02em) to feel impactful and modern.
*   **Body & Labels (Inter):** This is our "Utility Voice." Inter’s high x-height ensures readability in complex coaching data and long-form feedback.

**Hierarchy as Identity:** Use high contrast in scale. A `headline-lg` title should be immediately followed by a `body-md` description to create a sophisticated, unbalanced aesthetic that feels intentional, not accidental.

---

## 4. Elevation & Depth: The Layering Principle
We reject the 2010s "Drop Shadow." Instead, we use **Tonal Layering**.

*   **Natural Lift:** Depth is achieved by "stacking." A `surface-container-lowest` card on a `surface-container-high` background creates an organic elevation.
*   **Ambient Shadows:** If a floating element (like a modal) requires a shadow, use: 
    *   `box-shadow: 0 20px 40px rgba(26, 28, 30, 0.06);` (Color is a tinted version of `on-surface`).
*   **The "Ghost Border" Fallback:** If accessibility requires a container edge, use the `outline-variant` (`#c1c6d7`) at **15% opacity**. Never use 100% opaque lines.

---

## 5. Components

### The Sleek Sidebar
*   **Styling:** Width `16` (5.5rem) collapsed, `24` (8.5rem) expanded. 
*   **Visuals:** No right-side border. Use a slight background shift to `surface-container-low`. Active states use a `primary-fixed-dim` (`#b1c5ff`) pill-shaped background with a "full" corner radius.

### Buttons (The "Precision" Variants)
*   **Primary:** Gradient fill (Primary to Primary-Container), `lg` (1rem) roundedness, and `3` (1rem) horizontal padding.
*   **Secondary:** Ghost-style. No background. `primary` text with an `outline-variant` ghost border (15% opacity).
*   **Tertiary:** No border, no background. `on-surface-variant` text.

### Cards & Lists
*   **Constraint:** Forbid divider lines between list items. 
*   **Solution:** Use `2` (0.7rem) of vertical white space and a subtle hover state shift to `surface-container-highest`.
*   **Corners:** Always use the `xl` (1.5rem) radius for container-level cards to soften the professional tone.

### Inputs & Fields
*   **Style:** Minimalist. No bottom line. A solid `surface-container-lowest` fill with an `lg` roundedness. 
*   **Focus:** Transition the "Ghost Border" from 15% opacity to 100% `primary` color.

---

## 6. Do's and Don'ts

### Do:
*   **Use Asymmetric Padding:** Allow more space at the top of a container than the bottom to create a "weighted" editorial feel.
*   **Embrace "Empty" Space:** If a screen feels "too white," do not add a border. Add more margin (`12` or `16`).
*   **Mix Weights:** Use `Public Sans Bold` for headlines and `Inter Regular` for body text to create clear visual anchors.

### Don't:
*   **Don't Use Pure Black:** Always use `on-background` (`#1a1c1e`) for text to maintain a premium, softened look.
*   **Don't Use Standard Grids:** Occasionally break the grid. Let an image or a pull-quote bleed into the margin to create a custom, high-end feel.
*   **Don't Over-Animate:** Transitions should be `200ms` with a `cubic-bezier(0.4, 0, 0.2, 1)`. Avoid "bouncy" or "playful" easing; keep it professional and snappy.