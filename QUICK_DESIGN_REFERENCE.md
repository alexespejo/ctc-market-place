# Quick Design Reference

## 🎨 Color Palette (Copy & Paste)

```css
/* Backgrounds */
--background: #faf8f5;  /* Creamy paper */
--paper: #ffffff;       /* White cards */

/* Text */
--foreground: #1a1817;  /* Primary text */
--muted: #706e6b;       /* Secondary text */

/* Accents */
--accent: #8b7355;      /* Primary brown */
--accent-light: #c4b5a0;/* Light tan */
--accent-hover: #6d5a43;/* Dark brown */

/* Borders */
--border: #e8e6e3;      /* Soft gray */
```

---

## ✍️ Typography Classes

```tsx
/* Headlines - Use Playfair Display */
<h1 className="font-serif text-5xl font-bold tracking-tight">
  Headline
</h1>

/* Subheadings */
<h2 className="font-serif text-3xl font-semibold tracking-tight">
  Subheading
</h2>

/* Body Text - Default Inter */
<p className="text-base text-[--muted]">
  Body text
</p>

/* Small Text */
<span className="text-sm text-[--muted]">
  Helper text
</span>
```

---

## 🧩 Component Patterns

### Bento Card
```tsx
<div className="bento-card p-8">
  <h3 className="font-serif text-2xl font-semibold mb-4">
    Card Title
  </h3>
  <p className="text-[--muted]">
    Card content
  </p>
</div>
```

### Soft Button
```tsx
<button className="soft-button">
  Click Me
</button>
```

### Accent Button
```tsx
<button className="accent-button">
  Primary Action
</button>
```

### Pill Filter Button
```tsx
<button className={`px-6 py-2.5 rounded-full font-medium transition-all ${
  active 
    ? 'bg-[--accent] text-white shadow-md' 
    : 'soft-button'
}`}>
  Filter
</button>
```

---

## 🎭 Decorative Elements

### Organic Shape (Background)
```tsx
<div className="absolute top-0 right-0 w-48 h-48 bg-[--accent-light]/10 organic-shape -translate-y-12 translate-x-12" />
```

### Active Pulse Indicator
```tsx
<div className="relative">
  <div className="w-4 h-4 rounded-full bg-emerald-500" />
  <div className="absolute inset-0 w-4 h-4 rounded-full bg-emerald-500 pulse-soft" />
</div>
```

---

## 📐 Spacing Scale

```tsx
/* Tight */
gap-2  /* 8px */
gap-3  /* 12px */

/* Normal */
gap-4  /* 16px */
gap-6  /* 24px */

/* Loose */
gap-8  /* 32px */
gap-12 /* 48px */

/* Section spacing */
py-20  /* 80px top/bottom */
mb-16  /* 64px bottom margin */
```

---

## 🖼️ Common Layouts

### Page Container
```tsx
<div className="min-h-screen bg-[--background]">
  <Navbar />
  <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
    {/* Content */}
  </main>
</div>
```

### Centered Hero
```tsx
<div className="text-center mb-16 max-w-4xl mx-auto">
  <h1 className="font-serif text-6xl font-bold mb-6 tracking-tight">
    Hero Title
  </h1>
  <p className="text-xl text-[--muted] leading-relaxed">
    Supporting text
  </p>
</div>
```

### Two-Column Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {items.map(item => (
    <div key={item.id} className="bento-card p-6">
      {/* Item */}
    </div>
  ))}
</div>
```

---

## 🎯 Form Elements

### Text Input
```tsx
<input
  type="text"
  className="w-full px-4 py-3.5 bg-[--paper] border border-[--border] rounded-xl focus:ring-2 focus:ring-[--accent] focus:border-transparent outline-none transition text-[--foreground]"
  placeholder="Enter text..."
/>
```

### Toggle Button
```tsx
<button
  type="button"
  className={`p-5 rounded-xl font-semibold transition-all border-2 ${
    selected
      ? 'bg-[--accent] text-white border-[--accent] shadow-md'
      : 'bg-[--paper] text-[--foreground] border-[--border] hover:border-[--accent-light]'
  }`}
>
  Option
</button>
```

### Switch Toggle
```tsx
<button
  type="button"
  onClick={handleToggle}
  className={`relative inline-flex h-11 w-20 items-center rounded-full transition-all ${
    isActive 
      ? 'bg-emerald-500' 
      : 'bg-gray-300'
  }`}
>
  <span className={`inline-block h-9 w-9 transform rounded-full bg-white shadow-lg transition-transform ${
    isActive ? 'translate-x-10' : 'translate-x-1'
  }`} />
</button>
```

---

## 🎨 Border Radius Scale

```tsx
rounded-lg   /* 8px - Small elements */
rounded-xl   /* 12px - Buttons */
rounded-2xl  /* 16px - Cards, images */
rounded-full /* Infinity - Pills, avatars */
```

---

## 🌊 Shadow Presets

```css
/* Soft (Bento cards - already applied) */
box-shadow: 
  0 1px 2px rgba(0,0,0,0.04),
  0 4px 12px rgba(0,0,0,0.03);

/* Medium (Accent buttons) */
box-shadow: 0 2px 4px rgba(139, 115, 85, 0.2);

/* Elevated (Hover states) */
box-shadow: 
  0 2px 4px rgba(0,0,0,0.06),
  0 8px 24px rgba(0,0,0,0.08);
```

---

## 📱 Responsive Breakpoints

```tsx
/* Mobile First */
className="text-base"           /* Default */
className="sm:text-lg"          /* ≥640px */
className="md:text-xl"          /* ≥768px */
className="lg:text-2xl"         /* ≥1024px */

/* Common Patterns */
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
className="px-4 sm:px-6 lg:px-8"
className="py-20 sm:py-24"
```

---

## ⚡ Animation Classes

```tsx
/* Smooth transitions (default) */
transition-all

/* Custom durations */
transition-all duration-200  /* Fast */
transition-all duration-300  /* Medium */

/* Scale on press */
active:scale-95

/* Hover lift */
hover:-translate-y-1 hover:shadow-lg

/* Pulse effect */
className="pulse-soft"
```

---

## 🎯 Common Combinations

### Profile Photo
```tsx
{photoURL ? (
  <img
    src={photoURL}
    alt={name}
    className="w-20 h-20 rounded-2xl object-cover border-2 border-[--border]"
  />
) : (
  <div className="w-20 h-20 rounded-2xl bg-[--accent] flex items-center justify-center border-2 border-[--border]">
    <span className="text-3xl font-serif font-bold text-white">
      {name.charAt(0).toUpperCase()}
    </span>
  </div>
)}
```

### Loading Spinner
```tsx
<div className="flex items-center justify-center py-20">
  <div className="inline-block animate-spin rounded-full h-12 w-12 border-2 border-[--accent] border-t-transparent" />
</div>
```

### Empty State
```tsx
<div className="bento-card text-center py-16 max-w-lg mx-auto">
  <div className="text-6xl mb-4 opacity-30">🍽️</div>
  <h3 className="font-serif text-2xl font-semibold mb-2">
    No items found
  </h3>
  <p className="text-[--muted]">
    Check back soon!
  </p>
</div>
```

---

## 🚀 Quick Start

1. **Use bento-card for containers**
2. **Use font-serif for headlines**
3. **Use soft-button for secondary actions**
4. **Use accent-button for primary actions**
5. **Add organic-shape for decoration**
6. **Use warm colors (--accent)**
7. **Round corners generously (12-20px)**
8. **Add smooth transitions**

---

**Pro Tip**: Keep the design calm, spacious, and warm. When in doubt, add more whitespace!
