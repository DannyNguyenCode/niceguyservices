```markdown
# Design System Specification: High-Energy Modernism

## 1. Overview & Creative North Star: "The Neon Pulse"
The Creative North Star for this design system is **"The Neon Pulse."** We are moving away from the static, rigid structures of traditional SaaS dashboards toward a living, breathing digital organism. This system is designed to feel fast, innovative, and unapologetically premium.

To break the "template" look, we utilize **Kinetic Asymmetry.** Do not align every element to a perfect vertical axis. Overlap high-energy gradient cards with display typography to create a sense of depth and motion. We treat the interface not as a flat screen, but as a deep, multi-layered environment where "Electric Purple" and "Cyan" act as light sources within a dark, cinematic space.

---

## 2. Colors & Atmospheric Depth
This system thrives on the contrast between a deep, obsidian base (`surface`) and hyper-saturated accent tokens.

### The Color Logic
- **Primary (`#df8eff`):** Use this for high-impact brand moments. 
- **Secondary (`#00eefc`):** Our "functional" accent. Use Cyan for data visualization, success states, or to draw the eye to secondary actions.
- **Tertiary (`#ac89ff`):** Reserved for deep-layered elements and supporting gradients.

### The "No-Line" Rule
**Explicit Instruction:** Prohibit 1px solid borders for sectioning. Structural boundaries must be defined solely through background color shifts. 
- A `surface-container-low` section sitting on a `surface` background is the standard for separation.
- Use the **Ghost Border** fallback only when necessary for accessibility: `outline-variant` at 15% opacity. Never use 100% opaque borders.

### Surface Hierarchy & Nesting
Treat the UI as stacked sheets of frosted glass. 
- **Level 0 (Foundation):** `surface` (`#0e0e13`)
- **Level 1 (Sectioning):** `surface-container-low`
- **Level 2 (Active Cards):** `surface-container` or `surface-container-high`
- **Level 3 (Floating/Pop-overs):** `surface-bright` with Backdrop Blur.

### The "Glass & Gradient" Rule
To achieve "The Neon Pulse," use a 20% linear gradient on primary CTAs transitioning from `primary` to `primary-container`. For floating cards, apply a `backdrop-filter: blur(20px)` combined with a semi-transparent `surface-container-highest` to allow the background glows to bleed through.

---

## 3. Typography: The Geometric Voice
We use a high-contrast pairing of **Space Grotesk** and **Manrope** to balance innovative character with extreme readability.

- **Display & Headlines (Space Grotesk):** This is our "High-Energy" voice. The geometric quirks of Space Grotesk should be used at `display-lg` to `headline-sm` scales. Use tight letter-spacing (-0.02em) for large displays to create a tight, editorial feel.
- **Body & Titles (Manrope):** Manrope provides a clean, neutral balance. It ensures that while the layout is experimental, the information remains legible.
- **Labeling:** Use `label-md` in all-caps with +0.05em letter-spacing for a technical, precise aesthetic.

---

## 4. Elevation & Depth: Tonal Layering
Traditional shadows are too heavy for this system. We use **Ambient Luminance.**

- **The Layering Principle:** Depth is achieved by "stacking." A `surface-container-lowest` card placed on a `surface-container-low` section creates a natural "recessed" effect. Conversely, placing `surface-container-highest` on `surface` creates "lift."
- **Ambient Shadows:** When an element must float (e.g., a Modal), use an extra-diffused shadow: `box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4)`. The shadow should feel like a soft glow-absorption rather than a harsh edge.
- **Glassmorphism:** Use semi-transparent fills on containers (e.g., `primary` at 8% opacity over a blurred background) to signify "active" or "hover" states, making the layout feel integrated.

---

## 5. Components

### Cards & Layout
- **Radii:** All cards must use the `xl` (1.5rem / 24px) or `lg` (1rem / 16px) tokens.
- **Separation:** Forbid divider lines. Use `surface-container-high` to isolate content blocks. Use generous padding (Spacers 32px+) to allow the design to breathe.

### Buttons
- **Primary:** High-energy gradient (`primary` to `primary-container`). `full` roundness. No border.
- **Secondary:** `surface-container-highest` fill with `primary` text. This creates a "glass" button effect without the visual noise.
- **Tertiary/Ghost:** No fill. `primary` text. Interaction state: 8% `primary` background on hover.

### Input Fields
- **Default State:** `surface-container-highest` fill, no border. `md` (12px) roundness.
- **Focus State:** 1px "Ghost Border" using `secondary` at 50% opacity and a subtle `secondary` outer glow (4px blur).
- **Error State:** `error` text with an `error_container` subtle background shift.

### Chips & Tags
- Use `full` roundness. For selection, use the `secondary` token with `on_secondary` text to provide a "punch" of color against the dark background.

---

## 6. Do’s and Don’ts

### Do:
- **Do** overlap elements. Let a `display-lg` headline partially hang over the edge of a card to create a bespoke, editorial look.
- **Do** use "Vibrant Glows." Place large, blurred circles of `primary_dim` or `secondary_dim` at 5% opacity in the background of the page to create atmospheric depth.
- **Do** use asymmetrical grids. (e.g., a 7-column / 5-column split instead of a standard 6/6).

### Don’t:
- **Don’t** use 1px solid borders to define "sections." It kills the futuristic aesthetic.
- **Don’t** use pure black (#000000) for large surfaces. Stick to the `surface` token (`#0e0e13`) to maintain tonal richness.
- **Don’t** use standard "Drop Shadows." If it doesn't look like ambient light or glass, rethink the elevation.
- **Don’t** clutter the screen. High-energy design requires significant negative space to avoid becoming "noisy."