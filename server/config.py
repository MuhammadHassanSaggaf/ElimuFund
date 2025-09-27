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
        # Convert postgresql:// to postgresql+psycopg:// for psycopg3 compatibility
        database_url = os.environ.get('DATABASE_URL')
        if database_url.startswith('postgresql://'):
            database_url = database_url.replace('postgresql://', 'postgresql+psycopg://', 1)
        SQLALCHEMY_DATABASE_URI = database_url
        print(f"🔗 Using PostgreSQL database: {SQLALCHEMY_DATABASE_URI[:20]}...")
    else:
        # Development: Use SQLite
        SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'elimufund.db')
        print(f"🔗 Using SQLite database: {SQLALCHEMY_DATABASE_URI}")
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Session config
    SESSION_TYPE = 'filesystem'
    PERMANENT_SESSION_LIFETIME = 86400 
    
    # Production session settings
    if os.environ.get('DATABASE_URL'):
        # Production: Secure session cookies
        SESSION_COOKIE_SAMESITE = 'None'
        SESSION_COOKIE_SECURE = True
        SESSION_COOKIE_HTTPONLY = True
    else:
        # Development: Relaxed session cookies
        SESSION_COOKIE_SAMESITE = 'Lax'
        SESSION_COOKIE_SECURE = False