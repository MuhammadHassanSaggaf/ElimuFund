from flask import Blueprint, request, jsonify, session
try:
    from ..models import db, User, StudentProfile
    from ..utils.decorators import login_required, donor_required
except ImportError:
    from models import db, User, StudentProfile
    from utils.decorators import login_required, donor_required

supporters_bp = Blueprint('supporters', __name__)

@supporters_bp.route('/api/students/<int:student_id>/follow', methods=['POST'])
@login_required
@donor_required
def follow_student(student_id):
    """Follow a student"""
    try:
        # Get current user
        current_user = User.query.get(session['user_id'])
        
        # Get student profile
        student = StudentProfile.query.get(student_id)
        if not student:
            return jsonify({'error': 'Student not found'}), 404
        
        # Check if already following
        if current_user.supported_students.filter_by(id=student_id).first():
            return jsonify({'error': 'Already following this student'}), 400
        
        # Add to supported students
        current_user.supported_students.append(student)
        db.session.commit()
        
        return jsonify({
            'message': f'Successfully following {student.full_name}',
            'is_following': True
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@supporters_bp.route('/api/students/<int:student_id>/unfollow', methods=['DELETE'])
@login_required
@donor_required
def unfollow_student(student_id):
    """Unfollow a student"""
    try:
        # Get current user
        current_user = User.query.get(session['user_id'])
        
        # Get student profile
        student = StudentProfile.query.get(student_id)
        if not student:
            return jsonify({'error': 'Student not found'}), 404
        
        # Check if following
        if not current_user.supported_students.filter_by(id=student_id).first():
            return jsonify({'error': 'Not following this student'}), 400
        
        # Remove from supported students
        current_user.supported_students.remove(student)
        db.session.commit()
        
        return jsonify({
            'message': f'Successfully unfollowed {student.full_name}',
            'is_following': False
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@supporters_bp.route('/api/my-followed-students', methods=['GET'])
@login_required
@donor_required
def get_my_followed_students():
    """Get all students the current donor is following"""
    try:
        # Get current user
        current_user = User.query.get(session['user_id'])
        
        # Get followed students
        followed_students = current_user.supported_students.all()
        
        students_data = []
        for student in followed_students:
            student_data = student.to_dict_full(current_user.id)
            student_data['is_following'] = True
            students_data.append(student_data)
        
        return jsonify({
            'students': students_data,
            'count': len(students_data)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@supporters_bp.route('/api/students/<int:student_id>/supporters', methods=['GET'])
@login_required
def get_student_supporters(student_id):
    """Get all supporters of a specific student"""
    try:
        # Get student profile
        student = StudentProfile.query.get(student_id)
        if not student:
            return jsonify({'error': 'Student not found'}), 404
        
        # Get supporters
        supporters = student.supporters.all()
        
        supporters_data = []
        for supporter in supporters:
            supporter_data = {
                'id': supporter.id,
                'username': supporter.username,
                'email': supporter.email,
                'role': supporter.role
            }
            supporters_data.append(supporter_data)
        
        return jsonify({
            'supporters': supporters_data,
            'count': len(supporters_data)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@supporters_bp.route('/api/students/<int:student_id>/following-status', methods=['GET'])
@login_required
def check_following_status(student_id):
    """Check if current user is following a specific student"""
    try:
        # Get current user
        current_user = User.query.get(session['user_id'])
        
        # Get student profile
        student = StudentProfile.query.get(student_id)
        if not student:
            return jsonify({'error': 'Student not found'}), 404
        
        # Check if following
        is_following = current_user.supported_students.filter_by(id=student_id).first() is not None
        
        return jsonify({
            'is_following': is_following,
            'student_id': student_id
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
