"""
Database configuration with fallback handling for different environments.
"""
import os
from sqlalchemy import create_engine
from sqlalchemy.engine import Engine

def get_database_url():
    """Get the appropriate database URL based on environment."""
    if os.environ.get('DATABASE_URL'):
        # Production: Use PostgreSQL
        return os.environ.get('DATABASE_URL')
    else:
        # Development: Use SQLite
        basedir = os.path.abspath(os.path.dirname(__file__))
        return 'sqlite:///' + os.path.join(basedir, 'elimufund.db')

def create_database_engine():
    """Create database engine with proper error handling."""
    try:
        database_url = get_database_url()
        print(f"🔗 Connecting to database: {database_url[:30]}...")
        
        # Create engine with appropriate settings
        if database_url.startswith('postgresql://'):
            # PostgreSQL settings
            engine = create_engine(
                database_url,
                pool_pre_ping=True,
                pool_recycle=300,
                echo=False
            )
            print("✅ PostgreSQL engine created successfully")
        else:
            # SQLite settings
            engine = create_engine(
                database_url,
                echo=False
            )
            print("✅ SQLite engine created successfully")
        
        return engine
        
    except ImportError as e:
        if 'psycopg2' in str(e):
            print("❌ PostgreSQL driver not found. Installing psycopg2-binary...")
            print("💡 Make sure psycopg2-binary is in requirements.txt")
            raise Exception("PostgreSQL driver (psycopg2-binary) not installed. Please add it to requirements.txt")
        else:
            raise e
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        raise e

def test_database_connection():
    """Test the database connection."""
    try:
        engine = create_database_engine()
        with engine.connect() as conn:
            result = conn.execute("SELECT 1")
            print("✅ Database connection test successful")
            return True
    except Exception as e:
        print(f"❌ Database connection test failed: {e}")
        return False
