#!/usr/bin/env python3
"""
Database initialization script for production deployment.
This script creates the database tables and optionally seeds them with data.
"""

import os
import sys
from flask import Flask

# Add the server directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from models import db, User, StudentProfile, Donation, Supporter

def init_database():
    """Initialize the database with tables and seed data."""
    app = create_app()
    
    with app.app_context():
        print("Creating database tables...")
        db.create_all()
        print("✅ Database tables created successfully!")
        
        # Check if we have any users
        user_count = User.query.count()
        print(f"📊 Current users in database: {user_count}")
        
        if user_count == 0:
            print("🌱 Database is empty. You may want to seed it with data.")
            print("💡 To seed the database, run: python seed.py")
        else:
            print("✅ Database already has data!")
        
        print("🎉 Database initialization complete!")

if __name__ == '__main__':
    init_database()
