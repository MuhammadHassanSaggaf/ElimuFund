# server/routes/auth_routes.py
from flask import Blueprint, request, jsonify, session
from models import db, User, StudentProfile
from werkzeug.security import generate_password_hash

auth_bp = Blueprint('auth', __name__, url_prefix='/api')

@auth_bp.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        
        # Check if email exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already registered'}), 400
        
        # Create new user
        new_user = User(
            username=data['fullName'],
            email=data['email'],
            role=data['userType']
        )
        new_user.password = data['password']  # Uses setter to hash
        
        db.session.add(new_user)
        db.session.commit()
        
        # Set session
        session['user_id'] = new_user.id
        session['user_role'] = new_user.role
        session.permanent = True
        
        return jsonify({
            'message': 'User created successfully',
            'user': new_user.to_dict_basic()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        # Find user by email
        user = User.query.filter_by(email=data['email']).first()
        
        if not user or not user.check_password(data['password']):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        # Set session
        session['user_id'] = user.id
        session['user_role'] = user.role
        session.permanent = True
        
        # Return user data with student profile if exists
        user_data = user.to_dict_basic()
        if user.role == 'student' and user.student_profile:
            user_data['student_profile'] = user.student_profile.to_dict_full()
        
        return jsonify({
            'message': 'Login successful',
            'user': user_data
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@auth_bp.route('/logout', methods=['DELETE'])
def logout():
    session.clear()
    return jsonify({'message': 'Logged out successfully'}), 200

@auth_bp.route('/check-session', methods=['GET'])
def check_session():
    if 'user_id' in session:
        user = User.query.get(session['user_id'])
        if user:
            user_data = user.to_dict_basic()
            if user.role == 'student' and user.student_profile:
                user_data['student_profile'] = user.student_profile.to_dict_full()
            return jsonify({
                'authenticated': True,
                'user': user_data
            }), 200
    
    return jsonify({'authenticated': False}), 401