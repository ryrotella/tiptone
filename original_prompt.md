# Tiptone - A Universal Tip Color System

## Project Overview

Build a community-driven website that catalogs "tip colors" (the color at the center of the upper lip) with user submissions and a communal archive. Inspired by Pantone's color system, Tiptone aims to create a standardized, universal language for skin tip colors.

---

## Core Concept

**What is Tiptone?**
Tiptone is a community-driven, open-source organization providing a universal tip color language. The Tiptone Matching System (TMS) is a standardized database of tip colors for design, printing, fashion, and manufacturing, ensuring consistent color reproduction across different materials and devices.

**Key Characteristics:**
- Community and user-driven
- Ongoing and ever-growing project
- Open source
- Anyone can contribute
- Strength increases with more user data

**How are Tiptones Determined?**
Tiptones are determined by analyzing the color of the upper lip center. A custom-trained machine learning model extracts the tip color from uploaded face images.

---

## Technical Requirements

### 1. User Submission Flow ("Add a Tiptone")

**Step-by-step process:**
1. User clicks "Add a Tiptone" button
2. Upload image of a face
3. Display example of correct pixel selection area
4. ML model auto-detects and selects pixel on upper lip center
5. User can manually adjust/edit the pixel selection
6. User names the Tiptone with validation:
   - Character limit enforcement
   - Auto-filter profanity/bad words
   - No numbers or symbols allowed
   - Must be real words only
   - CAPTCHA verification
7. Submit and add to database

### 2. Homepage Features

**Layout sections (in order):**
- Hero/Header with "Add a Tiptone" button
- "What is Tiptone?" information section
- "How are Tiptones determined?" (science explanation)
- "Who created Tiptone?"
- Featured Tiptones of the Month
- Trending Tiptones (sorted by view count)
- Search functionality
- "Random Tiptone" button
- Infinite scroll feed of all Tiptones

### 3. Individual Tiptone Page

**Display format:** Concise, printable card layout

**Information shown:**
- Tiptone Name (large, prominent)
- Tiptone Color (visual swatch)
- Date Added

**Color Conversions (exclude Pantone):**
- Hex Code
- RGB
- HSL / HSV / HSB
- CMYK

### 4. TIPTONE COLOR SYSTEM

- Character limit: 25 
- No bad words
- No symbols or numbers
- Must be real words (not: “dhbfahsbhd”)
- Will be All Caps

- Naming Recommendation
- (Adjective) (Noun) or just (Noun)
- ex. “Hard Ryan”

- Numbering System -> (2 digits) - (four digits)
- Catalog numbers just count up
- The first number is (01-0001)
- Once it reaches 01-9999 it goes to 02-0001

- i.e.: Hard Ryan 01-0002 (spoken as “Hard Ryan one two")

---

## Design Guidelines

### Visual Style
- **Aesthetic:** Early internet, minimal HTML style
- **Color palette:** Simple, light grey-ish tones
- **Typography:** Tahoma font throughout
- **Tone:** Simple, official, industry-standard, reference, authoritative
- **Target audience:** Professional designers, engineers, scientists

### Design References
- Wikipedia.org (layout simplicity)
- Craigslist (minimal styling)
- Old Roblox (circa 2005) - see attached image
- Pantone-colours.com (structure reference): https://www.pantone-colours.com/

---

## Technical Stack Suggestions
- Frontend: Simple HTML/CSS with minimal JavaScript
- ML Model: For upper lip color detection
- Database: For storing Tiptone entries; Supabase
- Image processing: For pixel selection and color extraction
- Form validation: For name filtering and CAPTCHA

---

## Questions/Clarifications Needed
- Specific ML model requirements or existing model to integrate?
- Image upload size/format restrictions? 
- How to make consistent, same quality grid for each image?
- Preferred hosting/deployment platform? Vercel? DigitalOcean?
- User accounts needed or anonymous submissions?
- Moderation system for submitted Tiptones?
- Rating system?