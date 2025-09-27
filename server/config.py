import os
from dotenv import load_dotenv

# Load environment variables
basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, '.env'))

class Config:
    # Basic Flask config
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-123'
    
    # Database config
    # Use PostgreSQL for production, SQLite for development
    if os.environ.get('DATABASE_URL'):
        # Production: Use PostgreSQL from environment variable
        SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
        print(f"🔗 Using PostgreSQL database: {SQLALCHEMY_DATABASE_URI[:20]}...")
    else:
        # Development: Use SQLite
        SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'elimufund.db')
        print(f"🔗 Using SQLite database: {SQLALCHEMY_DATABASE_URI}")
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Session config
    SESSION_TYPE = 'filesystem'
    PERMANENT_SESSION_LIFETIME = 86400 
    # Dev cookie settings for cross-site (proxy preferred, but safe to keep)
    SESSION_COOKIE_SAMESITE = 'Lax'
    SESSION_COOKIE_SECURE = False