import os
from pathlib import Path
from dotenv import load_dotenv

# Base directory of the application
BASE_DIR = Path(__file__).resolve().parent

# Load environment variables from .env if present
load_dotenv(BASE_DIR / '.env')

class Config:
    """Base application configuration."""
    SECRET_KEY = os.environ.get('SECRET_KEY', 'default-digital-life-archive-secret-key-2026')

    # Database Configuration: SQLite default, PostgreSQL ready
    database_url = os.environ.get('DATABASE_URL')
    if database_url:
        # Normalize legacy Heroku/Render postgres:// URI scheme to postgresql://
        if database_url.startswith("postgres://"):
            database_url = database_url.replace("postgres://", "postgresql://", 1)
        SQLALCHEMY_DATABASE_URI = database_url
    else:
        # Default SQLite path inside instance folder
        instance_dir = BASE_DIR / 'instance'
        instance_dir.mkdir(exist_ok=True)
        SQLALCHEMY_DATABASE_URI = f"sqlite:///{instance_dir / 'database.db'}"

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # File upload configurations
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB max upload
    UPLOAD_FOLDER = os.path.join(BASE_DIR, 'static', 'uploads')
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}

    # App Identity
    APP_NAME = "Digital Life Archive"
    APP_VERSION = "1.0.0"
