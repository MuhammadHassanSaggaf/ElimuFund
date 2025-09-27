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
    # Allow both localhost (development) and production origins
    allowed_origins = [
        "http://localhost:3000",  # Development
        "https://elimu-fund-rho.vercel.app",  # Vercel production frontend
        "https://elimufund.onrender.com",  # Render production frontend
        "https://elimufund-client.onrender.com"  # Alternative production URL
    ]
    
    CORS(app, 
        resources={r"/api/*": {"origins": allowed_origins}},
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
    
    # Debug session route
    @app.route('/api/debug-session')
    def debug_session():
        return {
            'session_data': dict(session),
            'user_id': session.get('user_id'),
            'user_role': session.get('user_role')
        }, 200
    
    # Debug users route
    @app.route('/api/debug-users')
    def debug_users():
        from .models import User
        users = User.query.all()
        return {
            'users': [{
                'id': u.id,
                'username': u.username,
                'email': u.email,
                'role': u.role,
                'password_hash_length': len(u._password_hash) if u._password_hash else 0
            } for u in users]
        }, 200
    
    # Database update route (for fixing schema issues)
    @app.route('/api/update-db', methods=['POST'])
    def update_database():
        try:
            from .update_database import update_database_schema
            success = update_database_schema()
            if success:
                return {'message': 'Database schema updated successfully!'}, 200
            else:
                return {'error': 'Database schema update failed'}, 500
        except Exception as e:
            return {'error': str(e)}, 500
    
    return app

if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        # Initialize database tables
        print("🔧 Initializing database...")
        db.create_all()
        print("✅ Database initialized successfully!")
    
    # Get port from environment variable (for deployment) or default to 5000
    port = int(os.environ.get('PORT', 5000))
    # Bind to 0.0.0.0 for deployment compatibility
    app.run(host='0.0.0.0', port=port, debug=True)