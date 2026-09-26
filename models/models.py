from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Profile(db.Model):
    """
    Core personal identity profile for the digital life archive.
    Designed with structured placeholders so the client can substitute
    their real biographical facts with zero architectural changes.
    """
    __tablename__ = 'profiles'

    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(120), nullable=False, default='[REAL FULL NAME]')
    preferred_name = db.Column(db.String(80), nullable=False, default='[FIRST NAME]')
    tagline = db.Column(db.String(255), default='[A thoughtful one-line personal philosophy / life motto]')
    current_age = db.Column(db.String(50), default='[AGE / BORN YEAR]')
    current_chapter = db.Column(db.String(120), default='[CURRENT LIFE CHAPTER — e.g. Building, Mentoring & Writing]')
    birth_place = db.Column(db.String(150), default='[HOMETOWN / ANCESTRAL VILLAGE]')
    current_residence = db.Column(db.String(150), default='[CURRENT CITY / REGION]')
    hero_quote = db.Column(db.Text, default='“The richness of a life is not measured in distance traveled, but in the depths of remembrance and the clarity of purpose.”')
    short_bio = db.Column(db.Text, default='[SHORT BIOGRAPHY: An introductory reflection welcoming the reader to this curated record of life, lineage, learning, and aspirations.]')
    editorial_story_intro = db.Column(db.Text, default='[OPENING MEMOIR INTRODUCTION]')
    profile_photo = db.Column(db.String(255), default='/static/images/hero_portrait.jpg')
    email = db.Column(db.String(120), default='contact@example.com')
    social_github = db.Column(db.String(255), default='https://github.com')
    social_linkedin = db.Column(db.String(255), default='https://linkedin.com')
    social_twitter = db.Column(db.String(255), default='https://twitter.com')
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<Profile {self.full_name}>"


class FamilyMember(db.Model):
    """
    Family archive recording ancestral roots, parents, siblings, and mentors.
    """
    __tablename__ = 'family_members'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    relationship = db.Column(db.String(80), nullable=False)  # e.g., Father, Mother, Grandmother, Sibling
    short_bio = db.Column(db.Text, nullable=False)
    important_memories = db.Column(db.Text)
    photo_url = db.Column(db.String(255))
    display_order = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<FamilyMember {self.name} ({self.relationship})>"


class Education(db.Model):
    """
    Educational milestones from primary foundations to higher education and mastery.
    """
    __tablename__ = 'education_entries'

    id = db.Column(db.Integer, primary_key=True)
    stage_name = db.Column(db.String(100), nullable=False)  # e.g., Primary School, Secondary School, College, University
    institution = db.Column(db.String(150), nullable=False)
    years = db.Column(db.String(60), nullable=False)
    location = db.Column(db.String(120))
    field_of_study = db.Column(db.String(150))
    experience = db.Column(db.Text, nullable=False)
    achievements = db.Column(db.Text)
    photo_url = db.Column(db.String(255))
    display_order = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<Education {self.stage_name} - {self.institution}>"


class TimelineEvent(db.Model):
    """
    Chronological life events plotted along the interactive timeline.
    Categories: Childhood, Education, Family, Achievement, Challenge, Career, Personal Growth, Present
    """
    __tablename__ = 'timeline_events'

    id = db.Column(db.Integer, primary_key=True)
    year_date = db.Column(db.String(50), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(60), nullable=False)
    description = db.Column(db.Text, nullable=False)
    location = db.Column(db.String(120))
    photo_url = db.Column(db.String(255))
    is_featured = db.Column(db.Boolean, default=False)
    display_order = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<TimelineEvent {self.year_date}: {self.title}>"


class Memory(db.Model):
    """
    Sensory, emotional personal memories and defining life reflections.
    """
    __tablename__ = 'memories'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    date_str = db.Column(db.String(80), nullable=False)
    location = db.Column(db.String(120))
    story = db.Column(db.Text, nullable=False)
    quote = db.Column(db.Text)
    photo_url = db.Column(db.String(255))
    display_order = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<Memory {self.title}>"


class Achievement(db.Model):
    """
    Formal recognitions, academic awards, competitions, and personal milestones.
    """
    __tablename__ = 'achievements'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    year = db.Column(db.String(40), nullable=False)
    category = db.Column(db.String(80), nullable=False)  # Award, Certificate, Academic, Competition, Professional, Milestone
    issuer = db.Column(db.String(150))
    description = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.String(255))
    display_order = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<Achievement {self.year}: {self.title}>"


class ProfessionalExperience(db.Model):
    """
    Professional vocation and leadership trajectory written in reflective documentary style.
    """
    __tablename__ = 'professional_experiences'

    id = db.Column(db.Integer, primary_key=True)
    role = db.Column(db.String(150), nullable=False)
    organization = db.Column(db.String(150), nullable=False)
    years = db.Column(db.String(60), nullable=False)
    location = db.Column(db.String(120))
    narrative_description = db.Column(db.Text, nullable=False)
    key_learnings = db.Column(db.Text)
    display_order = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<ProfessionalExperience {self.role} at {self.organization}>"


class Skill(db.Model):
    """
    Curated disciplines, craft, and intellectual capabilities developed over time.
    """
    __tablename__ = 'skills'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(80), nullable=False)  # Creative, Technical, Leadership, Craft
    proficiency_note = db.Column(db.String(100))
    reflection = db.Column(db.Text)
    display_order = db.Column(db.Integer, default=0)

    def __repr__(self):
        return f"<Skill {self.name} ({self.category})>"


class GalleryImage(db.Model):
    """
    Archival imagery curated by chapter and life phase with descriptive metadata.
    """
    __tablename__ = 'gallery_images'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    caption = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(60), nullable=False)  # Childhood, Family, Education, Friends, Events, Achievements, Travel, Present
    image_url = db.Column(db.String(255), nullable=False)
    year = db.Column(db.String(40))
    display_order = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<GalleryImage {self.title}>"


class FutureGoal(db.Model):
    """
    Forward-looking horizons, personal missions, and long-term aspirational vision.
    """
    __tablename__ = 'future_goals'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(80), nullable=False)  # Career, Personal, Education, Dreams, Long-term Vision
    target_timeline = db.Column(db.String(80))
    description = db.Column(db.Text, nullable=False)
    why_it_matters = db.Column(db.Text)
    status = db.Column(db.String(60), default='In Inception')
    display_order = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<FutureGoal {self.title}>"


class ContactMessage(db.Model):
    """
    Visitor inquiries, greetings, and archival guestbook transmissions.
    """
    __tablename__ = 'contact_messages'

    id = db.Column(db.Integer, primary_key=True)
    sender_name = db.Column(db.String(120), nullable=False)
    sender_email = db.Column(db.String(150), nullable=False)
    subject = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<ContactMessage from {self.sender_name} ({self.sender_email})>"
