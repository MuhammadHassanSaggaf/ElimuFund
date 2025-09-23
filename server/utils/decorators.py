import importlib
from functools import wraps
from flask import session, jsonify

def _get_user_model():
    """
    Try to import the User model from 'server.models' (package mode) first,
    and fall back to 'models' (top-level) for other run modes.
    """
    for mod_name in ('server.models', 'models'):
        try:
            mod = importlib.import_module(mod_name)
            return mod.User
        except ModuleNotFoundError:
            continue
    raise ModuleNotFoundError("Could not import User model from 'server.models' or 'models'")

def login_required(func):
    """Require an authenticated user (any role)."""
    @wraps(func)
    def wrapper(*args, **kwargs):
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'error': 'Authentication required'}), 401
        User = _get_user_model()
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
        User = _get_user_model()
        user = User.query.get(user_id)
        if not user or getattr(user, 'role', None) != 'admin':
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
        User = _get_user_model()
        user = User.query.get(user_id)
        if not user or getattr(user, 'role', None) != 'student':
            return jsonify({'error': 'Student access required'}), 403
        return func(*args, **kwargs)
    return wrapper