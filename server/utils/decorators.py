from functools import wraps
from flask import session, jsonify
from models import User

def login_required(func):
    """Require an authenticated user (any role)."""
    @wraps(func)
    def wrapper(*args, **kwargs):
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'error': 'Authentication required'}), 401
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'Invalid session'}), 401
        return func(*args, **kwargs)
    return wrapper

def admin_required(func):
    """Require a logged-in admin user."""
    @wraps(func)
    def wrapper(*args, **kwargs):
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'error': 'Authentication required'}), 401
        user = User.query.get(user_id)
        if not user or user.role != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        return func(*args, **kwargs)
    return wrapper

def student_required(func):
    """Require a logged-in student user."""
    @wraps(func)
    def wrapper(*args, **kwargs):
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'error': 'Authentication required'}), 401
        user = User.query.get(user_id)
        if not user or user.role != 'student':
            return jsonify({'error': 'Student access required'}), 403
        return func(*args, **kwargs)
    return wrapper