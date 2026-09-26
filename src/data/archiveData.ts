export interface ProfileData {
  fullName: string;
  preferredName: string;
  tagline: string;
  currentAge: string;
  currentChapter: string;
  birthPlace: string;
  currentResidence: string;
  heroQuote: string;
  shortBio: string;
  editorialStoryIntro: string;
  profilePhoto: string;
  email: string;
  socialGithub: string;
  socialLinkedin: string;
  socialTwitter: string;
}

export interface FamilyMemberData {
  id: number;
  name: string;
  relationship: string;
  shortBio: string;
  importantMemories: string;
  photoUrl: string;
}

export interface EducationData {
  id: number;
  stageName: string;
  institution: string;
  years: string;
  location: string;
  fieldOfStudy: string;
  experience: string;
  achievements: string;
  photoUrl: string;
}

export interface TimelineEventData {
  id: number;
  yearDate: string;
  title: string;
  category: string;
  description: string;
  location?: string;
  photoUrl?: string;
  isFeatured?: boolean;
}

export interface MemoryData {
  id: number;
  title: string;
  dateStr: string;
  location: string;
  story: string;
  quote?: string;
  photoUrl?: string;
}

export interface AchievementData {
  id: number;
  title: string;
  year: string;
  category: string;
  issuer: string;
  description: string;
  imageUrl?: string;
}

export interface ProfessionalExpData {
  id: number;
  role: string;
  organization: string;
  years: string;
  location: string;
  narrativeDescription: string;
  keyLearnings: string;
}

export interface SkillData {
  id: number;
  name: string;
  category: string;
  proficiencyNote: string;
  reflection: string;
}

export interface GalleryImageData {
  id: number;
  title: string;
  caption: string;
  category: string;
  imageUrl: string;
  year: string;
}

export interface FutureGoalData {
  id: number;
  title: string;
  category: string;
  targetTimeline: string;
  description: string;
  whyItMatters: string;
  status: string;
}

export interface ContactMessageData {
  id: number;
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
  createdAt: string;
}

export const initialProfile: ProfileData = {
  fullName: "[REAL FULL NAME]",
  preferredName: "[FIRST NAME]",
  tagline: "A personal chronicle of origins, intellectual wanderings, enduring lineage, and the quiet pursuit of craft.",
  currentAge: "[CURRENT AGE / e.g. 29 Years]",
  currentChapter: "Chapter V: Construction, Synthesis & Creative Legacy",
  birthPlace: "[HOMETOWN / ANCESTRAL VILLAGE]",
  currentResidence: "[CURRENT RESIDENCE / CITY]",
  heroQuote: "“We do not preserve the past to remain inside it; we write it down so our children can see the ground upon which they stand.”",
  shortBio: "Welcome to this living archive. This is neither a corporate resume nor a promotional facade; it is an authentic documentary record of one human journey—from quiet village origins through rigorous formal schooling, trials of character, professional pursuits, and evolving future visions. Every section represents an open chapter in an ongoing book.",
  editorialStoryIntro: "Every life begins with an environment we did not choose and voices that spoke to us before we could reply. This volume gathers the threads: childhood recollections, family roots, education milestones, moments of doubt, and the persistent work of becoming.",
  profilePhoto: "/images/hero_portrait.jpg",
  email: "archive.custodian@example.com",
  socialGithub: "https://github.com",
  socialLinkedin: "https://linkedin.com",
  socialTwitter: "https://twitter.com"
};

export const initialFamily: FamilyMemberData[] = [
  {
    id: 1,
    name: "[FATHER'S NAME]",
    relationship: "Father",
    shortBio: "[REAL FAMILY INFORMATION: A pillar of quiet discipline and practical wisdom. Taught the fundamentals of integrity, early morning labor, and patience with difficult problems.]",
    importantMemories: "[MEMORIES: Walking through the harvest fields at sunset, discussing how patience turns seeds into sustenance, and the habit of repairing things with one's own hands.]",
    photoUrl: "/images/hero_portrait.jpg"
  },
  {
    id: 2,
    name: "[MOTHER'S NAME]",
    relationship: "Mother",
    shortBio: "[REAL FAMILY INFORMATION: The emotional cornerstone and intellectual encourager of the household. A guardian of stories, warm hospitality, and unconditional moral grounding.]",
    importantMemories: "[MEMORIES: Sitting beside her in the kitchen listening to folk tales and proverbs, while she gently checked school notebooks under the warm glow of the lantern.]",
    photoUrl: "/images/village_home.jpg"
  },
  {
    id: 3,
    name: "[GRANDPARENT'S NAME]",
    relationship: "Grandmother / Lineage Elder",
    shortBio: "[REAL FAMILY INFORMATION: Keeper of family oral histories and village heritage. Her memory spanned generations, linking our contemporary world to historic cultural roots.]",
    importantMemories: "[MEMORIES: The evening courtyard gatherings where historical migrations and ancestral parables were passed down with vivid grace.]",
    photoUrl: "/images/study_desk.jpg"
  },
  {
    id: 4,
    name: "[SIBLING'S NAME]",
    relationship: "Elder Sibling / Companion",
    shortBio: "[REAL FAMILY INFORMATION: Lifelong confidant, earliest competitor, and steadfast ally. Shared childhood adventures and mutual encouragement through every transitional crossroads.]",
    importantMemories: "[MEMORIES: Sharing late-night curiosity over mathematics problems, building makeshift toys in the yard, and dreaming together about distant universities.]",
    photoUrl: "/images/growth_landscape.jpg"
  }
];

export const initialEducation: EducationData[] = [
  {
    id: 1,
    stageName: "Primary Foundation",
    institution: "[VILLAGE PRIMARY SCHOOL / ELEMENTARY]",
    years: "[EARLY YEARS — e.g. 2002 — 2008]",
    location: "[VILLAGE / HOMETOWN]",
    fieldOfStudy: "General Elementary Foundations, Languages & Arithmetic",
    experience: "[REAL EDUCATION DETAILS: Wooden benches, chalkboard slates, and the earliest joy of discovering reading. The playground bordered open meadows, and curiosity was sparked through hands-on discovery.]",
    achievements: "[ACHIEVEMENTS: First prize in district handwriting, school storytelling representative, class prefect.]",
    photoUrl: "/images/village_home.jpg"
  },
  {
    id: 2,
    stageName: "Secondary & High School",
    institution: "[REGIONAL SECONDARY ACADEMY / HIGH SCHOOL]",
    years: "[FORMATIVE YEARS — e.g. 2008 — 2014]",
    location: "[DISTRICT CAPITAL]",
    fieldOfStudy: "Natural Sciences, Mathematics & Literature",
    experience: "[REAL EDUCATION DETAILS: A transformative expansion of worldview. Daily long commutes, intensive laboratory experiments, and discovering an enduring passion for structured analytical inquiry.]",
    achievements: "[ACHIEVEMENTS: Science Olympiad medalist, editor of the student literary magazine, graduating with highest academic distinction.]",
    photoUrl: "/images/study_desk.jpg"
  },
  {
    id: 3,
    stageName: "Undergraduate Degree",
    institution: "[METROPOLITAN UNIVERSITY / COLLEGE]",
    years: "[UNIVERSITY YEARS — e.g. 2014 — 2018]",
    location: "[UNIVERSITY CITY]",
    fieldOfStudy: "[MAJOR / DEGREE — Computer Science / Engineering / Humanities]",
    experience: "[REAL EDUCATION DETAILS: Deep intellectual immersion. Rigorous curriculum, late nights in the campus library, mentorship under revered scholars, and building the first complex systems.]",
    achievements: "[ACHIEVEMENTS: Dean's Honor List, published undergraduate research paper, captain of the inter-collegiate debate delegation.]",
    photoUrl: "/images/study_desk.jpg"
  },
  {
    id: 4,
    stageName: "Advanced & Professional Mastery",
    institution: "[GRADUATE INSTITUTE / SPECIALIZED ACADEMY]",
    years: "[ADVANCED YEARS — e.g. 2019 — 2021]",
    location: "[INSTITUTE CITY / ONLINE RESEARCH CONSORTIUM]",
    fieldOfStudy: "[SPECIALIZATION / GRADUATE DISCIPLINE]",
    experience: "[REAL EDUCATION DETAILS: Self-directed research, executive methodologies, and bridging academic theory with high-impact real-world execution.]",
    achievements: "[ACHIEVEMENTS: Master's thesis with distinction, cross-disciplinary innovation fellowship.]",
    photoUrl: "/images/growth_landscape.jpg"
  }
];

export const initialTimeline: TimelineEventData[] = [
  {
    id: 1,
    yearDate: "1998",
    title: "[GENESIS: Birth in the Ancestral Village]",
    category: "Childhood",
    description: "[REAL LIFE EVENT: Born in a tranquil village surrounded by orchards and river streams. Earliest impressions formed by nature, familial warmth, and community traditions.]",
    location: "[ANCESTRAL VILLAGE]",
    photoUrl: "/images/village_home.jpg",
    isFeatured: true
  },
  {
    id: 2,
    yearDate: "2005",
    title: "[THE FIRST WRITTEN BOOK: Early Curiosity Awakens]",
    category: "Education",
    description: "[REAL LIFE EVENT: Borrowed first classic encyclopedias and literature volumes from a small local library. Began keeping personal notebooks of sketches and observations.]",
    location: "[HOMETOWN LIBRARY]",
    photoUrl: "/images/study_desk.jpg",
    isFeatured: false
  },
  {
    id: 3,
    yearDate: "2011",
    title: "[FAMILY RELOCATION: Embracing New Horizons]",
    category: "Family",
    description: "[REAL LIFE EVENT: Moving from rural familiarity to the buzzing district town. Adapting to modern urban tempo, meeting diverse peers, and strengthening family unity.]",
    location: "[DISTRICT CAPITAL]",
    photoUrl: "/images/village_home.jpg",
    isFeatured: false
  },
  {
    id: 4,
    yearDate: "2014",
    title: "[THE CRITICAL CRUCIBLE: University Entrance & Independence]",
    category: "Challenge",
    description: "[REAL LIFE EVENT: Navigating competitive national examinations while living away from home for the first time. Overcoming self-doubt and forging emotional independence.]",
    location: "[REGIONAL EXAMINATION CENTER]",
    photoUrl: "/images/growth_landscape.jpg",
    isFeatured: true
  },
  {
    id: 5,
    yearDate: "2018",
    title: "[THE LAUNCH: University Graduation & First Professional Steps]",
    category: "Achievement",
    description: "[REAL LIFE EVENT: Graduated with honors surrounded by proud parents. Secured the first professional role and began applying knowledge to solve substantial operational challenges.]",
    location: "[UNIVERSITY AUDITORIUM]",
    photoUrl: "/images/hero_portrait.jpg",
    isFeatured: true
  },
  {
    id: 6,
    yearDate: "2021",
    title: "[LEADERSHIP & MATURITY: Directing Major Initiatives]",
    category: "Career",
    description: "[REAL LIFE EVENT: Promoted to oversee cross-functional initiatives. Mentored junior colleagues and learned the delicate balance of empathy, velocity, and architectural rigor.]",
    location: "[TECH METROPOLIS]",
    photoUrl: "/images/study_desk.jpg",
    isFeatured: false
  },
  {
    id: 7,
    yearDate: "2024",
    title: "[THE PIVOT: Deepening Philosophical & Creative Purpose]",
    category: "Personal Growth",
    description: "[REAL LIFE EVENT: Stepping back to evaluate long-term contribution. Commenced writing, community archiving, and designing durable systems built to endure.]",
    location: "[MOUNTAIN RETREAT / STUDY]",
    photoUrl: "/images/growth_landscape.jpg",
    isFeatured: true
  },
  {
    id: 8,
    yearDate: "Present",
    title: "[THE ONGOING EXPEDITION: Synthesis & Legacy]",
    category: "Present",
    description: "[REAL LIFE EVENT: Living intentionally at the intersection of technical craft, family stewardship, and continuous lifelong self-education.]",
    location: "[CURRENT RESIDENCE]",
    photoUrl: "/images/hero_portrait.jpg",
    isFeatured: true
  }
];

export const initialMemories: MemoryData[] = [
  {
    id: 1,
    title: "[THE EVENING OIL LANTERN & THE ANCIENT DESK]",
    dateStr: "Autumn, Childhood Years",
    location: "[FAMILY COURTYARD]",
    story: "[CHILDHOOD MEMORY: Long before reliable electricity was a constant, my grandfather would illuminate a brass kerosene lantern on the veranda. The amber glow danced on the lime-washed walls. In that silence, the rustle of turning pages sounded like footsteps in a cathedral. I learned then that quiet focus is a sanctuary no one can take away from you.]",
    quote: "“In the quietest room, the smallest idea carries the resonance of thunder.”",
    photoUrl: "/images/study_desk.jpg"
  },
  {
    id: 2,
    title: "[THE MONSOON RIVER CROSSING]",
    dateStr: "Monsoon Season, Age 12",
    location: "[VILLAGE RIVER CROSSING]",
    story: "[CHILDHOOD MEMORY: The village river had swelled overnight, submerging the wooden footbridge. To reach the school examination, my father carried my satchel over his head while guiding me through the cold current. When we reached the opposite bank drenched and safe, he smiled and said: 'Water only tests if your feet are willing.' That morning, no test could have seemed intimidating.]",
    quote: "“Courage is rarely an absence of fear; it is holding someone's hand through the rising current.”",
    photoUrl: "/images/village_home.jpg"
  },
  {
    id: 3,
    title: "[NIGHT WATCH AT THE UNIVERSITY COMPUTING LAB]",
    dateStr: "Winter, Final Undergraduate Year",
    location: "[CAMPUS SCIENCE BUILDING]",
    story: "[MEMOIR REFLECTION: At 3:45 AM, the terminal screens cast blue reflections across empty rows of chairs. We had spent three weeks tracking a concurrency race condition in our distributed simulation engine. When the clean compile completed and the visualizer plotted the flawless trajectory, four exhausted students looked at each other in solemn, speechless awe. The world outside was asleep, but we had touched truth.]",
    quote: "“Real craftsmanship reveals itself when everyone else has packed their bags and gone home.”",
    photoUrl: "/images/study_desk.jpg"
  },
  {
    id: 4,
    title: "[DAWN AT THE ALPINE SUMMIT: RENEWAL OF PURPOSE]",
    dateStr: "Summer, Recent Pilgrimage",
    location: "[HIGH PASS SANCTUARY]",
    story: "[PERSONAL GROWTH MEMORY: After a strenuous seven-hour ascent in pitch darkness, breaking above the tree line just as the sun ignited the snow-capped crests. Looking down upon the sea of cloud, all trivial anxieties vanished. You realize how brief human life is, and that the only legacy worth leaving is kindness, clarity, and steadfast work.]",
    quote: "“To see the valley clearly, you must first carry the weight to the peak.”",
    photoUrl: "/images/growth_landscape.jpg"
  }
];

export const initialAchievements: AchievementData[] = [
  {
    id: 1,
    title: "[NATIONAL ACADEMIC MERIT SCHOLARSHIP]",
    year: "2014",
    category: "Academic",
    issuer: "[MINISTRY OF HIGHER EDUCATION]",
    description: "[REAL ACHIEVEMENT: Awarded to top 0.5% percentile in national pre-university examinations for analytical problem-solving and rigorous scientific aptitude.]",
    imageUrl: "/images/study_desk.jpg"
  },
  {
    id: 2,
    title: "[VALEDICTORIAN DISTINCTION & DEAN'S MEDAL]",
    year: "2018",
    category: "Academic",
    issuer: "[UNIVERSITY FACULTY COUNCIL]",
    description: "[REAL ACHIEVEMENT: Recognized for highest cumulative grade point average across the graduating department alongside significant contributions to student peer tutoring.]",
    imageUrl: "/images/hero_portrait.jpg"
  },
  {
    id: 3,
    title: "[REGIONAL HACKATHON GRAND PRIZE WINNER]",
    year: "2019",
    category: "Competition",
    issuer: "[CIVIC TECHNOLOGY CONSORTIUM]",
    description: "[REAL ACHIEVEMENT: Conceived and engineered an offline-first emergency resource coordination network within 48 continuous hours of collaborative design.]",
    imageUrl: "/images/study_desk.jpg"
  },
  {
    id: 4,
    title: "[EXEMPLARY MENTORSHIP & LEADERSHIP AWARD]",
    year: "2022",
    category: "Professional",
    issuer: "[INSTITUTIONAL PEER COMMITTEE]",
    description: "[REAL ACHIEVEMENT: Commended for nurturing early-career researchers, publishing accessible internal documentation, and cultivating a culture of empathy and rigor.]",
    imageUrl: "/images/growth_landscape.jpg"
  },
  {
    id: 5,
    title: "[SOLO ENDURANCE EXPEDITION COMPLETION]",
    year: "2023",
    category: "Milestone",
    issuer: "[ALPINE TRAIL RECORD]",
    description: "[REAL ACHIEVEMENT: Self-supported 250km trans-ridge trek completed over 12 days, testing physical stamina, solitude, and backcountry resilience.]",
    imageUrl: "/images/growth_landscape.jpg"
  },
  {
    id: 6,
    title: "[COMMUNITY DIGITAL ARCHIVE INITIATIVE]",
    year: "2024",
    category: "Award",
    issuer: "[HERITAGE PRESERVATION GUILD]",
    description: "[REAL ACHIEVEMENT: Curated and digitized historical records of 45 village elders, ensuring oral histories are preserved in high-fidelity open formats.]",
    imageUrl: "/images/village_home.jpg"
  }
];

export const initialExperiences: ProfessionalExpData[] = [
  {
    id: 1,
    role: "[FOUNDATIONAL APPRENTICE / JUNIOR ENGINEER]",
    organization: "[REGIONAL RESEARCH LAB / COMPANY A]",
    years: "[2018 — 2020]",
    location: "[CITY A]",
    narrativeDescription: "[PROFESSIONAL JOURNEY: The apprenticeship years. Mastered core software engineering discipline, production monitoring, and team collaboration. Discovered the profound difference between code that merely functions and software that survives contact with unpredictable human reality.]",
    keyLearnings: "[LEARNINGS: Humility in code review, value of automated verification, and the art of listening before architecting.]"
  },
  {
    id: 2,
    role: "[SENIOR SYSTEMS ARCHITECT & TECHNICAL LEAD]",
    organization: "[HIGH-GROWTH TECHNOLOGY ENTERPRISE]",
    years: "[2020 — 2023]",
    location: "[METROPOLITAN HUB]",
    narrativeDescription: "[PROFESSIONAL JOURNEY: Spearheaded resilient distributed systems, data processing pipelines, and API protocols. Led an eight-person cross-disciplinary team through complex migrations with zero downtime. Shifted focus from individual throughput to organizational leverage.]",
    keyLearnings: "[LEARNINGS: Architecture is not merely boxes and arrows; it is human communication crystallized in code.]"
  },
  {
    id: 3,
    role: "[PRINCIPAL ADVISOR & INDEPENDENT FELLOW]",
    organization: "[INDEPENDENT PRACTICE & DIGITAL COMMONS]",
    years: "[2023 — Present]",
    location: "[HYBRID / GLOBAL]",
    narrativeDescription: "[PROFESSIONAL JOURNEY: Operating at the confluence of open digital architecture, archival memory systems, and private client advisory. Prioritizing longevity, clarity, and ethical human-centered computing over ephemeral trends.]",
    keyLearnings: "[LEARNINGS: Sustainable craft requires refusing unnecessary complexity.]"
  }
];

export const initialSkills: SkillData[] = [
  {
    id: 1,
    name: "[SYSTEMS ARCHITECTURE & SOFTWARE DESIGN]",
    category: "Technical & Systems",
    proficiencyNote: "Mastery / 8+ Years",
    reflection: "Designing fault-tolerant, maintainable software systems with clean interfaces and clear documentation."
  },
  {
    id: 2,
    name: "[DATABASE MODELING & DATA INTEGRITY]",
    category: "Technical & Systems",
    proficiencyNote: "High Proficiency",
    reflection: "Relational database schemas (PostgreSQL / SQLite), query optimization, and archival persistence."
  },
  {
    id: 3,
    name: "[LONG-FORM EDITORIAL WRITING & MEMOIR]",
    category: "Creative & Analytical",
    proficiencyNote: "Lifelong Discipline",
    reflection: "Distilling complex emotional experiences and technical theories into lucid, evocative prose."
  },
  {
    id: 4,
    name: "[CRITICAL ANALYSIS & FIRST-PRINCIPLES REASONING]",
    category: "Creative & Analytical",
    proficiencyNote: "Continuous Practice",
    reflection: "Deconstructing thorny ambiguities down to their unassailable fundamental truths."
  },
  {
    id: 5,
    name: "[CROSS-DISCIPLINARY MENTORSHIP & EMPATHY]",
    category: "Leadership & Communication",
    proficiencyNote: "Active Practice",
    reflection: "Fostering confidence in junior peers through compassionate questioning and patient review."
  },
  {
    id: 6,
    name: "[SOLITARY ENDURANCE & OUTDOOR NAVIGATION]",
    category: "Life Skills & Craft",
    proficiencyNote: "Backcountry Certified",
    reflection: "Map reading, alpine preparedness, and maintaining composure in adverse climatic environments."
  },
  {
    id: 7,
    name: "[DOCUMENTARY PHOTOGRAPHY & VISUAL FRAMING]",
    category: "Creative & Analytical",
    proficiencyNote: "Analog & Digital",
    reflection: "Capturing candid human emotion, architectural lines, and the natural geometry of light."
  },
  {
    id: 8,
    name: "[DISCIPLINED DIGITAL HYGIENE & FOCUS]",
    category: "Life Skills & Craft",
    proficiencyNote: "Intentional Habit",
    reflection: "Protecting hours of uninterrupted deep work against the noise of algorithmic distractions."
  }
];

export const initialGallery: GalleryImageData[] = [
  {
    id: 1,
    title: "[ANCESTRAL VILLAGE COURTYARD IN MORNING LIGHT]",
    caption: "The stone doorway where three generations of family welcomed morning sunlight and shared village news.",
    category: "Childhood",
    imageUrl: "/images/village_home.jpg",
    year: "Early Memories"
  },
  {
    id: 2,
    title: "[THE RESEARCH DESK & NOTEBOOK CITADEL]",
    caption: "Handwritten journals, fountain pens, and reference volumes accumulated across university dissertation seasons.",
    category: "Education",
    imageUrl: "/images/study_desk.jpg",
    year: "2017"
  },
  {
    id: 3,
    title: "[PORTRAIT IN SIDE NATURAL LIGHT]",
    caption: "Formal archival portrait captured during the transition between university completion and professional launch.",
    category: "Present",
    imageUrl: "/images/hero_portrait.jpg",
    year: "Recent"
  },
  {
    id: 4,
    title: "[DAWN OVER THE HIGHLAND PASS]",
    caption: "Solitary morning reflection at 2,400 meters altitude overlooking the sea of mist before the final descent.",
    category: "Travel",
    imageUrl: "/images/growth_landscape.jpg",
    year: "2023"
  },
  {
    id: 5,
    title: "[FAMILY HARVEST CELEBRATION]",
    caption: "A gathering of cousins, aunts, and neighborhood elders celebrating the autumn harvest under the banyan tree.",
    category: "Family",
    imageUrl: "/images/village_home.jpg",
    year: "2012"
  },
  {
    id: 6,
    title: "[FELLOWSHIP CEREMONY & CONFERRAL]",
    caption: "Receiving the institutional honors medal surrounded by department colleagues and faculty advisors.",
    category: "Achievements",
    imageUrl: "/images/hero_portrait.jpg",
    year: "2018"
  },
  {
    id: 7,
    title: "[MIDNIGHT WORKSHOP COLLABORATION]",
    caption: "Whiteboards filled with system schematics and coffee mugs during the final stages of the hackathon sprint.",
    category: "Events",
    imageUrl: "/images/study_desk.jpg",
    year: "2019"
  },
  {
    id: 8,
    title: "[CAMPUS REUNION ON THE COMMONS]",
    caption: "Meeting lifelong comrades four years after graduation to reflect on how each path had grown and diverged.",
    category: "Friends",
    imageUrl: "/images/growth_landscape.jpg",
    year: "2022"
  }
];

export const initialFutureGoals: FutureGoalData[] = [
  {
    id: 1,
    title: "[AUTHOR & PUBLISH A MEMOIR MONOGRAPH]",
    category: "Creative & Personal",
    targetTimeline: "Within Next 2 Years",
    description: "Complete and publish a physical cloth-bound book exploring the cultural transition from agrarian village life to modern computational thinking.",
    whyItMatters: "To provide future generations an authentic bridge between ancestral heritage and modern technological reality.",
    status: "In Active Writing"
  },
  {
    id: 2,
    title: "[FOUND AN ENDOWED RURAL SCHOLARSHIP FUND]",
    category: "Education & Philanthropy",
    targetTimeline: "Within Next 4 Years",
    description: "Establish a perpetual educational trust supporting talented girls and boys from rural primary schools to attend premier universities.",
    whyItMatters: "Education transformed my life; paying that ladder backward is a fundamental debt of gratitude.",
    status: "Structuring Phase"
  },
  {
    id: 3,
    title: "[ARCHITECT OPEN DIGITAL HERITAGE PROTOCOLS]",
    category: "Career & Technology",
    targetTimeline: "Ongoing Milestone",
    description: "Develop open-source, offline-first digital archival tools designed to run without cloud lock-in for 50+ years.",
    whyItMatters: "Human culture deserves digital archives that outlive corporate venture capital lifecycles.",
    status: "Prototyping"
  },
  {
    id: 4,
    title: "[BUILD A TIMBER HOMESTEAD & SEED SANCTUARY]",
    category: "Dreams & Family",
    targetTimeline: "Next Decade",
    description: "Construct an eco-sustainable family sanctuary with an organic orchard, rainwater harvesting, and solar micro-grid.",
    whyItMatters: "Returning to direct communion with soil, seasons, and generational roots.",
    status: "Long-term Vision"
  },
  {
    id: 5,
    title: "[LIFELONG STEWARDSHIP OF INNER PEACE]",
    category: "Long-term Vision",
    targetTimeline: "Lifelong Horizon",
    description: "Cultivate daily habits of silence, physical vigor, philosophical study, and warm generosity regardless of worldly fortunes.",
    whyItMatters: "A successful life is ultimately judged by the serenity of one's spirit and the gentleness left in others.",
    status: "Daily Practice"
  }
];
