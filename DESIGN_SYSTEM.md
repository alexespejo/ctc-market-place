# Design System

## Overview
This application follows an **intelligent minimalism** design aesthetic inspired by modern AI companies like Anthropic. The design emphasizes trust, calm, and humanist principles.

---

## Color Palette

### Primary Colors
- **Background**: `#faf8f5` - Warm, creamy off-white (like textured paper)
- **Paper/Cards**: `#ffffff` - Pure white for elevated surfaces
- **Foreground/Text**: `#1a1817` - Deep, readable dark brown-black
- **Muted Text**: `#706e6b` - Soft gray for secondary information

### Accent Colors
- **Primary Accent**: `#8b7355` - Warm, earthy brown
- **Accent Light**: `#c4b5a0` - Light tan for subtle highlights
- **Accent Hover**: `#6d5a43` - Darker brown for interactive states

### Semantic Colors
- **Active/Success**: Emerald green (`bg-emerald-500`)
- **Error**: Soft red (`bg-red-500`)
- **Info**: Warm amber tones (`bg-amber-50`)

---

## Typography

### Font Families
1. **Serif (Headlines)**: Playfair Display
   - Used for: h1, h2, h3, large display text
   - Weight: 600-900 (semibold to black)
   - Letter spacing: -0.02em (tight tracking)
   - Line height: 1.2

2. **Sans-serif (Body)**: Inter
   - Used for: body text, UI elements, buttons
   - Weight: 400-600
   - Line height: 1.6

### Type Scale
- **Hero**: 5xl-7xl (48-72px) - Playfair Display
- **Display**: 3xl-4xl (30-36px) - Playfair Display
- **Heading**: xl-2xl (20-24px) - Playfair Display
- **Body**: base (15px) - Inter
- **Small**: sm-xs (12-14px) - Inter

---

## Components

### Bento Cards
Soft, tactile card design with:
- Border radius: `20px` (rounded-xl)
- Border: `1px solid var(--border)`
- Background: `var(--paper)` (white)
- Shadow: Subtle layered shadows
  - Rest: `0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)`
  - Hover: `0 2px 4px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.08)`
- Hover effect: Slight lift (`translateY(-2px)`)

Usage:
```tsx
<div className="bento-card p-8">
  {/* Content */}
</div>
```

### Soft Buttons
Neutral, tactile button style:
- Background: `var(--paper)`
- Border: `1px solid var(--border)`
- Border radius: `12px`
- Padding: `10px 20px`
- Hover: Light fill + accent border

Usage:
```tsx
<button className="soft-button">
  Button Text
</button>
```

### Accent Buttons
Primary call-to-action:
- Background: `var(--accent)`
- Color: `white`
- Border radius: `12px`
- Shadow: Warm brown shadow
- Hover: Darker + enhanced shadow

Usage:
```tsx
<button className="accent-button">
  Primary Action
</button>
```

---

## Organic Shapes

Soft, morphing background decorations:
```tsx
<div className="organic-shape w-48 h-48 bg-[--accent-light]/10">
</div>
```

Properties:
- Irregular border radius that animates
- Low opacity (5-20%)
- Positioned absolutely
- Creates visual interest without distraction

---

## Animations

### Transitions
All elements have smooth transitions:
- Duration: `0.2s`
- Timing: `cubic-bezier(0.4, 0, 0.2, 1)` (ease-out)
- Properties: background, border, color, opacity, box-shadow, transform

### Pulse Effect
Soft pulsing for active indicators:
```tsx
<div className="pulse-soft">
  {/* Element */}
</div>
```

### Morph Animation
Organic shapes subtly transform over 8 seconds

---

## Layout Principles

### Spacing
- **Section gaps**: 12-20 units (48-80px)
- **Card padding**: 6-10 units (24-40px)
- **Element gaps**: 3-6 units (12-24px)
- **Tight spacing**: 2-3 units (8-12px)

### Responsive Design
- **Mobile-first approach**
- Breakpoints:
  - `sm`: 640px
  - `md`: 768px
  - `lg`: 1024px
- Font size adjusts on mobile (14px base)

### Container Widths
- **Default**: `max-w-7xl` (1280px)
- **Content**: `max-w-4xl` (896px)
- **Forms**: `max-w-2xl` (672px)
- **Narrow**: `max-w-lg` (512px)

---

## Best Practices

### Do's ✓
- Use serif fonts for headlines and large text
- Maintain generous whitespace
- Use organic shapes for visual interest
- Keep colors warm and muted
- Apply soft shadows and rounded corners
- Animate transitions smoothly

### Don'ts ✗
- Don't use harsh neons or bright colors
- Don't use sharp corners (< 12px radius)
- Don't overcrowd the layout
- Don't use heavy shadows or dark mode (yet)
- Don't use gradients excessively

---

## Accessibility

- **Contrast**: All text meets WCAG AA standards
- **Touch targets**: Minimum 44x44px for mobile
- **Focus states**: Clear ring indicators
- **Semantic HTML**: Proper heading hierarchy
- **Screen readers**: Meaningful alt text and labels

---

## Development

### CSS Variables
Access design tokens via CSS variables:
```css
var(--background)
var(--paper)
var(--foreground)
var(--muted)
var(--border)
var(--accent)
var(--accent-light)
var(--accent-hover)
```

### Utility Classes
Custom utilities in `globals.css`:
- `.bento-card` - Soft card component
- `.soft-button` - Neutral button
- `.accent-button` - Primary button
- `.organic-shape` - Animated shape
- `.pulse-soft` - Gentle pulse animation

---

## References

This design system is inspired by:
- Anthropic's Claude interface
- Apple's Human Interface Guidelines
- Modern editorial design
- Academic and humanist typography
