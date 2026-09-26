# Digital Life Archive — Personal Biography & Living Memoir

A premium, production-ready Digital Life Archive and interactive autobiography web application built with **Python 3**, **Flask**, **Jinja2**, **SQLAlchemy**, and clean vanilla frontend architecture.

Designed like an interactive digital book of one person's life—documenting origins, childhood, family lineage, education, sensory memories, pivotal trials, career craft, personal growth, and long-term future horizons.

---

## 1. Project Architecture & Directory Layout

```
digital-life-archive/
│
├── app.py                      # Core Flask WSGI application & route controllers
├── config.py                   # Environment-driven configuration (SQLite/PostgreSQL)
├── seed_data.py                # Initial database seeder with clearly marked demo placeholders
├── requirements.txt            # Python production dependencies
├── Procfile                    # Production process definition (gunicorn app:app)
├── .env.example                # Template for environment variables
├── README.md                   # Complete architectural and deployment manual
│
├── instance/
│   └── database.db             # Local SQLite database (auto-created on first run)
│
├── models/
│   ├── __init__.py             # Model exports
│   └── models.py               # SQLAlchemy models (Profile, Family, Timeline, etc.)
│
├── templates/
│   ├── base.html               # Master layout with 3-zone header, mobile drawer, colophon
│   ├── index.html              # Cinematic frontispiece hero & horizon milestones
│   ├── story.html              # Long-form 10-chapter autobiographical monograph
│   ├── childhood.html          # Village origins, formative lessons, early interests
│   ├── family.html             # Living lineage archive & family member profiles
│   ├── education.html          # Academic progression (Primary → Specialization)
│   ├── timeline.html           # Interactive hybrid timeline with category filters
│   ├── gallery.html            # Photographic plate archive with modal lightbox
│   ├── memories.html           # Evocative memoir vignettes with pull quotes
│   ├── achievements.html       # Academic, competition, and professional milestones
│   ├── professional.html       # Vocational craft, systems architecture, skills
│   ├── growth.html             # Philosophical reflections (Who I Was / Am / Going)
│   ├── future.html             # Horizon goals across career, philanthropy, and family
│   ├── contact.html            # Transmission portal & guestbook saving to database
│   ├── 404.html                # Custom archival missing-folio error page
│   └── 500.html                # Custom server interruption error page
│
└── static/
    ├── css/
    │   └── style.css           # Curatorial design system (archival warm paper, zero-pill)
    ├── js/
    │   └── main.js             # Pure vanilla JS (lightbox, theme toggle, ambient audio)
    ├── images/                 # Archival photographic plates
    └── uploads/                # Directory for client photograph uploads
```

---

## 2. Technology Stack

### Backend
- **Python 3.10+**
- **Flask 3.x**: Lightweight, un-opinionated WSGI micro-framework
- **Jinja2**: Server-side template rendering with modular layouts
- **SQLAlchemy 2.x & Flask-SQLAlchemy**: Object-relational mapping supporting both SQLite and PostgreSQL
- **python-dotenv**: Multi-environment variable management
- **Gunicorn**: Production WSGI HTTP server

### Frontend
- **HTML5**: Accessible, semantic typography with WCAG AA compliance
- **CSS3**: Custom archival design tokens (`Playfair Display`, `Lora`, `Plus Jakarta Sans`, `JetBrains Mono`)
- **Vanilla JavaScript**: Zero heavy framework dependencies, native Web Audio ambient generator, modal lightbox with keyboard controls

---

## 3. Database Models

The database schema is structured around 11 core models:

| Model | Purpose | Key Attributes |
|---|---|---|
| `Profile` | Core identity & biography | `full_name`, `birth_place`, `current_chapter`, `hero_quote`, `short_bio` |
| `FamilyMember` | Lineage & family records | `name`, `relationship`, `short_bio`, `important_memories`, `photo_url` |
| `Education` | Academic credentials | `stage_name`, `institution`, `years`, `field_of_study`, `experience` |
| `TimelineEvent` | Chronological life events | `year_date`, `title`, `category`, `description`, `location`, `is_featured` |
| `Memory` | Sensory memoirs | `title`, `date_str`, `location`, `story`, `quote`, `photo_url` |
| `Achievement` | Verified honors & awards | `title`, `year`, `category`, `issuer`, `description`, `image_url` |
| `ProfessionalExperience` | Career trajectory | `role`, `organization`, `years`, `narrative_description`, `key_learnings` |
| `Skill` | Acquired disciplines | `name`, `category`, `proficiency_note`, `reflection` |
| `GalleryImage` | Archival photographic plates | `title`, `caption`, `category`, `image_url`, `year` |
| `FutureGoal` | Horizon aspirations | `title`, `category`, `target_timeline`, `description`, `why_it_matters` |
| `ContactMessage` | Visitor transmissions | `sender_name`, `sender_email`, `subject`, `message`, `created_at` |

---

## 4. Local Development Instructions

### Step 1: Clone the repository
```bash
git clone <repository_url>
cd digital-life-archive
```

### Step 2: Create and activate a virtual environment
```bash
# On Linux / macOS:
python3 -m venv venv
source venv/bin/activate

# On Windows:
python -m venv venv
venv\Scripts\activate
```

### Step 3: Install dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Configure environment variables
```bash
cp .env.example .env
```
Edit `.env` to configure your `SECRET_KEY` and optional `DATABASE_URL`.

### Step 5: Run the application locally
```bash
python app.py
```
Open your browser and navigate to:
```
http://localhost:5001
```
The database will automatically initialize `instance/database.db` and seed the initial placeholder records.

---

## 5. Production Deployment Instructions

### Running with Gunicorn (Local or VPS)
```bash
gunicorn app:app --workers 4 --bind 0.0.0.0:5000
```

### Deployment to Render / Heroku / Railway
1. Push the repository to GitHub.
2. In your hosting platform:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
   - Set environment variables:
     - `SECRET_KEY`: A secure random 64-character secret
     - `DATABASE_URL`: Your PostgreSQL connection string (e.g. `postgresql://user:pass@host:5432/dbname`)
3. The application will automatically detect PostgreSQL via `config.py` and run migrations upon startup.

---

## 6. How to Replace Placeholder Content with Real Facts

All demo entries are clearly flagged with square brackets, for example:
- `[REAL FULL NAME]`
- `[HOMETOWN / ANCESTRAL VILLAGE]`
- `[CHILDHOOD STORY]`
- `[REAL EDUCATION DETAILS]`
- `[REAL FAMILY INFORMATION]`

### Method 1: Modify `seed_data.py`
Before initial deployment, open `seed_data.py` and edit the values directly. Delete `instance/database.db` and run `python app.py` to re-seed.

### Method 2: Future Admin Panel Integration
The architecture is prepared for a `/admin` blueprint. Because all content is stored in SQLAlchemy models rather than hard-coded templates, you can easily mount Flask-Admin or custom CRUD routes to update records live.

---

## 7. Health & Deployment Verification

To test that your deployed instance is operational, ping the health endpoint:
```bash
curl https://your-domain.com/health
```

Expected JSON response:
```json
{
  "status": "ok",
  "app": "Digital Life Archive",
  "database": "connected",
  "data": {
    "profiles": 1,
    "timeline_events": 8,
    "engine": "sqlite"
  },
  "timestamp": "2026-09-26T22:30:00Z"
}
```

---

## 8. License & Custodianship
Preserved under the Personal Digital Heritage Trust. Designed for multi-generational longevity.
