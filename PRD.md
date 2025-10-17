# Galeria BethAzevedo - Art Exhibition Management System

A sophisticated digital platform for managing the complete lifecycle of artworks, artists, and exhibitions with curatorial precision and artistic sensibility.

**Experience Qualities**:
1. **Elegant** - The interface should feel refined and gallery-like, mirroring the sophistication of fine art spaces with clean layouts and generous whitespace
2. **Purposeful** - Every element serves the curator's workflow, from artwork registration to exhibition planning, with no unnecessary complexity
3. **Trustworthy** - Conveys professionalism and reliability befitting an institution managing valuable artworks and their documentation

**Complexity Level**: Light Application (multiple features with basic state)
The system manages interconnected entities (artists, artworks, exhibitions, evaluations) with CRUD operations and relationship management, but maintains focused scope on curatorial workflow rather than expanding into complex features like public portals or e-commerce.

## Essential Features

### Artist Registry
- **Functionality**: Complete CRUD for artist profiles including biography, nationality, style, and photography
- **Purpose**: Centralizes artist information as the foundation for artwork attribution and exhibition planning
- **Trigger**: Curator clicks "Add Artist" from Artists view
- **Progression**: View Artists List → Click Add Artist → Fill Form (name, bio, nationality, style, photo upload) → Save → View Artist Profile
- **Success criteria**: Artist profile displays with all metadata and can be linked to artworks; search and filter work accurately

### Artwork Catalog
- **Functionality**: Register artworks with comprehensive technical details (title, year, technique, dimensions, status) and high-quality images
- **Purpose**: Creates digital inventory with complete provenance and technical specifications for curatorial decisions
- **Trigger**: Curator selects "Add Artwork" from Artworks view or from Artist profile
- **Progression**: View Artworks Grid → Click Add Artwork → Select Artist → Enter Details → Upload Image → Preview → Save → View Artwork Card
- **Success criteria**: Artwork displays with complete technical sheet; filtering by artist, year, technique, and status functions correctly; images render properly

### Exhibition Management
- **Functionality**: Create exhibitions by selecting artworks, setting dates/location, and generating participant lists
- **Purpose**: Organizes curatorial vision into structured exhibitions with automatic artist/artwork association
- **Trigger**: Curator navigates to Exhibitions and clicks "Create Exhibition"
- **Progression**: View Exhibitions → Click New Exhibition → Enter Details (name, location, dates, description) → Select Artworks from Gallery → Review Artist List → Save → View Exhibition Page
- **Success criteria**: Exhibition page shows all selected artworks with artist attribution; date validation prevents invalid ranges; exhibitions can be filtered by status (planned/active/completed)

### Artwork Evaluation & Ranking
- **Functionality**: Score artworks on 1-10 scale within exhibition context and generate automatic rankings
- **Purpose**: Provides objective assessment framework for curatorial decisions and documentation
- **Trigger**: Curator opens an exhibition and selects "Evaluate Artworks"
- **Progression**: Select Exhibition → View Evaluation Grid → Rate Each Artwork (1-10) → Add Optional Notes → Save → Generate Ranking → View/Export Results
- **Success criteria**: Rankings calculate correctly by average score; rankings can be filtered by exhibition; export to viewable format works; evaluation history is preserved

### Dashboard Overview
- **Functionality**: At-a-glance metrics showing total artists, artworks, active exhibitions, and recent activity
- **Purpose**: Provides quick orientation and access to key areas of the system
- **Trigger**: User logs in or clicks home/logo
- **Progression**: Login → View Dashboard → See Metrics Cards → Browse Recent Items → Click Card to Navigate to Section
- **Success criteria**: Metrics update in real-time; quick links navigate correctly; recent items show accurate data

## Edge Case Handling

- **Orphaned Artworks**: Prevent deletion of artists who have associated artworks - show warning with artwork count
- **Exhibition Date Conflicts**: Validate end date is after start date; warn if artwork is already in active exhibition
- **Missing Images**: Display placeholder image with distinctive gallery icon if artwork image fails to load
- **Duplicate Entries**: Show warning if artist/artwork name closely matches existing entry
- **Empty States**: Show elegant empty gallery view with clear call-to-action for adding first item
- **Invalid Ratings**: Constrain evaluation input to 1-10 range; show validation message for out-of-range values

## Design Direction

The design should evoke the refined atmosphere of a contemporary art gallery - minimalist yet warm, with generous whitespace that lets content breathe. It should feel professional and institutional while maintaining approachability. The interface should be minimal to keep focus on the artwork imagery and curatorial content, using subtle animations and transitions that feel curated rather than playful.

## Color Selection

Custom palette - A sophisticated scheme inspired by gallery spaces with warm neutrals and rich accent colors.

- **Primary Color**: Deep charcoal (`oklch(0.25 0.01 270)`) - Represents professionalism and authority, anchoring the interface like gallery walls
- **Secondary Colors**: Warm cream (`oklch(0.96 0.008 85)`) for backgrounds and soft taupe (`oklch(0.65 0.02 60)`) for secondary elements, creating gallery-like warmth
- **Accent Color**: Rich terracotta (`oklch(0.58 0.15 35)`) - Draws attention to key actions and highlights, evoking art world sophistication
- **Foreground/Background Pairings**:
  - Background (Warm Cream `oklch(0.96 0.008 85)`): Deep charcoal text (`oklch(0.25 0.01 270)`) - Ratio 12.1:1 ✓
  - Card (White `oklch(0.99 0 0)`): Deep charcoal text (`oklch(0.25 0.01 270)`) - Ratio 14.8:1 ✓
  - Primary (Deep Charcoal `oklch(0.25 0.01 270)`): Warm cream text (`oklch(0.96 0.008 85)`) - Ratio 12.1:1 ✓
  - Secondary (Soft Taupe `oklch(0.65 0.02 60)`): Deep charcoal text (`oklch(0.25 0.01 270)`) - Ratio 5.2:1 ✓
  - Accent (Terracotta `oklch(0.58 0.15 35)`): White text (`oklch(0.99 0 0)`) - Ratio 5.1:1 ✓
  - Muted (Light Taupe `oklch(0.88 0.01 60)`): Taupe text (`oklch(0.45 0.02 60)`) - Ratio 6.8:1 ✓

## Font Selection

Typography should convey artistic refinement while maintaining clarity - selecting typefaces that feel both contemporary and timeless, appropriate for an institution managing fine art.

- **Typographic Hierarchy**:
  - H1 (Page Titles): Playfair Display Bold/32px/tight tracking - Elegant serif for gallery-quality presence
  - H2 (Section Headers): Inter SemiBold/24px/normal tracking - Clean contrast with primary heading
  - H3 (Card Titles): Inter Medium/18px/normal tracking - Subtle hierarchy for content organization
  - Body (Descriptions): Inter Regular/15px/relaxed leading (1.6) - Optimized for comfortable reading
  - Caption (Metadata): Inter Regular/13px/loose tracking - Technical details and timestamps
  - Labels (Forms): Inter Medium/14px/normal tracking - Clear input identification

## Animations

Animations should feel deliberately curated - smooth, sophisticated transitions that guide attention without calling attention to themselves, mirroring the contemplative pace of a gallery visit.

- **Purposeful Meaning**: Motion conveys thoughtful curation - cards expand gracefully, images fade in with refinement, transitions between sections feel intentional like walking between gallery rooms
- **Hierarchy of Movement**: 
  - Primary: Artwork images get subtle scale-on-hover (1.02x) to invite closer inspection
  - Secondary: Cards and buttons use gentle elevation changes to indicate interactivity
  - Tertiary: List items and metadata fade in sequentially for polished reveals

## Component Selection

- **Components**: 
  - Card (artwork thumbnails, artist profiles, metric displays) - Subtle shadows with generous padding
  - Dialog (add/edit forms) - Modal overlays for focused data entry without losing context
  - Tabs (switching between Artists/Artworks/Exhibitions/Evaluations) - Clean navigation structure
  - Select/Input/Textarea (form fields) - Refined styling with subtle borders
  - Button (primary actions use accent color, secondary use muted tones) - Clear visual hierarchy
  - Badge (status indicators, category tags) - Soft rounded pills for metadata
  - Separator (visual breaks between sections) - Minimal lines maintaining gallery-like space
  - Table (evaluation grids, rankings) - Clean typography-driven layout
  - Toast (Sonner notifications) - Elegant confirmation messages

- **Customizations**: 
  - Artwork image cards with aspect-ratio containers and overlay metadata on hover
  - Rating input component (1-10 scale) with visual feedback
  - Exhibition date range picker with validation
  - Dashboard metric cards with icons and count animations

- **States**:
  - Buttons: Default (solid accent), Hover (slight darken + lift), Active (pressed depth), Disabled (muted with reduced opacity)
  - Inputs: Default (subtle border), Focus (accent ring), Error (destructive color), Filled (slightly darker background)
  - Cards: Default (subtle shadow), Hover (elevated shadow + border accent), Selected (accent border)

- **Icon Selection**: Phosphor icons throughout - Palette for artworks, User for artists, CalendarDots for exhibitions, Star for ratings, ChartBar for rankings, Plus for add actions, Pencil for edit, Trash for delete, Eye for view details

- **Spacing**: Consistent use of Tailwind spacing scale - cards with p-6, sections with gap-6, grids with gap-4, form fields with gap-4, page padding px-6 md:px-12

- **Mobile**: Mobile-first with stacked layouts - navigation becomes bottom tab bar, grids become single column, tables convert to stacked cards, dialogs become full-screen sheets, artwork images remain prominent and tappable
