import os
from datetime import datetime
from flask import (
    Flask, render_template, request, flash,
    redirect, url_for, jsonify, send_from_directory, Response
)
from config import Config
from models.models import (
    db, Profile, FamilyMember, Education,
    TimelineEvent, Memory, Achievement, ProfessionalExperience,
    Skill, GalleryImage, FutureGoal, ContactMessage
)
from seed_data import seed_database

def create_app(config_class=Config):
    app = Flask(__name__, static_folder='static', template_folder='templates')
    app.config.from_object(config_class)

    # Initialize extensions
    db.init_app(app)

    # Ensure instance and uploads directories exist
    os.makedirs(os.path.join(app.root_path, 'instance'), exist_ok=True)
    os.makedirs(app.config.get('UPLOAD_FOLDER', os.path.join(app.root_path, 'static', 'uploads')), exist_ok=True)

    with app.app_context():
        db.create_all()
        seed_database()

    # Global template context processor
    @app.context_processor
    def inject_global_data():
        profile = Profile.query.first()
        return {
            'profile': profile,
            'current_year': datetime.utcnow().year,
            'app_title': 'Digital Life Archive',
            'app_author': profile.full_name if profile else '[ARCHIVE OWNER]'
        }

    # ==========================================
    # ROUTES
    # ==========================================

    @app.route('/')
    def index():
        """Cinematic editorial homepage."""
        featured_events = TimelineEvent.query.filter_by(is_featured=True).order_by(TimelineEvent.display_order.asc()).limit(4).all()
        recent_memories = Memory.query.order_by(Memory.display_order.asc()).limit(3).all()
        achievements_preview = Achievement.query.order_by(Achievement.display_order.asc()).limit(4).all()
        gallery_preview = GalleryImage.query.order_by(GalleryImage.display_order.asc()).limit(4).all()
        return render_template(
            'index.html',
            active_page='home',
            featured_events=featured_events,
            recent_memories=recent_memories,
            achievements_preview=achievements_preview,
            gallery_preview=gallery_preview
        )

    @app.route('/story')
    def story():
        """Long-form editorial biography."""
        return render_template('story.html', active_page='story')

    @app.route('/childhood')
    def childhood():
        """Childhood, origins, village home, and formative lessons."""
        memories = Memory.query.filter(Memory.display_order <= 2).all()
        events = TimelineEvent.query.filter_by(category='Childhood').all()
        return render_template('childhood.html', active_page='childhood', memories=memories, events=events)

    @app.route('/family')
    def family():
        """Family archive, lineage, and cherished reflections."""
        family_members = FamilyMember.query.order_by(FamilyMember.display_order.asc()).all()
        return render_template('family.html', active_page='family', family_members=family_members)

    @app.route('/education')
    def education():
        """Education milestones and academic development."""
        education_stages = Education.query.order_by(Education.display_order.asc()).all()
        return render_template('education.html', active_page='education', stages=education_stages)

    @app.route('/timeline')
    def timeline():
        """Interactive chronological life timeline with category filters."""
        category = request.args.get('category', 'all')
        if category and category != 'all':
            events = TimelineEvent.query.filter_by(category=category).order_by(TimelineEvent.display_order.asc()).all()
        else:
            events = TimelineEvent.query.order_by(TimelineEvent.display_order.asc()).all()

        categories = [
            'All', 'Childhood', 'Education', 'Family',
            'Achievement', 'Challenge', 'Career', 'Personal Growth', 'Present'
        ]
        return render_template(
            'timeline.html',
            active_page='timeline',
            events=events,
            categories=categories,
            selected_category=category
        )

    @app.route('/gallery')
    def gallery():
        """Archival photo gallery with interactive lightbox modal."""
        category = request.args.get('category', 'all')
        if category and category != 'all':
            images = GalleryImage.query.filter_by(category=category).order_by(GalleryImage.display_order.asc()).all()
        else:
            images = GalleryImage.query.order_by(GalleryImage.display_order.asc()).all()

        categories = [
            'All', 'Childhood', 'Family', 'Education',
            'Friends', 'Events', 'Achievements', 'Travel', 'Present'
        ]
        return render_template(
            'gallery.html',
            active_page='gallery',
            images=images,
            categories=categories,
            selected_category=category
        )

    @app.route('/memories')
    def memories():
        """Deep personal reflections, evocative memoirs, and sensory stories."""
        memoir_list = Memory.query.order_by(Memory.display_order.asc()).all()
        return render_template('memories.html', active_page='memories', memories=memoir_list)

    @app.route('/achievements')
    def achievements():
        """Awards, honors, milestones, and formal recognitions."""
        category = request.args.get('category', 'all')
        if category and category != 'all':
            items = Achievement.query.filter_by(category=category).order_by(Achievement.display_order.asc()).all()
        else:
            items = Achievement.query.order_by(Achievement.display_order.asc()).all()

        categories = ['All', 'Academic', 'Award', 'Competition', 'Professional', 'Milestone']
        return render_template(
            'achievements.html',
            active_page='achievements',
            achievements=items,
            categories=categories,
            selected_category=category
        )

    @app.route('/professional')
    def professional():
        """Vocational trajectory, craft philosophy, and acquired skills."""
        experiences = ProfessionalExperience.query.order_by(ProfessionalExperience.display_order.asc()).all()
        skills = Skill.query.order_by(Skill.display_order.asc()).all()
        return render_template(
            'professional.html',
            active_page='professional',
            experiences=experiences,
            skills=skills
        )

    @app.route('/growth')
    def growth():
        """Philosophical reflections on character, trials, and personal evolution."""
        return render_template('growth.html', active_page='growth')

    @app.route('/future')
    def future():
        """Long-term aspirations, horizon goals, and unfinished dreams."""
        goals = FutureGoal.query.order_by(FutureGoal.display_order.asc()).all()
        return render_template('future.html', active_page='future', goals=goals)

    @app.route('/contact', methods=['GET', 'POST'])
    def contact():
        """Direct inquiry and guestbook transmission."""
        if request.method == 'POST':
            name = request.form.get('name', '').strip()
            email = request.form.get('email', '').strip()
            subject = request.form.get('subject', '').strip()
            message = request.form.get('message', '').strip()

            if not name or not email or not message:
                flash("Please complete all required fields (Name, Email, Message).", "error")
                return redirect(url_for('contact'))

            # Basic email validation
            if '@' not in email or '.' not in email:
                flash("Please enter a valid email address.", "error")
                return redirect(url_for('contact'))

            # Save message to database
            msg = ContactMessage(
                sender_name=name,
                sender_email=email,
                subject=subject if subject else "General Inquiry / Archival Greeting",
                message=message
            )
            db.session.add(msg)
            db.session.commit()

            flash("Your transmission has been preserved in the archive. Thank you for connecting.", "success")
            return redirect(url_for('contact'))

        return render_template('contact.html', active_page='contact')

    @app.route('/health')
    def health():
        """Health check endpoint for deployment monitoring."""
        try:
            profile_count = Profile.query.count()
            events_count = TimelineEvent.query.count()
            return jsonify({
                "status": "ok",
                "app": "Digital Life Archive",
                "database": "connected",
                "data": {
                    "profiles": profile_count,
                    "timeline_events": events_count,
                    "engine": db.engine.name
                },
                "timestamp": datetime.utcnow().isoformat() + "Z"
            }), 200
        except Exception as e:
            return jsonify({
                "status": "error",
                "message": "Database query failed",
                "details": str(e)
            }), 500

    @app.route('/robots.txt')
    def robots():
        content = "User-agent: *\nAllow: /\nSitemap: " + request.host_url + "sitemap.xml\n"
        return Response(content, mimetype="text/plain")

    @app.route('/sitemap.xml')
    def sitemap():
        pages = [
            '', 'story', 'childhood', 'family', 'education',
            'timeline', 'gallery', 'memories', 'achievements',
            'professional', 'growth', 'future', 'contact'
        ]
        base_url = request.host_url.rstrip('/')
        xml_entries = []
        for p in pages:
            loc = f"{base_url}/{p}" if p else f"{base_url}/"
            xml_entries.append(
                f"  <url>\n    <loc>{loc}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>{'1.0' if not p else '0.8'}</priority>\n  </url>"
            )
        xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + "\n".join(xml_entries) + "\n</urlset>"
        return Response(xml, mimetype="application/xml")

    # Error Handlers
    @app.errorhandler(404)
    def page_not_found(e):
        return render_template('404.html'), 404

    @app.errorhandler(500)
    def internal_server_error(e):
        return render_template('500.html'), 500

    return app

# WSGI Application object for gunicorn: gunicorn app:app
app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    debug = os.environ.get('FLASK_DEBUG', '1') == '1'
    app.run(host='0.0.0.0', port=port, debug=debug)
