"""
Seed data script for Digital Life Archive.
All data uses clearly marked placeholders:
[REAL FULL NAME], [CHILDHOOD STORY], [REAL EDUCATION DETAILS],
[REAL FAMILY INFORMATION], [REAL ACHIEVEMENT], etc.
"""

from models.models import (
    db, Profile, FamilyMember, Education, TimelineEvent,
    Memory, Achievement, ProfessionalExperience, Skill,
    GalleryImage, FutureGoal
)

def seed_database():
    # Only seed if Profile doesn't exist
    if Profile.query.first():
        return

    # 1. Profile
    profile = Profile(
        full_name="[REAL FULL NAME]",
        preferred_name="[FIRST NAME]",
        tagline="A personal chronicle of origins, intellectual wanderings, enduring lineage, and the quiet pursuit of craft.",
        current_age="[CURRENT AGE / e.g. 29 Years]",
        current_chapter="Chapter V: Construction, Synthesis & Creative Legacy",
        birth_place="[HOMETOWN / ANCESTRAL VILLAGE]",
        current_residence="[CURRENT RESIDENCE / CITY]",
        hero_quote="“We do not preserve the past to remain inside it; we write it down so our children can see the ground upon which they stand.”",
        short_bio=(
            "Welcome to this living archive. This is neither a corporate resume nor a promotional facade; "
            "it is an authentic documentary record of one human journey—from quiet village origins through "
            "rigorous formal schooling, trials of character, professional pursuits, and evolving future visions. "
            "Every section represents an open chapter in an ongoing book."
        ),
        editorial_story_intro=(
            "Every life begins with an environment we did not choose and voices that spoke to us before we could reply. "
            "This volume gathers the threads: childhood recollections, family roots, education milestones, moments of doubt, "
            "and the persistent work of becoming."
        ),
        profile_photo="/static/images/hero_portrait.jpg",
        email="archive.custodian@example.com",
        social_github="https://github.com",
        social_linkedin="https://linkedin.com",
        social_twitter="https://twitter.com"
    )
    db.session.add(profile)

    # 2. Family Members
    family_members = [
        FamilyMember(
            name="[FATHER'S NAME]",
            relationship="Father",
            short_bio="[REAL FAMILY INFORMATION: A pillar of quiet discipline and practical wisdom. Taught the fundamentals of integrity, early morning labor, and patience with difficult problems.]",
            important_memories="[MEMORIES: Walking through the harvest fields at sunset, discussing how patience turns seeds into sustenance, and the habit of repairing things with one's own hands.]",
            photo_url="/static/images/hero_portrait.jpg",
            display_order=1
        ),
        FamilyMember(
            name="[MOTHER'S NAME]",
            relationship="Mother",
            short_bio="[REAL FAMILY INFORMATION: The emotional cornerstone and intellectual encourager of the household. A guardian of stories, warm hospitality, and unconditional moral grounding.]",
            important_memories="[MEMORIES: Sitting beside her in the kitchen listening to folk tales and proverbs, while she gently checked school notebooks under the warm glow of the lantern.]",
            photo_url="/static/images/village_home.jpg",
            display_order=2
        ),
        FamilyMember(
            name="[GRANDPARENT'S NAME]",
            relationship="Grandmother / Lineage Elder",
            short_bio="[REAL FAMILY INFORMATION: Keeper of family oral histories and village heritage. Her memory spanned generations, linking our contemporary world to historic cultural roots.]",
            important_memories="[MEMORIES: The evening courtyard gatherings where historical migrations and ancestral parables were passed down with vivid grace.]",
            photo_url="/static/images/study_desk.jpg",
            display_order=3
        ),
        FamilyMember(
            name="[SIBLING'S NAME]",
            relationship="Elder Sibling / Companion",
            short_bio="[REAL FAMILY INFORMATION: Lifelong confidant, earliest competitor, and steadfast ally. Shared childhood adventures and mutual encouragement through every transitional crossroads.]",
            important_memories="[MEMORIES: Sharing late-night curiosity over mathematics problems, building makeshift toys in the yard, and dreaming together about distant universities.]",
            photo_url="/static/images/growth_landscape.jpg",
            display_order=4
        )
    ]
    for member in family_members:
        db.session.add(member)

    # 3. Education
    education_entries = [
        Education(
            stage_name="Primary Foundation",
            institution="[VILLAGE PRIMARY SCHOOL / ELEMENTARY]",
            years="[EARLY YEARS — e.g. 2002 — 2008]",
            location="[VILLAGE / HOMETOWN]",
            field_of_study="General Elementary Foundations, Languages & Arithmetic",
            experience="[REAL EDUCATION DETAILS: Wooden benches, chalkboard slates, and the earliest joy of discovering reading. The playground bordered open meadows, and curiosity was sparked through hands-on discovery.]",
            achievements="[ACHIEVEMENTS: First prize in district handwriting, school storytelling representative, class prefect.]",
            photo_url="/static/images/village_home.jpg",
            display_order=1
        ),
        Education(
            stage_name="Secondary & High School",
            institution="[REGIONAL SECONDARY ACADEMY / HIGH SCHOOL]",
            years="[FORMATIVE YEARS — e.g. 2008 — 2014]",
            location="[DISTRICT CAPITAL]",
            field_of_study="Natural Sciences, Mathematics & Literature",
            experience="[REAL EDUCATION DETAILS: A transformative expansion of worldview. Daily long commutes, intensive laboratory experiments, and discovering an enduring passion for structured analytical inquiry.]",
            achievements="[ACHIEVEMENTS: Science Olympiad medalist, editor of the student literary magazine, graduating with highest academic distinction.]",
            photo_url="/static/images/study_desk.jpg",
            display_order=2
        ),
        Education(
            stage_name="Undergraduate Degree",
            institution="[METROPOLITAN UNIVERSITY / COLLEGE]",
            years="[UNIVERSITY YEARS — e.g. 2014 — 2018]",
            location="[UNIVERSITY CITY]",
            field_of_study="[MAJOR / DEGREE — Computer Science / Engineering / Humanities]",
            experience="[REAL EDUCATION DETAILS: Deep intellectual immersion. Rigorous curriculum, late nights in the campus library, mentorship under revered scholars, and building the first complex systems.]",
            achievements="[ACHIEVEMENTS: Dean's Honor List, published undergraduate research paper, captain of the inter-collegiate debate delegation.]",
            photo_url="/static/images/study_desk.jpg",
            display_order=3
        ),
        Education(
            stage_name="Advanced & Professional Mastery",
            institution="[GRADUATE INSTITUTE / SPECIALIZED ACADEMY]",
            years="[ADVANCED YEARS — e.g. 2019 — 2021]",
            location="[INSTITUTE CITY / ONLINE RESEARCH CONSORTIUM]",
            field_of_study="[SPECIALIZATION / GRADUATE DISCIPLINE]",
            experience="[REAL EDUCATION DETAILS: Self-directed research, executive methodologies, and bridging academic theory with high-impact real-world execution.]",
            achievements="[ACHIEVEMENTS: Master's thesis with distinction, cross-disciplinary innovation fellowship.]",
            photo_url="/static/images/growth_landscape.jpg",
            display_order=4
        )
    ]
    for edu in education_entries:
        db.session.add(edu)

    # 4. Timeline Events
    timeline_events = [
        TimelineEvent(
            year_date="1998",
            title="[GENESIS: Birth in the Ancestral Village]",
            category="Childhood",
            description="[REAL LIFE EVENT: Born in a tranquil village surrounded by orchards and river streams. Earliest impressions formed by nature, familial warmth, and community traditions.]",
            location="[ANCESTRAL VILLAGE]",
            photo_url="/static/images/village_home.jpg",
            is_featured=True,
            display_order=1
        ),
        TimelineEvent(
            year_date="2005",
            title="[THE FIRST WRITTEN BOOK: Early Curiosity Awakens]",
            category="Education",
            description="[REAL LIFE EVENT: Borrowed first classic encyclopedias and literature volumes from a small local library. Began keeping personal notebooks of sketches and observations.]",
            location="[HOMETOWN LIBRARY]",
            photo_url="/static/images/study_desk.jpg",
            is_featured=False,
            display_order=2
        ),
        TimelineEvent(
            year_date="2011",
            title="[FAMILY RELOCATION: Embracing New Horizons]",
            category="Family",
            description="[REAL LIFE EVENT: Moving from rural familiarity to the buzzing district town. Adapting to modern urban tempo, meeting diverse peers, and strengthening family unity.]",
            location="[DISTRICT CAPITAL]",
            photo_url="/static/images/village_home.jpg",
            is_featured=False,
            display_order=3
        ),
        TimelineEvent(
            year_date="2014",
            title="[THE CRITICAL CRUCIBLE: University Entrance & Independence]",
            category="Challenge",
            description="[REAL LIFE EVENT: Navigating competitive national examinations while living away from home for the first time. Overcoming self-doubt and forging emotional independence.]",
            location="[REGIONAL EXAMINATION CENTER]",
            photo_url="/static/images/growth_landscape.jpg",
            is_featured=True,
            display_order=4
        ),
        TimelineEvent(
            year_date="2018",
            title="[THE LAUNCH: University Graduation & First Professional Steps]",
            category="Achievement",
            description="[REAL LIFE EVENT: Graduated with honors surrounded by proud parents. Secured the first professional role and began applying knowledge to solve substantial operational challenges.]",
            location="[UNIVERSITY AUDITORIUM]",
            photo_url="/static/images/hero_portrait.jpg",
            is_featured=True,
            display_order=5
        ),
        TimelineEvent(
            year_date="2021",
            title="[LEADERSHIP & MATURITY: Directing Major Initiatives]",
            category="Career",
            description="[REAL LIFE EVENT: Promoted to oversee cross-functional initiatives. Mentored junior colleagues and learned the delicate balance of empathy, velocity, and architectural rigor.]",
            location="[TECH METROPOLIS]",
            photo_url="/static/images/study_desk.jpg",
            is_featured=False,
            display_order=6
        ),
        TimelineEvent(
            year_date="2024",
            title="[THE PIVOT: Deepening Philosophical & Creative Purpose]",
            category="Personal Growth",
            description="[REAL LIFE EVENT: Stepping back to evaluate long-term contribution. Commenced writing, community archiving, and designing durable systems built to endure.]",
            location="[MOUNTAIN RETREAT / STUDY]",
            photo_url="/static/images/growth_landscape.jpg",
            is_featured=True,
            display_order=7
        ),
        TimelineEvent(
            year_date="Present",
            title="[THE ONGOING EXPEDITION: Synthesis & Legacy]",
            category="Present",
            description="[REAL LIFE EVENT: Living intentionally at the intersection of technical craft, family stewardship, and continuous lifelong self-education.]",
            location="[CURRENT RESIDENCE]",
            photo_url="/static/images/hero_portrait.jpg",
            is_featured=True,
            display_order=8
        )
    ]
    for ev in timeline_events:
        db.session.add(ev)

    # 5. Memories
    memories = [
        Memory(
            title="[THE EVENING OIL LANTERN & THE ANCIENT DESK]",
            date_str="Autumn, Childhood Years",
            location="[FAMILY COURTYARD]",
            story=(
                "[CHILDHOOD MEMORY: Long before reliable electricity was a constant, my grandfather would illuminate "
                "a brass kerosene lantern on the veranda. The amber glow danced on the lime-washed walls. In that silence, "
                "the rustle of turning pages sounded like footsteps in a cathedral. I learned then that quiet focus is a sanctuary "
                "no one can take away from you.]"
            ),
            quote="“In the quietest room, the smallest idea carries the resonance of thunder.”",
            photo_url="/static/images/study_desk.jpg",
            display_order=1
        ),
        Memory(
            title="[THE MONSOON RIVER CROSSING]",
            date_str="Monsoon Season, Age 12",
            location="[VILLAGE RIVER CROSSING]",
            story=(
                "[CHILDHOOD MEMORY: The village river had swelled overnight, submerging the wooden footbridge. "
                "To reach the school examination, my father carried my satchel over his head while guiding me through "
                "the cold current. When we reached the opposite bank drenched and safe, he smiled and said: 'Water only tests "
                "if your feet are willing.' That morning, no test could have seemed intimidating.]"
            ),
            quote="“Courage is rarely an absence of fear; it is holding someone's hand through the rising current.”",
            photo_url="/static/images/village_home.jpg",
            display_order=2
        ),
        Memory(
            title="[NIGHT WATCH AT THE UNIVERSITY COMPUTING LAB]",
            date_str="Winter, Final Undergraduate Year",
            location="[CAMPUS SCIENCE BUILDING]",
            story=(
                "[MEMOIR REFLECTION: At 3:45 AM, the terminal screens cast blue reflections across empty rows of chairs. "
                "We had spent three weeks tracking a concurrency race condition in our distributed simulation engine. "
                "When the clean compile completed and the visualizer plotted the flawless trajectory, four exhausted students "
                "looked at each other in solemn, speechless awe. The world outside was asleep, but we had touched truth.]"
            ),
            quote="“Real craftsmanship reveals itself when everyone else has packed their bags and gone home.”",
            photo_url="/static/images/study_desk.jpg",
            display_order=3
        ),
        Memory(
            title="[DAWN AT THE ALPINE SUMMIT: RENEWAL OF PURPOSE]",
            date_str="Summer, Recent Pilgrimage",
            location="[HIGH PASS SANCTUARY]",
            story=(
                "[PERSONAL GROWTH MEMORY: After a strenuous seven-hour ascent in pitch darkness, breaking above the tree line "
                "just as the sun ignited the snow-capped crests. Looking down upon the sea of cloud, all trivial anxieties vanished. "
                "You realize how brief human life is, and that the only legacy worth leaving is kindness, clarity, and steadfast work.]"
            ),
            quote="“To see the valley clearly, you must first carry the weight to the peak.”",
            photo_url="/static/images/growth_landscape.jpg",
            display_order=4
        )
    ]
    for mem in memories:
        db.session.add(mem)

    # 6. Achievements
    achievements = [
        Achievement(
            title="[NATIONAL ACADEMIC MERIT SCHOLARSHIP]",
            year="2014",
            category="Academic",
            issuer="[MINISTRY OF HIGHER EDUCATION]",
            description="[REAL ACHIEVEMENT: Awarded to top 0.5% percentile in national pre-university examinations for analytical problem-solving and rigorous scientific aptitude.]",
            image_url="/static/images/study_desk.jpg",
            display_order=1
        ),
        Achievement(
            title="[VALEDICTORIAN DISTINCTION & DEAN'S MEDAL]",
            year="2018",
            category="Academic",
            issuer="[UNIVERSITY FACULTY COUNCIL]",
            description="[REAL ACHIEVEMENT: Recognized for highest cumulative grade point average across the graduating department alongside significant contributions to student peer tutoring.]",
            image_url="/static/images/hero_portrait.jpg",
            display_order=2
        ),
        Achievement(
            title="[REGIONAL HACKATHON GRAND PRIZE WINNER]",
            year="2019",
            category="Competition",
            issuer="[CIVIC TECHNOLOGY CONSORTIUM]",
            description="[REAL ACHIEVEMENT: Conceived and engineered an offline-first emergency resource coordination network within 48 continuous hours of collaborative design.]",
            image_url="/static/images/study_desk.jpg",
            display_order=3
        ),
        Achievement(
            title="[EXEMPLARY MENTORSHIP & LEADERSHIP AWARD]",
            year="2022",
            category="Professional",
            issuer="[INSTITUTIONAL PEER COMMITTEE]",
            description="[REAL ACHIEVEMENT: Commended for nurturing early-career researchers, publishing accessible internal documentation, and cultivating a culture of empathy and rigor.]",
            image_url="/static/images/growth_landscape.jpg",
            display_order=4
        ),
        Achievement(
            title="[SOLO ENDURANCE EXPEDITION COMPLETION]",
            year="2023",
            category="Milestone",
            issuer="[ALPINE TRAIL RECORD]",
            description="[REAL ACHIEVEMENT: Self-supported 250km trans-ridge trek completed over 12 days, testing physical stamina, solitude, and backcountry resilience.]",
            image_url="/static/images/growth_landscape.jpg",
            display_order=5
        ),
        Achievement(
            title="[COMMUNITY DIGITAL ARCHIVE INITIATIVE]",
            year="2024",
            category="Award",
            issuer="[HERITAGE PRESERVATION GUILD]",
            description="[REAL ACHIEVEMENT: Curated and digitized historical records of 45 village elders, ensuring oral histories are preserved in high-fidelity open formats.]",
            image_url="/static/images/village_home.jpg",
            display_order=6
        )
    ]
    for ach in achievements:
        db.session.add(ach)

    # 7. Professional Experience
    experiences = [
        ProfessionalExperience(
            role="[FOUNDATIONAL APPRENTICE / JUNIOR ENGINEER]",
            organization="[REGIONAL RESEARCH LAB / COMPANY A]",
            years="[2018 — 2020]",
            location="[CITY A]",
            narrative_description=(
                "[PROFESSIONAL JOURNEY: The apprenticeship years. Mastered core software engineering discipline, "
                "production monitoring, and team collaboration. Discovered the profound difference between code that "
                "merely functions and software that survives contact with unpredictable human reality.]"
            ),
            key_learnings="[LEARNINGS: Humility in code review, value of automated verification, and the art of listening before architecting.]",
            display_order=1
        ),
        ProfessionalExperience(
            role="[SENIOR SYSTEMS ARCHITECT & TECHNICAL LEAD]",
            organization="[HIGH-GROWTH TECHNOLOGY ENTERPRISE]",
            years="[2020 — 2023]",
            location="[METROPOLITAN HUB]",
            narrative_description=(
                "[PROFESSIONAL JOURNEY: Spearheaded resilient distributed systems, data processing pipelines, and API protocols. "
                "Led an eight-person cross-disciplinary team through complex migrations with zero downtime. "
                "Shifted focus from individual throughput to organizational leverage.]"
            ),
            key_learnings="[LEARNINGS: Architecture is not merely boxes and arrows; it is human communication crystallized in code.]",
            display_order=2
        ),
        ProfessionalExperience(
            role="[PRINCIPAL ADVISOR & INDEPENDENT FELLOW]",
            organization="[INDEPENDENT PRACTICE & DIGITAL COMMONS]",
            years="[2023 — Present]",
            location="[HYBRID / GLOBAL]",
            narrative_description=(
                "[PROFESSIONAL JOURNEY: Operating at the confluence of open digital architecture, archival memory systems, "
                "and private client advisory. Prioritizing longevity, clarity, and ethical human-centered computing over ephemeral trends.]"
            ),
            key_learnings="[LEARNINGS: Sustainable craft requires refusing unnecessary complexity.]",
            display_order=3
        )
    ]
    for exp in experiences:
        db.session.add(exp)

    # 8. Skills
    skills = [
        Skill(
            name="[SYSTEMS ARCHITECTURE & SOFTWARE DESIGN]",
            category="Technical & Systems",
            proficiency_note="Mastery / 8+ Years",
            reflection="Designing fault-tolerant, maintainable software systems with clean interfaces and clear documentation.",
            display_order=1
        ),
        Skill(
            name="[DATABASE MODELING & DATA INTEGRITY]",
            category="Technical & Systems",
            proficiency_note="High Proficiency",
            reflection="Relational database schemas (PostgreSQL / SQLite), query optimization, and archival persistence.",
            display_order=2
        ),
        Skill(
            name="[LONG-FORM EDITORIAL WRITING & MEMOIR]",
            category="Creative & Analytical",
            proficiency_note="Lifelong Discipline",
            reflection="Distilling complex emotional experiences and technical theories into lucid, evocative prose.",
            display_order=3
        ),
        Skill(
            name="[CRITICAL ANALYSIS & FIRST-PRINCIPLES REASONING]",
            category="Creative & Analytical",
            proficiency_note="Continuous Practice",
            reflection="Deconstructing thorny ambiguities down to their unassailable fundamental truths.",
            display_order=4
        ),
        Skill(
            name="[CROSS-DISCIPLINARY MENTORSHIP & EMPATHY]",
            category="Leadership & Communication",
            proficiency_note="Active Practice",
            reflection="Fostering confidence in junior peers through compassionate questioning and patient review.",
            display_order=5
        ),
        Skill(
            name="[SOLITARY ENDURANCE & OUTDOOR NAVIGATION]",
            category="Life Skills & Craft",
            proficiency_note="Backcountry Certified",
            reflection="Map reading, alpine preparedness, and maintaining composure in adverse climatic environments.",
            display_order=6
        ),
        Skill(
            name="[DOCUMENTARY PHOTOGRAPHY & VISUAL FRAMING]",
            category="Creative & Analytical",
            proficiency_note="Analog & Digital",
            reflection="Capturing candid human emotion, architectural lines, and the natural geometry of light.",
            display_order=7
        ),
        Skill(
            name="[DISCIPLINED DIGITAL HYGIENE & FOCUS]",
            category="Life Skills & Craft",
            proficiency_note="Intentional Habit",
            reflection="Protecting hours of uninterrupted deep work against the noise of algorithmic distractions.",
            display_order=8
        )
    ]
    for sk in skills:
        db.session.add(sk)

    # 9. Gallery Images
    gallery = [
        GalleryImage(
            title="[ANCESTRAL VILLAGE COURTYARD IN MORNING LIGHT]",
            caption="The stone doorway where three generations of family welcomed morning sunlight and shared village news.",
            category="Childhood",
            image_url="/static/images/village_home.jpg",
            year="Early Memories",
            display_order=1
        ),
        GalleryImage(
            title="[THE RESEARCH DESK & NOTEBOOK CITADEL]",
            caption="Handwritten journals, fountain pens, and reference volumes accumulated across university dissertation seasons.",
            category="Education",
            image_url="/static/images/study_desk.jpg",
            year="2017",
            display_order=2
        ),
        GalleryImage(
            title="[PORTRAIT IN SIDE NATURAL LIGHT]",
            caption="Formal archival portrait captured during the transition between university completion and professional launch.",
            category="Present",
            image_url="/static/images/hero_portrait.jpg",
            year="Recent",
            display_order=3
        ),
        GalleryImage(
            title="[DAWN OVER THE HIGHLAND PASS]",
            caption="Solitary morning reflection at 2,400 meters altitude overlooking the sea of mist before the final descent.",
            category="Travel",
            image_url="/static/images/growth_landscape.jpg",
            year="2023",
            display_order=4
        ),
        GalleryImage(
            title="[FAMILY HARVEST CELEBRATION]",
            caption="A gathering of cousins, aunts, and neighborhood elders celebrating the autumn harvest under the banyan tree.",
            category="Family",
            image_url="/static/images/village_home.jpg",
            year="2012",
            display_order=5
        ),
        GalleryImage(
            title="[FELLOWSHIP CEREMONY & CONFERRAL]",
            caption="Receiving the institutional honors medal surrounded by department colleagues and faculty advisors.",
            category="Achievements",
            image_url="/static/images/hero_portrait.jpg",
            year="2018",
            display_order=6
        ),
        GalleryImage(
            title="[MIDNIGHT WORKSHOP COLLABORATION]",
            caption="Whiteboards filled with system schematics and coffee mugs during the final stages of the hackathon sprint.",
            category="Events",
            image_url="/static/images/study_desk.jpg",
            year="2019",
            display_order=7
        ),
        GalleryImage(
            title="[CAMPUS REUNION ON THE COMMONS]",
            caption="Meeting lifelong comrades four years after graduation to reflect on how each path had grown and diverged.",
            category="Friends",
            image_url="/static/images/growth_landscape.jpg",
            year="2022",
            display_order=8
        )
    ]
    for g in gallery:
        db.session.add(g)

    # 10. Future Goals
    future_goals = [
        FutureGoal(
            title="[AUTHOR & PUBLISH A MEMOIR MONOGRAPH]",
            category="Creative & Personal",
            target_timeline="Within Next 2 Years",
            description="Complete and publish a physical cloth-bound book exploring the cultural transition from agrarian village life to modern computational thinking.",
            why_it_matters="To provide future generations an authentic bridge between ancestral heritage and modern technological reality.",
            status="In Active Writing",
            display_order=1
        ),
        FutureGoal(
            title="[FOUND AN ENDOWED RURAL SCHOLARSHIP FUND]",
            category="Education & Philanthropy",
            target_timeline="Within Next 4 Years",
            description="Establish a perpetual educational trust supporting talented girls and boys from rural primary schools to attend premier universities.",
            why_it_matters="Education transformed my life; paying that ladder backward is a fundamental debt of gratitude.",
            status="Structuring Phase",
            display_order=2
        ),
        FutureGoal(
            title="[ARCHITECT OPEN DIGITAL HERITAGE PROTOCOLS]",
            category="Career & Technology",
            target_timeline="Ongoing Milestone",
            description="Develop open-source, offline-first digital archival tools designed to run without cloud lock-in for 50+ years.",
            why_it_matters="Human culture deserves digital archives that outlive corporate venture capital lifecycles.",
            status="Prototyping",
            display_order=3
        ),
        FutureGoal(
            title="[BUILD A TIMBER HOMESTEAD & SEED SANCTUARY]",
            category="Dreams & Family",
            target_timeline="Next Decade",
            description="Construct an eco-sustainable family sanctuary with an organic orchard, rainwater harvesting, and solar micro-grid.",
            why_it_matters="Returning to direct communion with soil, seasons, and generational roots.",
            status="Long-term Vision",
            display_order=4
        ),
        FutureGoal(
            title="[LIFELONG STEWARDSHIP OF INNER PEACE]",
            category="Long-term Vision",
            target_timeline="Lifelong Horizon",
            description="Cultivate daily habits of silence, physical vigor, philosophical study, and warm generosity regardless of worldly fortunes.",
            why_it_matters="A successful life is ultimately judged by the serenity of one's spirit and the gentleness left in others.",
            status="Daily Practice",
            display_order=5
        )
    ]
    for fg in future_goals:
        db.session.add(fg)

    db.session.commit()
    print("Database successfully seeded with comprehensive placeholder archive data!")
