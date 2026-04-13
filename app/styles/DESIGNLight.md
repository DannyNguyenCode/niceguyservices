# Design System Specification: High-Light Technicality

## 1. Overview & Creative North Star: "The Ethereal Laboratory"
This design system is a departure from the "dark-tech" trope, reimagining futuristic interfaces through a lens of high-key editorial sophistication. Our Creative North Star is **The Ethereal Laboratory**—an environment that is clinical, hyper-clean, yet buzzing with the latent energy of neon light.

To break the "template" look, we move away from rigid, boxed-in grids. We embrace **Intentional Asymmetry**: large-scale display type may bleed off-center, and containers should feel like floating sheets of data rather than static blocks. We use depth to imply importance, treating the screen not as a flat surface, but as a multi-layered viewport where information exists at different altitudes of focus.

---

## 2. Colors & Surface Philosophy

The color palette utilizes a base of clinical greys (`#f5f6f7`) to provide a canvas for high-chroma accents. The "Neon" energy is preserved through `primary` (Electric Purple) and `secondary` (Cyan), used sparingly for maximum impact.

### The "No-Line" Rule
**Borders are a failure of hierarchy.** Designers are prohibited from using 1px solid strokes to define sections. Boundaries must be defined solely through:
1.  **Background Color Shifts:** Transitioning from `surface` to `surface-container-low`.
2.  **Tonal Transitions:** Using `surface-container-highest` to create a soft "pocket" for data within a `surface` layout.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack. The hierarchy of importance follows the `surface-container` tiers:
*   **Base Layer:** `surface` (#f5f6f7) — The global canvas.
*   **Secondary Sections:** `surface-container-low` (#eff1f2) — For sidebars or background grouping.
*   **Interaction Cards:** `surface-container-lowest` (#ffffff) — Reserved for the highest-priority "active" content, creating a crisp pop.
*   **Overlays/Modals:** `surface-container-high` (#e0e3e4) — To sit atop the stack.

### The "Glass & Gradient" Rule
To elevate beyond "Standard Light Mode," use **Glassmorphism** for all floating UI elements (menus, tooltips, sticky headers). 
*   **Token:** Use `surface-container-lowest` at 60% opacity with a `20px` backdrop-blur. 
*   **Gradients:** Apply a subtle linear gradient (Top-Left to Bottom-Right) from `primary` (#8c00d8) to `primary-container` (#cb80ff) on hero CTAs to inject "soul" into the clinical aesthetic.

---

## 3. Typography: Technical Elegance

This system pairs the mechanical precision of **Space Grotesk** with the humanistic clarity of **Inter**.

*   **Display & Headlines (Space Grotesk):** These are your "Brand Moments." Use `display-lg` (3.5rem) with tight letter-spacing (-0.02em) to create a high-impact, technical feel. Use these for data visualizations or editorial section starts.
*   **Body & Titles (Inter):** Reserved for information consumption. Inter provides the necessary legibility to balance the "vibrancy" of the neon accents.
*   **Label (Space Grotesk):** Use `label-md` in all-caps with increased letter-spacing (0.05em) for metadata and technical callouts. This reinforces the "futuristic laboratory" feel.

---

## 4. Elevation & Depth

### The Layering Principle
Forget shadows as the primary driver of depth. Use **Tonal Layering**. Place a `surface-container-lowest` (pure white) card on a `surface-container-low` (pale grey) background. This creates "Natural Lift"—a sophisticated, low-contrast separation that feels premium.

### Ambient Shadows
When an element must "float" (e.g., a modal or floating action button):
*   **Color:** Use a tinted shadow based on `on-surface` (#2c2f30).
*   **Values:** `0px 12px 32px rgba(44, 47, 48, 0.06)`. The low opacity (6%) is critical to avoid a "dirty" look.

### The "Ghost Border" Fallback
If a boundary is required for accessibility, use a **Ghost Border**:
*   **Token:** `outline-variant` (#abadae) at **15% opacity**.
*   **Usage:** Only for input fields or high-density data tables.

---

## 5. Components

### Buttons
*   **Primary:** Gradient from `primary` to `primary-container`. `radius-md`. Label in `on-primary`.
*   **Secondary:** Ghost-style. No background. `Ghost Border` (15% opacity) and `secondary` text.
*   **Tertiary:** No border. `label-md` styling. Interaction state indicated by a subtle shift to `surface-container-highest`.

### Input Fields
*   **Resting State:** `surface-container-lowest` background with a bottom-only `Ghost Border`.
*   **Focused State:** Full border using `primary` at 40% opacity and a `0px 0px 8px` glow using `primary` at 10% opacity.

### Cards & Lists
*   **Strict Rule:** No dividers. Separate list items using 16px of vertical whitespace or by alternating background colors between `surface` and `surface-container-low`.
*   **The "Data-Pill":** Use selection chips with `secondary-container` backgrounds and `on-secondary-container` text for high-energy technical metadata.

### Tooltips
*   **Visuals:** Glassmorphic (70% opacity `surface-container-lowest`) with a heavy backdrop blur. Use `label-sm` for the text to maintain a technical "HUD" feel.

---

## 6. Do's and Don'ts

### Do
*   **Do** use extreme white space. Elements should feel like they have room to "breathe" in a sterile environment.
*   **Do** use `primary` and `secondary` as highlights (dots, thin progress bars, icons), not as large-scale background fills.
*   **Do** overlap elements slightly (e.g., a card overlapping a headline) to create an editorial, non-linear layout.

### Don't
*   **Don't** use black (#000000) for text. Always use `on-surface` (#2c2f30) to maintain tonal softness.
*   **Don't** use standard "Drop Shadows" from design software defaults. They kill the ethereal, light-filled aesthetic.
*   **Don't** use 100% opaque borders. They create "visual noise" that contradicts the clean, futuristic goal.