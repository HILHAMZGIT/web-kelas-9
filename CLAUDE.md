# Claude 4.5 Agent Instructions - Web Kelas 9B

## Project Overview
Website Kelas 9B SMPN 1 Karanglewas adalah portal kenangan modern untuk angkatan 2026. Built dengan Next.js 16.2.5, Tailwind CSS, Framer Motion, dan Supabase.

**Repository**: https://github.com/HILHAMZGIT/web-kelas-9.git
**Tech Stack**: Next.js 16.2.5, React 19, Framer Motion, Tailwind CSS, Supabase, Clerk Auth

---

## Landing Page Architecture (Updated May 2026)

### 1️⃣ Hero Section
**File**: `src/app/page.js` - `ProfessionalHeroSection()`
- Full-height section dengan background image overlay
- Professional badge dengan "SMPN 1 KARANGLEWAS · ANGKATAN 2026"
- Logo dengan Glassmorphism effect
- Quote: "Setiap tawa punya cerita, setiap sudut punya memori"
- CTA buttons: "Mulai Jelajah" (Sign In) dan "Lihat Kenangan" (to gallery)
- Scroll indicator dengan animated chevron
- **Animation**: Stagger animation dengan `fadeUp`, `scaleIn` variants

### 2️⃣ About Section (Tentang 9B)
**File**: `src/app/page.js` - `AboutSection()`
- Grid layout: Left (content) + Right (stats)
- Stats cards menggunakan Bento Grid dengan icons:
  - Total Siswa: 34
  - Perempuan: 18
  - Laki-laki: 16
  - Angkatan: 2026
- **Animation**: `whileInView` untuk reveal saat scroll

### 3️⃣ Struktur Pengurus Kelas (BARU - May 2026)
**File**: `src/app/page.js` - `OrganizationalSection()`
- **Hierarki Modern** dengan Glassmorphism cards
- **Level 1 (Ketua)**: Aghis Awalia Wayangsari
  - Gradient: `from-amber-400 to-orange-500`
  - Icon: Crown
  - Card styling: Premium glass dengan border radius 3xl
  
- **Level 2 (Wakil)**: Rama Indra Pratama
  - Gradient: `from-emerald-400 to-tosca-500`
  - Icon: UserCheck
  - Positioned below Ketua dengan connection line
  
- **Level 3 (Sekretaris & Bendahara)**: Side-by-side grid
  - Sekretaris 1: Nadira Rafelina | Sekretaris 2: Jazmi Hilmi Hamizan
    - Gradient: `from-blue-400 to-indigo-500`
    - Icon: PenTool
  - Bendahara 1: Nesa Novisa | Bendahara 2: Aida Novitasari
    - Gradient: `from-purple-400 to-pink-500`
    - Icon: Wallet

- **Design Features**:
  - Connection lines (gradient dividers) antara level
  - Hover animations: scale-105 transition
  - Responsive: Full width mobile, horizontal layout desktop
  - Background elements: Soft emerald & tosca glows

### 4️⃣ Jadwal Piket Harian (Bento Grid - UPDATED May 2026)
**File**: `src/app/page.js` - `PiketSection()`
- **Responsive Grid**: 1 kolom mobile, 2-3 kolom desktop
- **5 Day Cards** dengan color-coding:
  
  | Hari | Color | Members |
  |------|-------|---------|
  | Senin | Emerald | 8 anggota |
  | Selasa | Blue | 6 anggota |
  | Rabu | Violet | 6 anggota |
  | Kamis | Amber | 7 anggota |
  | Jumat | Rose | 7 anggota |

- **Card Layout**:
  - Header: Day name + User icon
  - Body: Wrapped member tags dengan styling responsive
  - Border-left accent untuk color distinction
  - Semi-transparent background
  
- **Bonus Card**: "Kelas Bersih, Belajar Nyaman" dengan quote
- **Animation**: Staggered fadeUp per card

---

## Design System & Styling

### Colors & Gradients
```css
--emerald-500: #10b981
--tosca-500: #14b8a6
--amber-400: #fbbf24
--text-primary: #1a1a1a
--text-muted: #718096
```

### Glass Effects
- `.glass`: Basic glassmorphism (blur 24px)
- `.glass-premium`: Enhanced effect (blur 28px, stronger border)
- `.glass-strong`: Maximum effect (blur 32px)

### Tailwind Utilities
- `gradient-text`: Animated text gradient
- `gradient-text-warm`: Warm gradient (emerald to tosca)
- `.btn-primary`: Gradient button dengan shadow
- `.btn-ghost`: Transparent button
- `.bento-card`: Glass card dengan border & shadow

---

## Mobile Optimizations (May 2026)

**Implemented Features**:
- ✅ Viewport meta tag: `device-width, initial-scale=1`
- ✅ Touch-friendly: Minimum 44px for interactive elements
- ✅ Smooth scrolling with `-webkit-overflow-scrolling: touch`
- ✅ Safe area support for notch devices (`env(safe-area-inset-top)`)
- ✅ Text rendering optimization: `antialiased`, `optimizeLegibility`
- ✅ Tap highlight color: Subtle emerald tint
- ✅ No horizontal overflow: `overflow-x: hidden`
- ✅ Responsive typography: Scales from mobile to desktop

**Breakpoints**:
- `sm`: 640px (tablets)
- `md`: 768px (small desktops)
- `lg`: 1024px (desktops)
- `xl`: 1280px (large screens)

---

## Animation Framework (Framer Motion)

### Variants Defined
```javascript
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.12, duration: 0.8, ease: [0.23, 1, 0.32, 1] }
  })
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1.0, ease: [0.23, 1, 0.32, 1] } }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } }
};

const slideUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.23, 1, 0.32, 1] } }
};
```

### Usage Pattern
```jsx
<motion.div 
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  variants={fadeUp}
  custom={index}
>
  {/* Content */}
</motion.div>
```

---

## Key Files & Modifications

### Core Files Modified
1. **src/app/page.js**
   - Added `OrganizationalSection()` with hierarchical org chart
   - Updated `PiketSection()` to Bento Grid layout
   - Enhanced all animations with Framer Motion
   - Import added: `Crown` icon from lucide-react

2. **src/app/layout.js**
   - Added viewport meta tag configuration
   - Added Open Graph metadata
   - Added SEO robots directives

3. **src/app/globals.css**
   - Added mobile optimization media queries
   - Enhanced glass effects
   - Added safe area utilities

### Git Commits
- `26e8cfb`: feat: Redesign landing page to modern long-scrolling layout
- `ba0f579`: feat: Add mobile optimizations and SEO enhancements

---

## Development Guidelines

### When Adding New Sections
1. Use `motion.div` with `whileInView` for animations
2. Apply `fadeUp` variant with staggered children
3. Use `container-premium` for content wrapping
4. Ensure `md:` breakpoint for desktop adjustments
5. Test on mobile (375px) and desktop (1920px)

### Component Structure
```jsx
function NewSection() {
  return (
    <section className="relative py-24 px-6 bg-[color]">
      <div className="container-premium max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial="hidden" whileInView="visible" variants={fadeIn}>
          {/* Title & Description */}
        </motion.div>
        
        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <motion.div 
              key={i}
              initial="hidden" 
              whileInView="visible" 
              variants={fadeUp}
              custom={i}
            >
              {/* Card */}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

### Testing & QA
- Run `pnpm build` to check for TypeScript/build errors
- Test responsive design: DevTools > Mobile view (375px, 768px, 1920px)
- Verify animations: Disable animations in DevTools > Accessibility
- Check Lighthouse: CWV (Core Web Vitals) target >90

---

## Common Patterns & Best Practices

✅ **DO**:
- Use `.whileInView` for section animations (performance friendly)
- Apply `container-premium` for consistent max-width
- Use Tailwind utilities instead of custom CSS when possible
- Test mobile-first, then enhance for desktop
- Lazy load images with proper `sizes` props

❌ **DON'T**:
- Avoid inline styles; use Tailwind classes
- Don't skip `viewport={{ once: true }}` (prevents re-animation)
- Don't hardcode colors; use CSS variables from globals.css
- Don't use list/table for hierarchical data; use cards with proper layout
- Don't forget responsive prefixes: `sm:`, `md:`, `lg:`

---

## Deployment

**GitHub Integration**:
- Repository: `https://github.com/HILHAMZGIT/web-kelas-9.git`
- Vercel auto-deploys on push to `main` branch
- Build command: `next build`
- Start command: `next start`

**Environment Variables** (set in Vercel Dashboard):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

---

## References
- **Next.js 16 Docs**: `node_modules/next/dist/docs/`
- **Tailwind CSS**: https://tailwindcss.com
- **Framer Motion**: https://www.framer.com/motion/
- **Lucide Icons**: https://lucide.dev
