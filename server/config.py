import os
from dotenv import load_dotenv

# Load environment variables
basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, '.env'))

class Config:
    # Basic Flask config
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-123'
    
    # Database config
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(basedir, 'elimufund.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Session config
    SESSION_TYPE = 'filesystem'
    PERMANENT_SESSION_LIFETIME = 86400 