# Resume Generator - Product Requirements Document

**Product Name:** ResumeMagic  \
**Version:** 1.0  \
**Last Updated:** December 2025  \
**Target Users:** Job seekers, Career transitioners, International applicants  \
**Status:** In Development

---

## Executive Summary

ResumeMagic is an AI-powered, country-aware resume generation platform that transforms work experience data into professionally formatted, ATS-compliant resumes tailored to user requirements. The platform dynamically adjusts resume formatting based on page constraints (1-2 pages) and export preferences (PDF/DOCX), providing personalized resumes optimized for both Applicant Tracking Systems (ATS) and human recruiters.

**Core Value Proposition:** One conversation, infinite resume possibilities—tailored to job markets, industries, and hiring preferences across 50+ countries.

---

## 1. Product Overview

### 1.1 Vision

To democratize professional resume creation by combining intelligent data collection, country-specific formatting standards, and AI-powered content optimization. ResumeMagic enables users to generate dozens of tailored resumes from a single data entry, dramatically reducing time-to-apply and increasing interview callbacks.

### 1.2 Core Functionality

| Phase | Feature | Status |
| --- | --- | --- |
| Phase 1 (MVP) | Country selection → Interactive questionnaire → Resume generation (PDF/DOCX) | Development |
| Phase 2 | AI bullet point enhancement, ATS scoring, cover letter generation | Roadmap |
| Phase 3 | Interview preparation, LinkedIn optimization, salary insights | Roadmap |

### 1.3 Key Differentiators

- **Country-Aware Intelligence** - Adapts resume format, terminology, and emphasis based on target country (US prioritizes quantified achievements; EU prioritizes certifications; India emphasizes academic credentials)
- **Dynamic Font Sizing** - Intelligently adjusts fonts (10pt-11pt-12pt) based on page constraint and content volume
- **Bi-directional Export** - Generates native Word documents (preserves formatting) + PDF (universal compatibility)
- **ATS Compliance First** - Uses semantic HTML and clean formatting; passes ATS parsing tests
- **Conversational UX** - Multi-step form mimics interview flow; feels natural vs. overwhelming

---

## 2. User Journey & Flows

### 2.1 Happy Path: Complete Resume Generation

START  
↓  
**[Country Selection Modal]**  
User selects: "United States" / "India" / "Germany" / etc.  
↓  
**[Career Profile Section]**  
Q1: Your current job title / role (text input)  
Q2: Are you a recent graduate? (yes/no) → Conditional skip of some questions  
↓  
**[Professional Experience Section]**  
Loop until "I'm done adding experience"  
Q: Company Name (text input)  
Q: Job Title (text input)  
Q: Start Date (month/year picker)  
Q: End Date (month/year picker) OR "Currently working here" (checkbox)  
Q: Industry/Function (dropdown) → Powers AI suggestions  
Q: Responsibility 1 (textarea) → Auto-bullet point conversion  
Q: Responsibility 2, 3, 4... (add more button)  
Q: Key achievement (textarea) → Quantify suggestion  
A: [ADDED] or [EDIT] or [REMOVE]  
↓  
**[Education Section]**  
Q: Degree type (diploma/bachelor/master/phd dropdown)  
Q: University name (autocomplete)  
Q: Field of study (text)  
Q: Graduation date (month/year picker)  
Q: GPA (optional, 0.0-4.0 slider)  
Q: Relevant coursework? (yes → textarea)  
Q: Honors/Awards? (yes → textarea)  
↓  
**[Skills Section]**  
Q: Core technical skills (tag input) → Autofill suggestions based on job title + company  
Q: Soft skills (tag input)  
Q: Certifications (tag input)  
Q: Languages (tag input with proficiency level: native/fluent/professional/basic)  
↓  
**[Resume Customization]**  
Q: How long should your resume be? (1 page / 2 pages) → Dynamically adjusts font + spacing  
Q: Which countries/regions are you targeting? (multi-select) → Reorders sections accordingly  
Q: Export format? (PDF / DOCX / Both)  
Q: Resume template preference? (Classic / Modern / Minimal / ATS-Optimized)  
↓  
**[GENERATING...]**  
Backend processes data:  
- AI polishes bullet points (action verb + metric + impact)
- ATS parser validates structure
- Font sizing algorithm selects optimal font
- Generates PDF (jsPDF/PDFKit) + DOCX (docx library)
↓  
**[Download Page]**  
Shows dual download buttons (PDF + DOCX)  
Shows preview thumbnail  
Shows ATS Compatibility Score (0-100)  
Shows "Ready to Apply?" CTA → LinkedIn/Job Board Integration  
↓  
END (User can regenerate with different filters)

### 2.2 Exception Flows

**Incomplete Data Path:**

- User exits mid-form → Draft auto-saved to localStorage (Phase 2: move to cloud)
- On return → "Resume incomplete - 40% done. Resume needs at least 1 job + education"
- Resume Generation disabled until minimum requirements met

**International Applicant Path:**

- User selects country → Region-specific questions appear
  - US/Canada: Emphasis on metrics, achievements, promotions
  - UK/EU: Emphasis on qualifications, certifications, professional development
  - India: Emphasis on academics, certifications, skills
  - Middle East: Can optionally add "Personal Information" (Age, Nationality, Marital Status)

---

## 3. Detailed Feature Specifications

### 3.1 Section 1: Country & Market Selection

**Screen Name:** Market Selector  
**Purpose:** Establish context for resume customization. Different countries have vastly different resume conventions.

**UX Elements:**

- World map visualization with hover states
- Search dropdown (type "India" → autocomplete filters)
- Multi-select for users targeting multiple markets
- Preset buttons: "English-speaking markets", "Tech-focused markets", "EU Markets"

**Country-Specific Adaptations:**

| Country | Resume Length | Key Emphasis | Unique Fields |
| --- | --- | --- | --- |
| United States | 1 page (junior) / 2 pages (senior) | Quantified results, impact | None |
| United Kingdom | 1-2 pages | Qualifications, professional development | Nationality (optional) |
| India | 1-2 pages | Education, academics, certifications | Education prominence |
| Germany | 2-3 pages | Certifications, technical depth | Photo (optional), marital status |
| Canada | 1-2 pages | Similar to US + bilingual emphasis | French fluency |
| Australia | 1-2 pages | Achievements, cultural fit | Visa sponsorship required? |

**Table 1: Country-Specific Resume Conventions**

**Data Flow:**

Country Selection  
↓  
Updates Redux/Zustand state: `selectedCountries: ["US", "India"]`  
↓  
Triggers form field reconfiguration  
→ Conditionally show/hide fields (e.g., "Photo" for EU only)  
→ Adjust validation rules  
→ Preload country-specific templates

---

### 3.2 Section 2: Career Profile & Demographics

**Screen Name:** Quick Profile  
**Purpose:** Gather high-level career context; powers AI personalization and conditional form logic.

**Form Fields:**

- **Current Job Title** (text input, required)
  - Autocomplete from Grok/O*NET database
  - Example suggestions: "Product Manager", "Data Analyst", "Software Engineer"
- **Years of Experience** (slider: 0-50 years)
  - Drives section order (junior: skills first, senior: achievements first)
  - Gates educational emphasis
- **Are you a recent graduate?** (yes/no toggle)
  - If YES → Conditionally show: "Relevant coursework?", "Academic honors?"
  - If YES → Move Education to top
  - If YES → Reduce emphasis on specific years in experience
- **Target Industry/Domain** (multi-select dropdown)
  - Examples: Tech, Finance, Healthcare, Consulting, Non-profit, Retail
  - Powers AI bullet point suggestions and skill recommendations
- **Employment Status** (dropdown)
  - Currently Employed / Unemployed / Freelance / Looking to Transition
  - Affects narrative tone in professional summary

**Validation:**

- Job title cannot be empty
- Years of experience must be between 0-70
- If recent grad + 5+ years experience → Warning: "These don't match. Are you sure?"

---

### 3.3 Section 3: Professional Experience (Multi-Step Loop)

**Screen Name:** Add Work Experience  
**Purpose:** Capture detailed job information. Repeating flow allows unlimited job entries.

**Form Structure (Repeating Block):**

1. **Job Basics**

   a. **Company Name** (text input, required)
   - Autocomplete from Crunchbase/LinkedIn database
   - Shows company industry badge
   - Example: "Meta (Technology, San Francisco, CA)"

   b. **Job Title** (text input, required)
   - Autocomplete from O*NET
   - Spell-out full title (not abbreviations: "Software Engineer" not "SWE")

   c. **Employment Type** (dropdown)
   - Full-time / Part-time / Contract / Freelance / Internship

   d. **Start Date** (month/year picker, required)

   e. **End Date** (month/year picker, required) OR "Currently working here" (checkbox)
   - If "Currently working" selected → Auto-set end date to today
   - Shows tenure bar: "2 years, 4 months"

   f. **Location** (text input, auto-inferred from company if available)

2. **Context**

   a. **Team Size** (dropdown)
   - 1-5 / 5-20 / 20-100 / 100+ employees
   - Informs impact language (e.g., "Owned X in team of 5" vs. "Contributed to X across org of 5000")

   b. **Department/Function** (dropdown)
   - Engineering / Product / Sales / Marketing / Operations / Finance / HR
   - Drives AI bullet point tone

   c. **Reporting Manager Title** (optional text input)

3. **Achievements & Responsibilities (Key Innovation)**

   a. **Primary Achievement** (textarea, 2-3 sentences)
   - Real-time AI suggestion: "Did you improve X by Y%? Quantify your impact!"
   - Character counter: 0/200
   - Example input: "Led development of new recommendation algorithm"
   - Example output suggestion: "Designed recommendation engine increasing user engagement by 23%; deployed to 2.5M users"

   b. **Achievement 2, 3, 4...** (repeating textarea blocks)
   - "Add another achievement" button
   - Max 5-6 achievements (prevents CV from becoming 2-3 pages)

   c. **AI Bullet Point Optimizer (Phase 2 Feature)**
   - Input: User's raw text
   - Output: 3 alternative rewordings
   - Example:
     - Input: "Made API faster"
     - Option A: "Optimized REST API response time by 40%, reducing server costs by $50K annually"
     - Option B: "Engineered database query optimization, decreasing API latency from 800ms to 280ms for 100M+ requests/day"
     - Option C: "Architected caching layer for API endpoints; improved throughput by 3.2x while maintaining SLA compliance"
   - User selects preferred version OR edits and saves

4. **Review & Actions**

   a. Job preview card showing formatted output

   b. Buttons: [Save This Job] [Edit] [Delete]

   c. Shows count: "1 of 5 jobs added"

   d. "Add another job" button repeats the flow

   e. "Done with jobs" button moves to next section

**Smart Defaults & AI Assistance:**

- Auto-detect employment tenure: If start/end dates span >2 years without activity → "Long tenure at one company. Highlight promotions/impact."
- Recent job inflation detector: If 3+ jobs in <2 years → "Frequent job changes. Emphasize learning + reasons for growth."
- Credential matching: If entered company + title → Suggest relevant skills/certifications from public job data

---

### 3.4 Section 4: Education

**Screen Name:** Educational Background

**Form Fields:**

- **Degree Type** (dropdown, required)
  - Diploma / Associate / Bachelor / Master / PhD / Professional Certificate
- **Institution Name** (text input, required)
  - Autocomplete from university database (US News, QS Rankings)
  - Shows university rank if available
  - Example: "Stanford University [Ranked #3 US]"
- **Field of Study** (text input, required)
  - Example: "Computer Science", "Business Administration", "Electrical Engineering"
- **Graduation Date** (month/year picker, required)
  - Format: "May 2023"
  - Validation: Cannot be future date (unless student inputs graduation in progress)
- **GPA** (optional, slider 0.0-4.0)
  - Only display on resume if GPA > 3.5 (best practice: omit lower GPAs)
  - Smart default: If left blank → Omit from resume
- **Relevant Coursework** (optional textarea)
  - Conditional display: Only shows for recent graduates (<3 years post-grad)
  - Prompt: "List 3-5 relevant courses (e.g., Machine Learning, Database Design, Statistics)"
  - Character limit: 150
- **Academic Honors & Awards** (optional textarea)
  - Example: "Dean's List (4/4 semesters), Valedictorian, Scholarship Name (amount)"
  - Multi-entry list format
  - Character limit: 200
- **Add Another Degree?** (repeating section)
  - Users can add multiple degrees
  - Most recent education appears first

---

### 3.5 Section 5: Skills, Certifications & Languages

**Screen Name:** Skills & Expertise

**Subsections:**

1. **Technical Skills** (tag input with autocomplete)
   - Suggestion engine: Based on job title + companies, autocomplete relevant tools
   - Example for "Data Analyst": Python, SQL, Tableau, Excel, R, AWS
   - Tag limit: 8-10 (forces prioritization)
   - Validation: Remove obvious non-technical entries ("good communicator" → "Communication")

2. **Soft Skills** (tag input)
   - Examples: Leadership, Project Management, Negotiation, Analytical Thinking
   - Tag limit: 4-6
   - Common patterns: Auto-suggest based on job title

3. **Certifications** (repeating list)
   - Fields: Certification Name, Issuing Organization, Expiration Date (if applicable)
   - Examples: "AWS Certified Solutions Architect", "PMP", "Google Analytics Certified"
   - Display rule: Only show unexpired or recently expired (<6 months) certifications

4. **Languages** (repeating list)
   - Fields: Language Name, Proficiency Level (dropdown)
   - Proficiency tiers: Native / Fluent / Professional / Professional Working / Limited
   - Examples format on resume: "English (Native) | Spanish (Fluent) | Mandarin (Professional)"
   - Best practice: Omit "English (Native)" for US applicants

---

### 3.6 Section 6: Resume Customization & Export (Critical Innovation)

**Screen Name:** Resume Settings  
**Purpose:** Dynamic page-length adjustment and format selection. This is where the "creative" font-sizing algorithm lives.

#### 3.6.1 Page Length Selection

**UI:** Two buttons: [1 Page] [2 Pages]

**Impact on Resume:**

| Aspect | 1-Page Resume | 2-Page Resume |
| --- | --- | --- |
| Font Size | 10pt (body), 11pt (headers) | 11pt (body), 12pt (headers) |
| Line Height | 1.15 | 1.5 |
| Margins | 0.5 inches | 0.75 inches |
| Max Jobs | 3-4 (most recent) | All jobs |
| Section Order | Experience first | Customized by country |
| Achievement Count/Job | 3 achievements | 4-5 achievements |
| Skills Limit | 6 skills (inline) | 10 skills (2-column) |
| Coursework/Honors | Omitted | Included if provided |
| Spacing Between Sections | 6pt | 10pt |

**Table 2: 1-Page vs. 2-Page Resume Specifications**

**Algorithm for Page Fit:**

```
IF content_length > 1_page_limit:
THEN page_length = 2_pages
AND show_warning: "Your resume is long. Consider 2 pages or remove older jobs."
IF page_length = 1_page AND content still > limit:
THEN iteratively:
- Remove oldest job
- Reduce achievements/job from 5 → 4 → 3
- Reduce font from 11pt → 10.5pt → 10pt
- Reduce line height from 1.5 → 1.25 → 1.15
- Reduce margins from 0.75" → 0.6" → 0.5"
IF page_length = 2_pages AND content < 1.3_pages:
THEN message: "Your resume could fit 1 page. Consider condensing."
```

#### 3.6.2 Target Markets & Section Reordering

**UI:** Multi-select dropdown: "Which countries are you applying to?"

**Impact:**

1. **US Market**
   - Section order: Professional Summary → Experience → Education → Skills
   - Emphasis: Quantified results, impact metrics
   - Example: "Increased revenue by $2M (30% YoY)" vs. "Improved sales performance"

2. **EU Markets (Germany, UK, France)**
   - Section order: Experience → Education → Certifications → Languages → Skills
   - Emphasis: Formal qualifications, professional development
   - Include: Full dates (01/2020 - 03/2023) instead of (Jan 2020 - Mar 2023)
   - Optional: Photo, nationality, marital status (varies by country)

3. **India Market**
   - Section order: Professional Summary → Education → Experience → Skills → Certifications
   - Emphasis: Educational credentials prominent; GPA matters
   - Include: University rank (IIT, BITS Pilani, etc.)

4. **Canada Market**
   - Section order: Same as US BUT include bilingual indicator
   - Language note: "English (Native) | French (Fluent)" appears prominently

#### 3.6.3 Template Selection

**UI:** Visual carousel showing 4 template previews

**Template Options:**

1. **ATS-Optimized Template (DEFAULT)**
   - Minimal graphics, simple black-and-white layout
   - Clean section headers: All-caps, single underline
   - Bullet points start with action verbs
   - Compatible with 99.9% of ATS systems
   - Font: Arial or Calibri (standard fonts)

2. **Modern Template**
   - Subtle color accents (teal/blue headers)
   - Sidebar: Skills/languages in sidebar box
   - Light gray background in header section
   - ATS-compatible but emphasizes visual appeal
   - Font: Open Sans or Roboto

3. **Classic Template**
   - Traditional format (highest compatibility)
   - Bold section headers
   - No colors, no graphics
   - Suitable for conservative industries (finance, law, government)
   - Font: Times New Roman or Georgia

4. **Minimal Template**
   - Maximum white space
   - Tiny left border accent
   - Two-column layout (name/contact left, experience right)
   - Clean and modern without being flashy
   - Font: Helvetica or Segoe UI

**Selection Logic:**

- Default: ATS-Optimized (safest choice)
- If user selects "Modern" → Warning: "Some ATS systems may have compatibility issues with colors"
- If targeting US tech company → Recommend Modern
- If targeting government/finance → Recommend Classic

#### 3.6.4 Export Format Selection

**UI:** Radio buttons: ○ PDF ○ DOCX ○ Both

**Format Specifications:**

| Aspect | PDF | DOCX |
| --- | --- | --- |
| Library | jsPDF / PDFKit | docx library (Node.js) |
| Generation | Client-side (fast) | Server-side (slower, reliable) |
| Pros | Universal, no editing, locked formatting | Editable, easy to customize in MS Word |
| Cons | Cannot edit after, larger file size | Some ATS systems prefer PDF, formatting drift |
| Use Case | Direct application submission | Personal customization, record-keeping |

**Table 3: PDF vs. DOCX Comparison**

**Best Practices:**

- Default selection: Both (user gets maximum flexibility)
- File naming convention: `[FirstName]_[LastName]_Resume_[TargetCountry].pdf` or `.docx`
- Example: `Chandraleep_Patel_Resume_US.pdf`

---

### 3.7 Section 7: Download & Preview

**Screen Name:** Your Resume Ready!

**Page Layout:**

- Large centered heading: "✓ Your Resume is Ready!"
- 2-column layout:
  1. **LEFT:** Resume preview thumbnail (scrollable, read-only)
  2. **RIGHT:** Download options + metadata

**Right Panel Elements:**

1. **ATS Compatibility Score**
   - Score: 0-100 (shown as circular progress indicator)
   - Color coding: Red (0-50), Yellow (50-75), Green (75-100)
   - Explanation: "Your resume scores 89/100 for ATS compatibility. Parsing test passed."
   - Drill-down: Click to see ATS issues (e.g., "Missing action verbs in 2 bullet points")

2. **Quick Statistics**
   - "1 page resume"
   - "4 jobs, 16 achievements"
   - "12 skills listed"
   - "Generated in 2.3 seconds"

3. **Download Buttons**
   - Large **[↓ Download PDF]** button (primary CTA)
   - **↓ Download DOCX** button (secondary CTA)
   - Both buttons show file size: "PDF (2.1 MB)" / "DOCX (180 KB)"

4. **Share Options**
   - 📋 Copy Resume Link - Generates unique shareable link
   - 🔗 Copy to Clipboard - Copy formatted text
   - 📧 Email to myself - Sends download links to email

5. **Next Steps CTA**
   - "Ready to Apply?"
   - Links: [Search Jobs] [Start Another Resume] [Optimize for [Company Name]]

---

## 4. Technical Specifications

### 4.1 Font Sizing Algorithm (Core Innovation)

**Objective:** Maximize readability while respecting page constraints without manual intervention.

**Algorithm Logic:**

```
INPUT: content_volume (word count), page_preference (1 or 2)
IF page_preference = 1_page:
base_font_size = 10pt
base_line_height = 1.15
margin = 0.5"
ELSE IF page_preference = 2_pages:
base_font_size = 11pt
base_line_height = 1.5
margin = 0.75"
/* Dynamic adjustment for content fit */
content_rendered = render_template(all_content, base_font_size, margin)
page_count = measure_height(content_rendered)
IF page_count > page_preference AND page_preference = 1:
/* Iterative reduction */
REDUCE font_size BY 0.5pt
REDUCE line_height TO 1.2
REDUCE margin TO 0.6"
REMOVE oldest_job OR reduce_achievements_per_job(4 → 3)
RECHECK page_count
IF page_count STILL > 1:
REDUCE margin TO 0.5"
REDUCE line_height TO 1.1
font_size = 9.5pt
IF page_count > 1 AGAIN:
FORCE remove_oldest_job
FORCE achievements_per_job = 2
ELSE IF page_count < 0.8 * page_preference:
/* Content too short - adjust margins upward */
INCREASE margin BY 0.1"
INCREASE line_height BY 0.1
ADD professional_summary_section
RETURN optimized_resume
```

**Font Specifications by Template:**

| Template | Header Font | Body Font | Section Title | Size Range |
| --- | --- | --- | --- | --- |
| ATS-Optimized | Arial | Calibri | 11pt, all-caps | 10-11pt body |
| Modern | Open Sans | Open Sans | 11pt, blue | 10.5-11.5pt body |
| Classic | Georgia | Times New Roman | 11pt, bold | 10-11pt body |
| Minimal | Helvetica | Segoe UI | 10pt, accent line | 10-11pt body |

**Table 4: Font Specifications by Template**

---

### 4.2 ATS Compliance Checker

**Purpose:** Validate resume against ATS parsing rules before export.

**Checks Performed:**

- **Structure Validation**
  - Contact info present (name, phone, email, location)
  - Standard section headers (EXPERIENCE, EDUCATION, SKILLS)
  - No graphics/images embedded (except header photo for EU)
  - No tables (ATS cannot parse) - EXCEPT styled as divs
- **Content Validation**
  - Each job has action-verb starting bullet (e.g., "Led", "Managed", "Developed")
  - No acronyms without explanation (CRM must be "Customer Relationship Management (CRM)")
  - Dates formatted consistently (MM/YYYY or Month YYYY)
  - Phone number in standard format: +1-XXX-XXX-XXXX
- **Keyword Matching**
  - Scans job target (if provided) and cross-references resume keywords
  - Highlights missing high-priority keywords from job description
  - Suggests improvements: "Job mentions 'Machine Learning' 8x, but your resume uses 'ML' 3x"
- **Readability**
  - Font size >= 9pt (ATS struggles with smaller)
  - Line spacing >= 1.15 (prevents text overlap)
  - Column count = 1 (ATS struggles with multi-column)
- **Completeness**
  - >= 1 job experience listed
  - >= 1 education entry listed
  - >= 3 skills listed

**Output:** ATS Score (0-100) + diagnostic report:

- ✓ Contact information properly formatted
- ✓ Section headers use standard terminology
- ✗ Warning: Job #2 missing action verb - consider rewriting "Responsible for X" → "Managed X"
- ✓ All dates consistently formatted
- ✓ No multi-column layout detected
- ⚠ Keyword analysis: Resume uses "Data Analysis" 2x vs. job posting 6x. Consider adding synonyms.

---

### 4.3 Data Storage & State Management

**State Management:** React (Zustand) or Vue (Pinia)

**State Shape:**

```
{
  userProfile: {
    currentJobTitle: string,
    yearsOfExperience: number,
    isRecentGraduate: boolean,
    targetIndustry: string[]
  },
  selectedCountries: string[], // ["US", "India", "Germany"]
  experience: [
    {
      id: uuid,
      companyName: string,
      jobTitle: string,
      startDate: Date,
      endDate: Date | null,
      isCurrent: boolean,
      teamSize: string,
      function: string,
      achievements: [
        { id: uuid, text: string, quantified: boolean }
      ]
    }
  ],
  education: [
    {
      id: uuid,
      institution: string,
      degreeType: string,
      fieldOfStudy: string,
      graduationDate: Date,
      gpa: number,
      coursework: string,
      honors: string
    }
  ],
  skills: {
    technical: string[],
    soft: string[],
    certifications: [
      { name: string, issuer: string, expirationDate: Date }
    ],
    languages: [
      { name: string, proficiency: string }
    ]
  },
  resumeSettings: {
    pageLength: 1 | 2,
    template: "ats-optimized" | "modern" | "classic" | "minimal",
    exportFormat: "pdf" | "docx" | "both",
    targetCountries: string[]
  },
  generatedResume: {
    pdfUrl: string,
    docxUrl: string,
    atsScore: number,
    generatedAt: Date
  }
}
```

**Persistence:** localStorage (Phase 1) → Cloud DB (Phase 2)

- Auto-save after each section completion
- Recovery on session reload
- Clear option before generating new resume

---

### 4.4 Backend Specifications

**Tech Stack:**

- Runtime: Node.js + Express
- PDF Generation: jsPDF or PDFKit
- DOCX Generation: docx library (npm)
- Database: MongoDB (Phase 2) or JSON file (Phase 1 MVP)
- AI/LLM Integration: OpenAI API (optional, Phase 2)

**Endpoints:**

1. **POST /api/resume/generate**
   - Input: Resume JSON object (full user data)
   - Output: `{ pdfUrl, docxUrl, atsScore, generationTime }`
   - Process:
     - Validate input schema
     - Apply country-specific formatting
     - Render HTML template
     - Generate PDF (jsPDF)
     - Generate DOCX (docx library)
     - Run ATS checker
     - Upload to cloud storage (AWS S3 / Cloudinary)
     - Return signed download URLs
   - Response time: < 3 seconds

2. **GET /api/resume/:resumeId**
   - Fetch generated resume by ID
   - Return preview + download links

3. **POST /api/resume/validate-ats**
   - Input: Resume content
   - Output: ATS score + diagnostic report

4. **GET /api/suggestions/:jobTitle**
   - Auto-complete suggestions for skills, achievements based on job title
   - Data source: O*NET database

5. **POST /api/companies/search**
   - Autocomplete company names
   - Return company metadata (industry, location, size)
   - Data source: Crunchbase API or internal database

---

## 5. Design & UX Principles

### 5.1 Design System

**Color Palette:**

- Primary: Teal (#2D9E9E) - Trustworthy, professional
- Accent: Gold (#D4A574) - Premium, highlight CTAs
- Neutral: Gray (#4A5568) - Body text
- Success: Green (#48BB78) - Validation, completion
- Warning: Orange (#ED8936) - Alerts
- Background: White + Light Gray (#F7FAFC)

**Typography:**

- Heading: Inter Bold, 24px
- Subheading: Inter Semibold, 18px
- Body: Inter Regular, 16px
- Code/Mono: Courier New, 12px

**Component Spacing:** 8px grid system (8, 16, 24, 32, 40px margins/padding)

### 5.2 Accessibility Standards

- WCAG 2.1 AA compliance (minimum)
- Color contrast >= 4.5:1 for normal text
- Form labels associated with inputs
- Keyboard navigation support (Tab through all interactive elements)
- Semantic HTML (`<button>`, `<label>`, `<fieldset>`)
- ARIA attributes for screen readers (`aria-label`, `aria-describedby`)
- Focus indicators visible (2px outline)

### 5.3 Mobile Responsiveness

**Breakpoints:**

- Mobile: 320px - 640px
- Tablet: 640px - 1024px
- Desktop: 1024px+

**Mobile-Specific Adjustments:**

- Single-column layout
- Larger touch targets (44px minimum)
- Simplified multi-select (dropdown instead of checkboxes)
- Date pickers native mobile (calendar vs. custom picker)
- Export options as bottom sheet modal

---

## 6. Success Metrics & Analytics

### 6.1 Key Metrics to Track

| Metric | Target | Method |
| --- | --- | --- |
| Resume generation success rate | > 98% | Count successful exports / total attempts |
| Average generation time | < 3 seconds | Measure backend latency |
| Template preference distribution | Even spread across 4 | Track selections |
| Country market adoption | US > 40%, India > 20%, EU > 25% | Segment by country selection |
| Export format distribution | PDF > 50%, DOCX > 40% | Track downloads |
| User retention (7-day) | > 35% | Return visits within 7 days |
| Resume quality score (ATS) | Avg 85+ | Track ATS scores |
| Mobile vs Desktop usage | 60/40 split | Segment analytics |

### 6.2 Event Tracking

**Events to log:**

- Form section completed
- Resume generated
- PDF/DOCX downloaded
- ATS score viewed
- Template selected
- Page length preference
- Errors encountered
- Time-to-complete (per section)

---

## 7. Deployment & Hosting

**GitHub Pages (Frontend):**

- Netlify or Vercel for automatic deployments on main branch push
- Environment variables: API_URL, SENTRY_DSN

**Backend (API):**

- Development: Heroku (free tier) or Railway
- Production: AWS EC2 / DigitalOcean
- Database: MongoDB Atlas (free 512MB tier)
- File Storage: AWS S3 or Cloudinary (free tier for images)

**CI/CD Pipeline:**

- GitHub Actions: Run tests, linting, build on PR
- Deploy to staging on PR approval
- Deploy to production on tag release

**Monitoring & Logging:**

- Sentry for error tracking
- DataDog or LogRocket for performance monitoring
- Uptime Robot for availability alerts

---

## 8. Privacy & Security

- Data Encryption: All resume data encrypted in transit (HTTPS/TLS)
- Compliance: GDPR-compliant (users can request deletion within 30 days)
- No Third-Party Sharing: Resume data never shared with recruiters/agencies without explicit consent
- User Control: Users can delete all data on account deletion
- Terms of Service: Clearly state data usage and retention policy

---

## 9. Future Roadmap (Phase 2 & 3)

| Phase | Features | Timeline |
| --- | --- | --- |
| Phase 2 | AI bullet point enhancement, cover letter generator, LinkedIn summary, Job description analysis | Q1-Q2 2026 |
| Phase 3 | Interview prep, salary insights, career path recommendations, employer brand search | Q3-Q4 2026 |
| Phase 4 | Mobile app (iOS/Android), team collaboration, applicant tracking integration | 2027 |

---

## 10. Success Criteria & Acceptance

**MVP Launch Success Criteria**

- [x] Country selection working for 15+ countries
- [x] All form sections functional with data persistence
- [x] PDF generation working correctly
- [x] DOCX generation with proper formatting
- [x] ATS compatibility checker functioning
- [x] Font-sizing algorithm producing 1-2 page resumes as specified
- [x] Mobile responsive design tested on 3+ devices
- [x] Zero critical bugs on GitHub issue tracker
- [x] Performance: < 3 second generate time (90th percentile)
- [x] 95%+ uptime SLA

---

## Appendix A: Glossary

| Term | Definition |
| --- | --- |
| ATS | Applicant Tracking System - Software used by recruiters to parse and filter resumes |
| CPT | Curricular Practical Training - Work authorization for international students in the US |
| DOCX | Microsoft Word document format (.docx extension) |
| jsPDF | JavaScript library for client-side PDF generation |
| O*NET | Occupational Information Network - US government database of job titles and skills |
| Quantified Achievement | An achievement described with specific metrics/numbers (e.g., "30% increase" vs. "improvement") |
| Semantic HTML | HTML that clearly describes meaning to browser and assistants |

---

## Appendix B: Country-Specific Resume Examples

[Placeholder - Include 2-3 example resume layouts: US 1-page, India 2-page, Germany 2-page with notes on differences]

---

## Document History

| Version | Date | Author | Changes |
| --- | --- | --- | --- |
| 1.0 | Dec 2025 | PM Team | Initial PRD for MVP launch |

---

_End of PRD_

---

## How to Use This PRD

1. For Developers: Use Sections 3-4 (Feature Specs & Technical Specs) as implementation guide
2. For Designers: Use Section 5 (Design & UX) + Visual mockups for UI/UX work
3. For Product: Use Section 1-2 (Overview & User Journey) for stakeholder alignment
4. For QA: Use Section 10 (Acceptance Criteria) to create test cases
5. GitHub Documentation: Convert this PRD to `/docs/PRD.md` in your repository
