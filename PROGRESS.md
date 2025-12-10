# TipTone Development Progress

## Session: December 10, 2024

### What Was Built

#### Project Setup
- Initialized Next.js 16 project with TypeScript and Tailwind CSS
- Configured Supabase as the database backend
- Created database schema with proper indexes and RLS policies
- Set up environment variables and configuration

#### Core Features Implemented

**1. Homepage (`/`)**
- Hero section with "Add a Tiptone" CTA
- Information panels: What is Tiptone?, How are Tiptones Determined?, Who Created Tiptone?
- Featured Tiptones of the Month section
- Trending Tiptones section (sorted by view count)
- Search functionality
- Random Tiptone button
- Infinite scroll feed of all Tiptones

**2. Add Tiptone Page (`/add`)**
- 4-step wizard: Upload → Detect Color → Name → Submit
- Image upload with file validation (type and size)
- Manual color picker with click/drag on uploaded image
- Color extraction from selected pixel (averaged over small area)
- Real-time color preview with hex display
- Name validation:
  - 25 character limit
  - No numbers or symbols
  - Profanity filter (using `bad-words` package)
  - Must be real words (basic validation)
- Confirmation step showing all color formats
- Success state with link to view created Tiptone

**3. Tiptone Detail Page (`/tiptone/[id]`)**
- Large color swatch display
- Tiptone name and catalog number
- "Spoken" format display (e.g., "HARD RYAN one two")
- All color format conversions:
  - Hex
  - RGB
  - HSL
  - HSV/HSB
  - CMYK
- Date added and view count
- Featured badge for featured Tiptones
- Print button for printable card format
- Print-optimized CSS

**4. API Routes**
- `POST /api/submit` - Create new Tiptone with validation
- `GET /api/tiptones` - Fetch Tiptones with pagination, search, and filtering
- `GET /api/random` - Get random Tiptone ID

**5. Database (Supabase)**
- `tiptones` table with all color values and metadata
- Auto-incrementing catalog numbers (01-0001 → 99-9999)
- View count tracking via RPC function
- Row Level Security policies for public read/write
- Sample data for testing

#### Design System
- Early-internet aesthetic with Tahoma font
- Light grey color palette (#f0f0f0 background)
- 3D beveled buttons (outset borders)
- Inset input fields
- Panel-based layout with headers
- Inspired by Wikipedia, Craigslist, early Roblox (2005)

#### Technical Components
- `TiptoneCard` - Reusable card component (compact and full variants)
- `TiptoneFeed` - Infinite scroll with deduplication
- `FaceDetector` - Image upload and color selection
- `SearchBox` - Search input with URL params
- `RandomButton` - Fetches and navigates to random Tiptone
- `Header` / `Footer` - Site navigation
- `PrintButton` - Client-side print trigger

#### Utilities
- `colors.ts` - Color conversion functions (RGB↔Hex, HSL, HSV, CMYK)
- `validation.ts` - Name validation with profanity filter
- `supabase.ts` - Database client with lazy initialization

---

### Bugs Fixed
- Fixed `bad-words` import (named export instead of default)
- Fixed Supabase client initialization for build-time
- Added Suspense boundary for `useSearchParams` in feed
- Fixed SQL schema order (pg_trgm extension before index)
- Created `.env.local` from example file
- Fixed duplicate key error in infinite scroll (race condition)

---

### Files Created

```
src/
├── app/
│   ├── globals.css          # Early-internet styling
│   ├── layout.tsx           # Root layout with metadata
│   ├── page.tsx             # Homepage
│   ├── add/page.tsx         # Add Tiptone wizard
│   ├── tiptone/[id]/page.tsx # Detail page
│   └── api/
│       ├── submit/route.ts  # Create Tiptone
│       ├── tiptones/route.ts # List/search Tiptones
│       └── random/route.ts  # Random Tiptone
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── TiptoneCard.tsx
│   ├── TiptoneFeed.tsx
│   ├── FaceDetector.tsx
│   ├── SearchBox.tsx
│   ├── RandomButton.tsx
│   └── PrintButton.tsx
├── lib/
│   ├── supabase.ts
│   ├── colors.ts
│   └── validation.ts
└── types/
    └── tiptone.ts

Root files:
├── .env.local               # Supabase credentials
├── .env.local.example       # Template for env vars
├── supabase-schema.sql      # Database setup script
├── README.md                # Project documentation
└── PROGRESS.md              # This file
```

---

## Next Steps

### 1. Webcam Capture Integration
**Priority: High**

Add ability to capture photo directly from webcam instead of only file upload.

**Implementation:**
- Add "Use Webcam" button alongside file upload
- Use `navigator.mediaDevices.getUserMedia()` for webcam access
- Show live video preview with capture button
- Convert captured frame to image for processing
- Handle permissions and fallbacks gracefully

```tsx
// Pseudocode for webcam component
const stream = await navigator.mediaDevices.getUserMedia({ video: true });
videoRef.current.srcObject = stream;
// On capture: draw video frame to canvas, extract as image
```

### 2. MediaPipe Face Mesh Integration
**Priority: High**

Replace manual initial detection with actual ML-based face landmark detection.

**Implementation:**
- Install MediaPipe Face Mesh: `@mediapipe/face_mesh` or use TensorFlow.js version
- Detect face landmarks in uploaded/captured image
- Identify upper lip center landmark (index 13 or nearby points)
- Auto-position the selection point at detected lip location
- Keep manual adjustment as override option

**Key landmarks for upper lip:**
- Index 0: Philtrum (center dip)
- Index 13: Upper lip center
- Indices 82, 87, 13, 14, 312, 317: Upper lip outline

```tsx
// Pseudocode
import { FaceMesh } from '@mediapipe/face_mesh';

const faceMesh = new FaceMesh({...});
const results = await faceMesh.send({ image: imageElement });
const upperLipCenter = results.multiFaceLandmarks[0][13];
setDetectedPoint({
  x: upperLipCenter.x * imageWidth,
  y: upperLipCenter.y * imageHeight
});
```

### 3. Improved Face Detection UX
**Priority: Medium**

- Show face mesh overlay on detected face
- Highlight the detected lip region
- Add confidence indicator
- Show "No face detected" error with retry option
- Support multiple faces with selection

### 4. Additional Features (Future)

**Moderation System**
- Admin dashboard for reviewing submissions
- Flag/report inappropriate Tiptones
- Approval queue for new submissions

**User Accounts (Optional)**
- Track user contributions
- "My Tiptones" page
- Edit/delete own submissions

**Social Features**
- Share Tiptone cards to social media
- Embed codes for websites
- QR codes on printed cards

**Advanced Search**
- Search by color (find similar colors)
- Filter by date range
- Sort options (newest, most viewed, alphabetical)

**Analytics**
- Popular Tiptones dashboard
- Submission trends over time
- Color distribution visualization

---

## Technical Debt / Improvements

- [ ] Add comprehensive error handling throughout
- [ ] Add loading skeletons instead of "Loading..." text
- [ ] Implement proper image optimization/compression
- [ ] Add rate limiting to API routes
- [ ] Add input sanitization beyond profanity filter
- [ ] Consider adding CAPTCHA for submissions (as per original spec)
- [ ] Add unit tests for color conversion utilities
- [ ] Add E2E tests for submission flow
- [ ] Optimize infinite scroll performance for large datasets
- [ ] Add proper SEO meta tags for individual Tiptone pages

---

## Deployment Checklist

- [ ] Set environment variables in Vercel/hosting platform
- [ ] Run database migrations in production Supabase
- [ ] Test all features in production environment
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Configure custom domain
- [ ] Set up analytics (optional)
