# TIPTONE - Universal Tip Color System

A community-driven website that catalogs "tip colors" (the color at the center of the upper lip) with user submissions and a communal archive. Inspired by Pantone's color system, Tiptone aims to create a standardized, universal language for skin tip colors.

## Features

- **Image Upload & Detection**: Upload face photos and automatically detect the upper lip center color
- **Manual Adjustment**: Fine-tune the color selection point for accuracy
- **Color Conversions**: Automatic conversion to Hex, RGB, HSL, HSV, and CMYK
- **Naming System**: Unique catalog numbers (e.g., "HARD RYAN 01-0002")
- **Search & Browse**: Find Tiptones by name or browse the infinite scroll feed
- **Random Discovery**: Explore random Tiptones from the database
- **Printable Cards**: Each Tiptone has a printable card format

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Database**: Supabase (PostgreSQL)
- **Styling**: Custom CSS with early-internet aesthetic (Tahoma font)
- **ML**: Client-side face detection (user-adjustable)

## Getting Started

### 1. Clone & Install

```bash
git clone <repo-url>
cd tiptone
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Settings > API** and copy your Project URL and anon key
3. Create `.env.local` from the example:

```bash
cp .env.local.example .env.local
```

4. Add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Set Up Database

1. Go to your Supabase project's **SQL Editor**
2. Copy the contents of `supabase-schema.sql` and run it
3. This creates the `tiptones` table with sample data

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Homepage
│   ├── add/page.tsx      # Add Tiptone form
│   ├── tiptone/[id]/     # Individual Tiptone page
│   └── api/              # API routes
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── TiptoneCard.tsx
│   ├── TiptoneFeed.tsx
│   ├── FaceDetector.tsx
│   └── ...
├── lib/
│   ├── supabase.ts       # Database client
│   ├── colors.ts         # Color conversion utilities
│   └── validation.ts     # Name validation
└── types/
    └── tiptone.ts        # TypeScript interfaces
```

## Tiptone Naming System

- **Format**: (Adjective) (Noun) or just (Noun) - e.g., "HARD RYAN", "SOFT EMMA"
- **Display**: Always uppercase
- **Catalog Number**: XX-XXXX format (e.g., 01-0001 to 99-9999)
- **Spoken**: "Hard Ryan one two" for "HARD RYAN 01-0002"

### Naming Rules

- Maximum 25 characters
- Letters and spaces only (no numbers or symbols)
- No profanity
- Must be real words (basic validation)

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Add environment variables
4. Deploy

### Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key |

## Design Philosophy

The design follows an early-internet aesthetic:

- Tahoma font throughout
- Light grey color palette (#f0f0f0 background)
- 3D beveled buttons and inset inputs
- Simple panel-based layout
- Minimal, functional, authoritative

Inspired by Wikipedia, Craigslist, and early Roblox (circa 2005).

## Contributing

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

All contributions welcome!

## License

Open source. Community-driven. For everyone.
