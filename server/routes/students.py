# server/routes/student_routes.py
from flask import Blueprint, request, jsonify, session
try:
    from ..models import db, User, StudentProfile
    from ..utils.decorators import login_required, student_required
except ImportError:
    from models import db, User, StudentProfile
    from utils.decorators import login_required, student_required
from sqlalchemy import func

student_bp = Blueprint('students', __name__, url_prefix='/api')

@student_bp.route('/students', methods=['GET'])
def get_all_students():
    """Get all verified students (public endpoint)"""
    try:
        # Get query parameters for filtering
        verified_only = request.args.get('verified', 'true').lower() == 'true'
        
        query = StudentProfile.query
        if verified_only:
            query = query.filter_by(is_verified=True)
        
        # Randomize order for fairness
        students = query.order_by(func.random()).all()
        
        return jsonify({
            'students': [s.to_dict_full() for s in students],
            'count': len(students)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@student_bp.route('/students/<int:id>', methods=['GET'])
def get_student_by_id(id):
    """Get single student details (public endpoint)"""
    try:
        student = StudentProfile.query.get(id)
        if not student:
            return jsonify({'error': 'Student not found'}), 404
        
        # Get recent donations for this student
        recent_donations = []
        for donation in student.donations[-5:]:  # Last 5 donations
            recent_donations.append({
                'amount': donation.amount,
                'created_at': donation.created_at.isoformat(),
                'is_anonymous': donation.is_anonymous,
                'donor': donation.donor.username if not donation.is_anonymous else 'Anonymous'
            })
        
        student_data = student.to_dict_full()
        student_data['recent_donations'] = recent_donations
        student_data['total_donors'] = len(student.donations)
        
        return jsonify(student_data), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@student_bp.route('/student-profiles', methods=['POST'])
@login_required
def create_student_profile():
    """Create student profile for logged-in student user"""
    try:
        # Check if user is a student
        user = User.query.get(session['user_id'])
        if user.role != 'student':
            return jsonify({'error': 'Only students can create profiles'}), 403
        
        # Check if profile already exists
        if user.student_profile:
            return jsonify({'error': 'Profile already exists'}), 400
        
        data = request.get_json()
        
        new_profile = StudentProfile(
            user_id=user.id,
            full_name=data['full_name'],
            academic_level=data['academic_level'],
            school_name=data['school_name'],
            fee_amount=float(data['fee_amount']),
            story=data['story'],
            profile_image=data.get('profile_image', '/api/placeholder/300/300')
        )
        
        db.session.add(new_profile)
        db.session.commit()
        
        return jsonify({
            'message': 'Student profile created successfully',
            'profile': new_profile.to_dict_full()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@student_bp.route('/student-profiles/<int:id>', methods=['PATCH'])
@login_required
def update_student_profile(id):
    """Update student profile (student owner or admin only)"""
    try:
        student = StudentProfile.query.get(id)
        if not student:
            return jsonify({'error': 'Student profile not found'}), 404
        
        # Check permission
        user = User.query.get(session['user_id'])
        if user.role != 'admin' and student.user_id != user.id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        data = request.get_json()
        
        # Update allowed fields
        if 'full_name' in data:
            student.full_name = data['full_name']
        if 'academic_level' in data:
            student.academic_level = data['academic_level']
        if 'school_name' in data:
            student.school_name = data['school_name']
        if 'fee_amount' in data:
            student.fee_amount = float(data['fee_amount'])
        if 'story' in data:
            student.story = data['story']
        if 'profile_image' in data:
            student.profile_image = data['profile_image']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Profile updated successfully',
            'profile': student.to_dict_full()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@student_bp.route('/my-profile', methods=['GET'])
@login_required
def get_my_profile():
    """Get logged-in student's profile"""
    try:
        user = User.query.get(session['user_id'])
        if user.role != 'student':
            return jsonify({'error': 'Not a student'}), 403
        
        if not user.student_profile:
            return jsonify({'error': 'No profile found'}), 404
        
        return jsonify(user.student_profile.to_dict_full()), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400