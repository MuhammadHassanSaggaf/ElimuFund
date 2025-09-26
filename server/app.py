# server/app.py
from flask import Flask, session
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
import os

# Support both package and script run modes for imports
try:
    from .config import Config
    from .models import db
    from .routes.auth import auth_bp
    from .routes.students import student_bp
    from .routes.donations import donation_bp
    from .routes.admin import admin_bp
    from .routes.supporters import supporters_bp
except ImportError:
    from config import Config
    from models import db
    from routes.auth import auth_bp
    from routes.students import student_bp
    from routes.donations import donation_bp
    from routes.admin import admin_bp
    from routes.supporters import supporters_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize extensions
    db.init_app(app)
    migrate = Migrate(app, db)
    
    # Configure CORS - CRITICAL for frontend connection
    CORS(app, 
        resources={r"/api/*": {"origins": "http://localhost:3000"}},
        supports_credentials=True,
        allow_headers=["Content-Type"],
        methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"])
    
    # Register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(student_bp)
    app.register_blueprint(donation_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(supporters_bp)
    
    # Test route
    @app.route('/api/test')
    def test():
        return {'message': 'Backend is connected!'}, 200
    
    return app

if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        db.create_all()  # Create tables if they don't exist
    app.run(port=5000, debug=True)