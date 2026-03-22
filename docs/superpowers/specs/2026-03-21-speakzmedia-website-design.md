# Speakz Media — Website Design Spec
**Version:** 1.0
**Datum:** 2026-03-21
**Projektname:** Speakz Media New Website
**Status:** Approved by client

---

## 1. Projektziel

Eine award-winning One-Page-Website + Case Study Sub-Pages für Speakz Media (Berlin), die:
- Maximale Conversion erzielt (Leads / Projektanfragen)
- Die kreative und technische Kompetenz der Agentur sofort sichtbar macht
- Als eigenständiges Portfolio-Stück funktioniert ("Die Site IST das Produkt")
- Template-First gebaut wird — alle Assets/Texte werden später eingesetzt

**Business:** Speakz Media GmbH, Kantstraße 127, 10625 Berlin
**Gründer:** Vincent Borko & Jeffrey Wipprecht
**Kontakt:** hello@speakzmedia.de | +49 30 3553 10 66
**Services:** Webdesign, App-Entwicklung, Podcast, Audio, Video
**Pricing:** €500 einmalig / €50 pro Monat

---

## 2. Technischer Stack

| Tool | Zweck |
|------|-------|
| HTML5 / CSS3 / Vanilla JS | Basis — kein Framework, maximale Kontrolle |
| Three.js | 3D Hero — Icosaeder + Partikel-Explosion |
| GSAP + ScrollTrigger | Alle Scroll-Animationen, Horizontal Scroll, Pinning |
| Lenis | Smooth Scroll (`lerp: 0.08`) |
| SplitType | Text-Reveal Animationen (Wort/Buchstabe) |
| Canvas API | Grain/Noise Hintergrund-Textur |

**Fonts (Google Fonts):**
- `Syne` (700, 800) — Headlines
- `Inter` (400, 500) — Body
- `Syne Mono` (400) — Labels, Zahlen, Tags

---

## 3. Design-System

### Farbpalette
```
--color-bg:       #0A0A0A   /* Tief-Schwarz — dominant */
--color-footer:   #050505   /* Footer — noch dunkler */
--color-card:     #1A1A1A   /* Card-Hintergrund */
--color-cyan:     #00F5D4   /* Electric Cyan — primärer Akzent */
--color-violet:   #7B2FBE   /* Violett — sekundärer Akzent */
--color-creme:    #F5F0E8   /* Warm Creme — Kontrast-Sektionen */
--color-dim:      #888888   /* Grau — Nebentext */
--color-white:    #FFFFFF
```

### Typografie-Skala
```
--text-hero:    clamp(60px, 10vw, 140px)   /* Hero Headline */
--text-h1:      clamp(40px, 6vw, 90px)     /* Section Headlines */
--text-h2:      clamp(28px, 4vw, 56px)     /* Sub-Headlines */
--text-body:    clamp(15px, 1.2vw, 18px)   /* Fließtext */
--text-label:   12px                        /* Tags, Labels, Syne Mono */
```

### Globale Animations-Regeln
- Easing: `power3.out` / `expo.out` — nie linear
- Standard Reveal: `opacity: 0 → 1`, `y: 40 → 0`, duration `0.8s`
- Stagger bei Listen: `0.08s` zwischen Elementen
- Custom Cursor: weißer Kern (8px Kreis) + transparenter Ring (40px, `border: 1px solid rgba(255,255,255,0.4)`, folgt mit `lerp 0.12`). Auf Portfolio-Cards: Ring wächst auf 80px, Kern wird unsichtbar, Text `"VIEW"` (Syne Mono 10px) erscheint in Ring-Mitte — Transition: `width/height 0.3s expo.out`

---

## 4. Seiten-Architektur

### 4.1 Hauptseite (index.html)

```
LOADER
HEADER (sticky)
HERO
MANIFESTO
SERVICES
PORTFOLIO
PROCESS
TESTIMONIALS
PRICING
TEAM
CTA
FOOTER
```

### 4.2 Sub-Pages
```
/case/besser-sprechen/index.html
/case/flyly/index.html
/case/vorly/index.html
/case/applytix/index.html
```

---

## 5. Sections — Detailspezifikation

### LOADER
- Schwarzer Fullscreen-Overlay
- `S` fliegt von links, `M` von rechts rein — treffen sich in der Mitte — 0.6s
- Kurzes Pulse / Glow auf `SM` — 0.2s
- Gesamter Loader faded aus — 0.4s
- Total: ~1.2s, danach GSAP `overflow: hidden` wird entfernt

### HEADER
- Position: `fixed`, top: 0, full-width
- Hintergrund: `rgba(10,10,10,0.85)` + `backdrop-filter: blur(12px)`
- Weicher Bottom-Shadow taucht auf nach erstem Scroll (>50px)
- Links: Logo `SPEAKZ MEDIA` in Syne 700
- Mitte (Desktop): Nav-Links `Arbeit | Services | Über uns | Kontakt`
- Rechts: CTA-Button `"Gespräch starten"` — Cyan, pill-form, immer sichtbar — Klick öffnet Contact-Modal
- Mobile: Hamburger → Full-Screen Overlay Nav

### HERO
**Phase 1 — Loader fertig:**
- Three.js Canvas nimmt volle Viewport-Höhe ein
- Icosaeder: `THREE.IcosahedronGeometry(1.5, 1)`, WireframeGeometry, Farbe `#00F5D4`, Rotation: `0.003 rad/frame` um Y, `0.001 rad/frame` um X
- Glow: `THREE.PointLight` Cyan (intensity: 2, distance: 3) + `UnrealBloomPass` via EffectComposer (threshold: 0, strength: 0.4, radius: 0.5)
- Grain-Overlay: separater Canvas, `Math.random()`-Pixel-Rauschen, opacity: 0.04, alle 80ms neu gezeichnet
- Links unten: Headline stacked
  - Zeile 1: `"Digitale"` — Syne 800, Creme, hero-size
  - Zeile 2: `"Erlebnisse."` — Syne 800, Electric Cyan, hero-size, leicht versetzt nach rechts
- Darunter: `"Webdesign · App · Podcast · Video — Berlin"` — Syne Mono, Grau, Typing-Cursor
- Unten links: zwei CTAs
  - Primär: `"Projekt starten"` — Cyan filled, pill — Klick öffnet Contact-Modal
  - Sekundär: `"Unsere Arbeit"` — Ghost/Outline, pill — scrollt zur Portfolio-Section
- Unten rechts: `"SCROLL ↓"` — Syne Mono, klein, animierter Bounce
- Mobile (<768px): Three.js deaktiviert, ersetzt durch CSS `conic-gradient` Mesh-Animation (Performance)

**Phase 2 — Scroll-Hijack:**
- ScrollTrigger pinnt Hero für erste 150vh des Scrolls (`scrub: 1`)
- Partikel: 300 `THREE.Points`, jedes mit randomem Velocity-Vektor, GSAP animiert `position.x/y/z` + `opacity: 0`, duration: 1.2s, ease: `expo.out`
- Partikelgröße: 2px, Farbe: Cyan, fliegen max. 8 Einheiten vom Ursprung weg, dann fade out
- Kamera-FOV: `60 → 120` in 0.8s (GSAP, ease: `power2.inOut`)
- Hero-Text: `opacity: 1 → 0`, `y: 0 → -30`, duration: 0.5s, startet gleichzeitig mit Partikel-Explosion
- Nach 150vh: ScrollTrigger-Pin löst sich, Manifesto-Section slides hoch (`scrub: false`, sofort)

### MANIFESTO
- Hintergrund: `#F5F0E8` (Creme) — visueller Schock nach dunkel
- Padding: `120px 0` — viel Luft
- Zentriert, max-width: 900px
- Headline 2 Zeilen, Syne 800:
  - Zeile 1: `"Wir bauen keine Websites."` — Schwarz
  - Zeile 2: `"Wir bauen Eindrücke."` — Schwarz
  - Reveal: Wort für Wort, Farbe Grau → Schwarz beim Scrollen (SplitType + ScrollTrigger)
- Unten: `"Speakz Media — Kantstraße 127, Berlin"` + pulsierender grüner Dot (live indicator)

### SERVICES
- Hintergrund: `#0A0A0A`
- Header-Row: `"Was wir machen"` links + Badge `"05 Services"` rechts
- Horizontal Scroll: ScrollTrigger pinnt Section für `500vh` vertikalen Scroll (`scrub: 1`); der horizontale Track bewegt sich dabei `(cardWidth * 5) - 100vw` px nach links. Progress-Indikator: dünne Linie unten, wächst von 0→100% synchron zum Scroll
- 5 Cards (400px breit, volle Section-Höhe), je mit:
  - Nummer oben links (Syne Mono, Grau, klein)
  - Service-Icon / Illustration Placeholder
  - Service-Name (Syne 700, Weiß, H2-Size)
  - 2-Zeilen Copy (Inter, Grau)
  - `"Mehr erfahren →"` (Cyan, hover underline) — scrollt zur jeweiligen Service-Card in der Section und öffnet ein Accordion mit erweiterter Beschreibung (kein separates Page-Routing)
  - Rechts: visuelles Element

| Card | Service | Akzent | Visual |
|------|---------|--------|--------|
| 01 | Webdesign | Cyan-Border | 3 animierte Site-Thumbnails |
| 02 | App-Entwicklung | Violett-Border | Phone-Mockup rotiert |
| 03 | Podcast-Produktion | Creme-BG | Equalizer pulsiert |
| 04 | Audio-Produktion | Dark + Waveform | Waveform animiert |
| 05 | Video-Produktion | Dark + Play | Loop-Placeholder |

### PORTFOLIO
- Hintergrund: `#0A0A0A`
- Header-Row: `"Unsere Arbeit"` links + `"Alle Projekte →"` rechts (Cyan)
- Grid: 2 große Cards oben (50/50) + 2 kleinere unten (50/50)
- Jede Card:
  - Projekt-Name (Syne 700) + Kategorie-Tag (Syne Mono, Cyan)
  - Before/After Slider: Maus-X-Position auf Card steuert Split-Linie (JS `mousemove`)
  - `[BEFORE]` Label links, `[AFTER]` Label rechts (Syne Mono, klein)
  - Bei Hover: 3D-Tilt (max 8°, Vanilla Tilt.js oder custom), Cursor morpht zu `"VIEW"`
  - Klick → öffnet Case Study Sub-Page

| Projekt | Kategorie | Placeholder |
|---------|-----------|-------------|
| Besser Sprechen | App · Webdesign | [img placeholder] |
| Flyly | App · Webdesign | [img placeholder] |
| Vorly | App · Webdesign | [img placeholder] |
| Applytix | SaaS · Webdesign | [img placeholder] |

### PROCESS
- Hintergrund: `#F5F0E8` (Creme)
- Headline: `"Wie wir arbeiten"` (Schwarz, Syne)
- 5 Steps — ScrollTrigger (`scrub: false`, Trigger: `"top 60%"`) aktiviert jeweils den nächsten Step beim Einscrollen
- Aktiver Step: Nummer groß (Syne 800, Schwarz), Title groß, Copy sichtbar
- Inaktive Steps: Nummer + Title klein, grau, vertikal gestackt
- Transition: smooth height + opacity Animation

```
01  Discovery       Euer Ziel, eure Nutzer, euer Markt
02  Konzept         Architektur, Wireframes, Strategie
03  Design          Visuelles System, Prototyp, Review
04  Entwicklung     Code, Performance, SEO, Tests
05  Launch & Care   Deployment, Hosting, Support
```

### TESTIMONIALS
- Hintergrund: `#0A0A0A`
- Oben: Endlos-Marquee — `[Client Name] — [Projekt]` im Loop, Syne Mono, Grau
  - Pausiert bei Hover, läuft bei `animation: marquee 20s linear infinite`
- Mitte: Großes Zitat in Anführungszeichen (Syne 700, Weiß, H1-Size)
  - Rotiert per fade alle 5s (GSAP timeline mit repeat)
  - Name + Rolle darunter (Inter, Grau)
  - Avatar-Placeholder (Kreis, 56px)
- Placeholder-Zitate (werden durch echte ersetzt):
  - `"[Testimonial Placeholder — Kunde 1]"` — Name, Rolle
  - `"[Testimonial Placeholder — Kunde 2]"` — Name, Rolle

### PRICING
- Hintergrund: `#0A0A0A`
- Headline: `"Transparent. Klar. Fair."` (Syne, Weiß)
- Zwei Karten nebeneinander:

**Karte 1 — Website Komplett**
- Preis: `€500` (Syne 800, riesig, Weiß)
- Sub: `"Einmalig"` (Syne Mono, Cyan)
- Features: Responsive Design, SEO, Content-Integration, Übergabe
- CTA: `"Projekt starten"` (Cyan filled)

**Karte 2 — Rundum-Paket** (Violett-Border-Glow, highlighted)
- Preis: `€50` (Syne 800, riesig, Weiß)
- Sub: `"Pro Monat"` (Syne Mono, Cyan)
- Features: Hosting, SSL, Updates, Support, 99.9% Uptime, Analytics
- CTA: `"Jetzt buchen"` (Violett filled)
- Badge oben: `"MOST POPULAR"` (Syne Mono, klein, Cyan)

Hover auf Karte: Border-Glow wächst, Card hebt sich `translateY(-8px)`.

### TEAM
- Hintergrund: `#1A1A1A`
- Headline: `"Die Köpfe dahinter"` (Syne, Weiß)
- Split-Layout 50/50:
  - Links: Text — kurzer Intro-Satz über die Agentur-Vision
  - Rechts: Zwei Portrait-Cards nebeneinander
    - Portrait-Placeholder (Kreis, Creme-BG)
    - Name (Syne 700)
    - Rolle (Syne Mono, Grau)
    - 1 Satz bio (Inter)
    - LinkedIn + Instagram Icon-Links

### CTA
- Fullscreen (100vh), kein anderer Inhalt
- Hintergrund: Gradient `#7B2FBE → #00F5D4` (links → rechts)
  - Animiert: Background-position langsam scrollend (`animation: gradientMove 8s ease infinite`)
- Headline (Syne 800, Weiß): `"Bereit für etwas Besonderes?"`
- Sub (Inter, Weiß 80%): `"Erzähl uns von deinem Projekt — wir melden uns innerhalb von 48h."`
- Button: `"Gespräch starten"` — Weiß, Pill, bei Hover: `background: #0A0A0A, color: #00F5D4`
- Unten: drei Social-Icons (Instagram, LinkedIn, WhatsApp) — Weiß, Hover: Cyan

### FOOTER
- Hintergrund: `#050505`
- Grid 4 Spalten (Desktop):
  - Spalte 1: Logo `SPEAKZ MEDIA` groß + `"Berlin, Deutschland"` + Newsletter-Input (E-Mail) + Submit-Button `"→"`. Submit: visueller Stub für initiale Build — Feld + Button ohne aktives Backend. Spätere Integration via Mailchimp Embedded Form (Embed-Code in `[MAILCHIMP_FORM_ACTION]` eintragen). Success-State: Input wird zu `"Danke! ✓"` (Cyan).
  - Spalte 2: `"Links"` — Home, Arbeit, Services, Über uns, Kontakt
  - Spalte 3: `"Services"` — Webdesign, App, Podcast, Audio, Video
  - Spalte 4: `"Kontakt"` — Email, Telefon, Adresse, Öffnungszeiten
- Bottom-Bar: `"© 2026 Speakz Media GmbH"` links + `"Impressum | Datenschutz | AGB"` rechts
- Sehr subtile Top-Border: `1px solid rgba(255,255,255,0.06)`

---

## 6. Case Study Sub-Pages

### Aufbau (gleich für alle 4 Projekte)

```
[HERO]          Fullscreen, Projekt-Name, Tags
[CHALLENGE]     Was war das Problem?
[BEFORE/AFTER]  Großer Split-Screen Slider
[LÖSUNG]        2-Spalten: links Text, rechts 2 versetzt gestackte Mockup-Bilder
[ERGEBNISSE]    Animierte Zahl-Counter
[NEXT PROJECT]  Link zur nächsten Case Study
```

**Case Study Hero:**
- Fullscreen (`100vh`), dunkler Hintergrund
- Projekt-Name (Syne 800, sehr groß, Weiß)
- Tags: Kategorie, Jahr, Technologie (Syne Mono, Cyan, pill-form)
- Scroll-Indikator

**Before/After Slider:**
- Volle Viewport-Breite
- Drag-Handle in der Mitte (weißer Kreis + `←→` Icon)
- `[VORHER]` Label links oben, `[NACHHER]` Label rechts oben
- Touch-Support auf Mobile

**Ergebnisse:**
- 3 große Zahlen nebeneinander
- Counter-Animation beim Einscrollen (von 0 → Endwert, 1.5s)
- Placeholder: `"+[X]% Traffic"` / `"[X] Nutzer"` / `"[X]x Conversion"`

**Navigation:**
- Header identisch zur Hauptseite
- `"← Zurück"` Link oben links
- `"Nächstes Projekt →"` am Ende, mit Vorschau-Thumbnail

---

## 7. Conversion-Optimierung

### CTA-Strategie
| Position | CTA-Text | Ziel |
|----------|----------|------|
| Hero | `"Projekt starten"` + `"Unsere Arbeit"` | Contact-Modal oder scroll zu Portfolio |
| Header (sticky) | `"Gespräch starten"` | Öffnet Contact-Modal |
| Nach Portfolio | `"Alle Projekte →"` | Scrollt zu nächster Case Study Card |
| Nach Testimonials | `"Euer Projekt starten"` | Öffnet Contact-Modal |
| Pricing | `"Projekt starten"` + `"Jetzt buchen"` | Öffnet Contact-Modal mit vorausgefülltem Paket |
| CTA-Section | `"Gespräch starten"` | Öffnet Contact-Modal |
| Mobile FAB | WhatsApp-Icon, fixed bottom-right | `https://wa.me/4930355310` direktlink |

### Contact-Modal (Fullscreen Overlay)
- Trigger: alle `"Gespräch starten"` / `"Projekt starten"` CTAs
- Overlay: `rgba(10,10,10,0.96)` + `backdrop-filter: blur(20px)`
- Schließen: `×` oben rechts, Klick auf Overlay, `Escape`-Taste
- Felder: Name*, E-Mail*, Projektbeschreibung (Textarea)*, Budget-Auswahl (Select: <€500 / €500–€2k / €2k+)
- Submit: POST via **Formspree** (`action="https://formspree.io/f/[FORMSPREE_ID]"`) — kein Backend nötig
- Success-State: Felder werden durch `"Danke! Wir melden uns innerhalb von 48h."` ersetzt (Cyan, Syne)
- Animation: Modal-Inhalt fährt von `y: 60 → 0`, `opacity: 0 → 1`, ease: `expo.out`, 0.5s

### Mobile FAB-Button
- Position: `fixed`, `bottom: 24px`, `right: 24px`, `z-index: 9999`
- Größe: 56px × 56px, Kreis, Hintergrund: `#25D366` (WhatsApp-Grün)
- Icon: WhatsApp SVG-Icon, Weiß, 24px
- Hover/Tap: `scale: 1.1`, `box-shadow: 0 8px 24px rgba(37,211,102,0.4)`
- Link: `href="https://wa.me/4930355310"`, `target="_blank"`
- Nur sichtbar auf Mobile/Tablet (`<1024px`), Desktop versteckt

### Stat-Bar (nach Hero, vor Manifesto)
- Hintergrund: `#0A0A0A` (nahtloser Übergang zum Hero)
- Drei Zahlen nebeneinander, zentriert, mit `|` Divider
- Counter-Animation beim Einscrollen: 0 → Endwert, 1.5s, ease: `power2.out`
- Layout:

| Zahl | Label |
|------|-------|
| `12+` | Projekte umgesetzt |
| `3` | Städte |
| `48h` | Response-Garantie |

### Social Proof Elemente
- Stat-Bar direkt nach Hero — Zahlen bauen sofort Vertrauen auf
- Testimonials direkt vor Pricing — Social Proof genau vor Entscheidung
- Before/After in Portfolio — visueller ROI-Beweis
- Case Studies zeigen messbare Ergebnisse mit animierten Countern

### Before/After — Interaktionsmodell (Konsistenz-Hinweis)
- **Portfolio-Cards (Hauptseite):** Maus-X-Position über der Card steuert Split passiv — kein Klicken nötig
- **Case Study Sub-Pages:** Drag-Handle in der Mitte — aktives Ziehen, Touch-Support
- Diese Unterscheidung ist absichtlich: Portfolio = Vorschau/Teaser, Case Study = detaillierte Exploration

---

## 8. Responsive Strategie

| Breakpoint | Anpassung |
|------------|-----------|
| Desktop (>1280px) | Vollständiges Design |
| Tablet (768–1280px) | Service-Cards scrollbar, Grid 1-spaltig |
| Mobile (<768px) | Stack-Layout, FAB-Button, vereinfachter 3D-Hero |

**Mobile Hero:** Three.js Icosaeder wird auf Mobile durch CSS-animiertes Gradient-Mesh ersetzt (Performance).

---

## 9. Asset-Platzhalter

Alle folgenden Elemente werden mit Platzhaltern gebaut und später ersetzt:

- `[LOGO]` — Text-Fallback: "SPEAKZ MEDIA"
- `[PORTRAIT_VINCENT]` — Creme-Kreis mit Initialen "VB"
- `[PORTRAIT_JEFFREY]` — Creme-Kreis mit Initialen "JW"
- `[PROJECT_BEFORE_X]` — Grau-Gradient-Placeholder
- `[PROJECT_AFTER_X]` — Dunkel-Gradient-Placeholder
- `[TESTIMONIAL_AVATAR_X]` — Creme-Kreis mit Initiale
- `[TESTIMONIAL_TEXT_X]` — Lorem-Ipsum-Platzhalter auf Deutsch
- `[STAT_1/2/3]` — Zahlen-Platzhalter
- `[MARQUEE_ENTRY_X]` — 6 Einträge: "Besser Sprechen — App", "Flyly — Webdesign", "Vorly — SaaS", "Applytix — SaaS", "Kunde 5 — Podcast", "Kunde 6 — Video"
- `[FORMSPREE_ID]` — Formspree Form-ID nach Account-Erstellung eintragen
- **Sprachlogik:** UI-Labels auf Englisch (`BEFORE` / `AFTER` / `VIEW` / `MOST POPULAR` / `NEXT PROJECT`) — Inhalt/Copy auf Deutsch. Diese Mischung ist bewusst: Tech-Labels international, Kundenansprache lokal
- `[CASE_RESULT_1/2/3]` — Ergebnis-Zahlen pro Case Study (z.B. "+340% Traffic")

---

## 10. Dateistruktur

```
/
├── index.html
├── impressum.html
├── datenschutz.html
├── agb.html
├── styles/
│   ├── variables.css        ← Design-Tokens (Farben, Fonts, Spacing)
│   ├── main.css             ← Reset, globale Styles, Custom Cursor
│   ├── animations.css       ← Keyframe-Animationen
│   └── sections/
│       ├── loader.css
│       ├── header.css
│       ├── hero.css
│       ├── stat-bar.css
│       ├── manifesto.css
│       ├── services.css
│       ├── portfolio.css
│       ├── process.css
│       ├── testimonials.css
│       ├── pricing.css
│       ├── team.css
│       ├── cta.css
│       ├── footer.css
│       └── modal.css
├── scripts/
│   ├── main.js              ← Init, Orchestrierung
│   ├── three-hero.js        ← Three.js Icosaeder + Partikel
│   ├── animations.js        ← GSAP ScrollTrigger Setups
│   ├── cursor.js            ← Custom Cursor Logik
│   ├── smooth-scroll.js     ← Lenis Setup
│   ├── modal.js             ← Contact Modal + Formspree
│   └── counter.js           ← Stat-Bar Counter-Animation
├── case/
│   ├── besser-sprechen/index.html
│   ├── flyly/index.html
│   ├── vorly/index.html
│   └── applytix/index.html
└── assets/
    ├── fonts/
    └── placeholder/
        ├── before-[projekt].jpg   ← Grau-Gradient PNG (800×600)
        └── after-[projekt].jpg    ← Dunkel-Gradient PNG (800×600)
```

### Impressum / Datenschutz / AGB
- `impressum.html`, `datenschutz.html`, `agb.html` als Stub-Pages mit gleichem Header/Footer
- Inhalt: Platzhalter-Text `[IMPRESSUM_CONTENT]` / `[DATENSCHUTZ_CONTENT]` / `[AGB_CONTENT]`
- Layout: einfache, lesbare Text-Page, kein Animations-Aufwand
- Verlinkung aus Footer-Bottom-Bar
