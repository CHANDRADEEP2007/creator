# SmartResume UI PRD

## 1. UI Vision and Principles
The UI should feel like a guided conversation rather than a form, with a minimalist, content-first layout that works well on desktop and mobile.

### Design principles
- **Clarity:** Plain language labels, visible hints, and no dense walls of fields.
- **Consistency:** Same placement for navigation, buttons, and messages across steps.
- **Focus:** One primary action per screen, minimal distractions and colors.
- **Accessibility:** WCAG 2.1 AA-aligned forms and navigation.
- **Mobile-first:** Layouts tested and readable on small screens.

## 2. User Flows and Screens
### 2.1 Core flow
**High-level flow:**
- Landing screen → “Get started”
- Country & basics step
- Experience step(s)
- Education step
- Skills & extras step
- Layout & length step
- Export & download step

Each step is a dedicated screen in a multi-step form with a progress indicator.

### 2.2 Screen definitions
**Screen 1: Landing**
- Hero area with product name (“SmartResume” placeholder) and one-line value prop.
- Primary CTA button: “Build my resume”.
- Secondary link: “View sample output” (opens modal preview).

**Screen 2: Country & basics**
- Fields: Target country (select), Job title you’re applying for, Desired resume length (1 page / 2 pages).
- Subtext under country: “Used to adapt date formats, sections, and length expectations.”
- Navigation: Next (primary), Back (disabled), Save & exit (secondary text link).

**Screen 3: Experience (multi-instance)**
- One “Experience card” per job with: Company name, Job title, Location, Start date, End date (or “Present”), Description (bullets textarea).
- “+ Add another role” button creates another card.
- Collapsible cards: show company, title, dates when collapsed.
- Real-time validation for date ordering and required fields.

**Screen 4: Education**
- Similar card layout to experience.
- Fields: School, Degree, Field of study, Location, Start date, End date, GPA (optional).
- “Add another education” support.

**Screen 5: Skills & extras**
- Skills input with chips and suggestions.
- Additional sections toggles: “Projects”, “Certifications”, “Achievements”.
- Each toggle opens simple mini-cards with title, organization, year, short description.

**Screen 6: Layout & length**
Options panel on left:
- Font style preset (e.g., “Clean” / “Modern” / “Classic”).
- Font size preference: “Fit into 1 page”, “Allow 2 pages”.
- Section order drag-and-drop (Experience, Skills, Education, Projects, etc.).

Live preview panel on right showing approximate resume rendering with page breaks hint.

**Screen 7: Export & download**
- Format selection: PDF, Word (DOCX), both.
- Option: “Email me a copy” field.
- Download button with loading state.
- Secondary actions: “Go back and edit”, “Start a new resume”.

## 3. Visual Design System
### 3.1 Typography and sizing
Use a neutral, ATS-friendly sans-serif stack similar to Calibri, Lato, or Source Sans Pro for readability and modern feel.

**App UI font:** primary font 14–16px for body text, 18–24px for headings.

**Resume font presets (for output, but referenced in UI):**
- Clean: Source Sans Pro / system sans.
- Modern: Lato / Roboto.
- Classic: Georgia-style serif as optional, but discourage for ATS-heavy roles.

**Dynamic font handling (in PRD terms)**
If user selects “1 page”:
- Default body font 10.5pt, minimum 10pt, headings 12–13pt.

If user selects “2 pages”:
- Default body font 11pt, headings 13–14pt, increased spacing between sections.

A small inline indicator in preview: “Your content currently fits in 1 page with 10.5pt font” or similar.

### 3.2 Color and spacing
- Primary background: near-white.
- Primary accent (buttons, focus states): single color (e.g., navy #1F3A60) for consistency and contrast.
- Error states: red accent with inline message under the field.

**Spacing:**
- 24–32px vertical spacing between major sections.
- 12–16px between fields.
- Contrast ratio for text and interactive elements must meet at least 4.5:1 per WCAG AA.

### 3.3 Components
**Core component set:**
- Text input with label, helper text, and error text.
- Select dropdown with search option for long lists (e.g., countries).
- Toggle/checkbox for “Currently working here”.
- Button variants: primary (solid), secondary (outline), tertiary (text).
- Step progress indicator: numbered steps (1–7) plus a horizontal bar.
- Collapsible card for experience/education blocks.

## 4. Interaction and UX Details
### 4.1 Multi-step form UX
Each step shows: step number, title, brief explanation, and progress bar.

- “Next” is disabled until required fields are valid; show contextual error messages above relevant fields, not just at top.
- Allow “Back” without losing information.
- Provide inline field-level validation as users type or exit the field.

### 4.2 Preview behavior
- Live preview updates when user leaves a field or every few seconds of inactivity.
- Highlight the section being edited in the preview (e.g., faint outline around Experience).
- Show subtle page break indicators (dotted line with “Page 1 end”).

### 4.3 Empty, loading, and error states
- Empty state for preview: “Your resume preview will appear here once you enter your information.”
- Loading overlay during export with a short sentence like “Building your resume layout…”.
- Error banners for export failures with retry and “Report issue” link.

## 5. Accessibility and Responsiveness
### 5.1 Accessibility requirements
- All inputs have visible labels tied to fields via semantic HTML and ARIA attributes.
- Full keyboard navigation:
  - Tab order follows visual order.
  - Focus ring clearly visible on interactive elements.
- Color contrast meets WCAG 2.1 AA: text 4.5:1, large text 3:1, UI components 3:1.
- Screen reader friendly: meaningful headings, landmarks, and clear error text tied to inputs.

### 5.2 Responsive behavior
**Breakpoints:**
- Mobile: single-column; preview collapses into a separate “Preview” tab.
- Tablet: stacked layout (form above, preview below).
- Desktop: two-column (form left 40%, preview right 60%).

Touch targets at least 44x44px for form controls.

## 6. Non-Functional UI Requirements
- **Performance:** initial UI load under 2 seconds on modern 4G; form interactions feel instantaneous.
- **Resilience:** unsaved form data preserved using local storage or draft autosave to avoid loss on refresh.
- **Localization-ready:** labels, help texts, and button copy pulled from a translations layer so the same UI can later support multiple languages.
