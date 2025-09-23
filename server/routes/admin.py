# server/routes/admin_routes.py
from flask import Blueprint, request, jsonify, session
from ..models import db, User, StudentProfile, Donation
from ..utils.decorators import admin_required

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

@admin_bp.route('/students/pending', methods=['GET'])
@admin_required
def get_pending_students():
    """Get all unverified student profiles"""
    try:
        pending = StudentProfile.query.filter_by(is_verified=False).all()
        return jsonify({
            'students': [s.to_dict_full() for s in pending],
            'count': len(pending)
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@admin_bp.route('/students/<int:id>/verify', methods=['PATCH'])
@admin_required
def verify_student(id):
    """Verify or reject a student profile"""
    try:
        student = StudentProfile.query.get(id)
        if not student:
            return jsonify({'error': 'Student not found'}), 404
        
        data = request.get_json()
        action = data.get('action', 'approve')  # 'approve' or 'reject'
        
        if action == 'approve':
            student.is_verified = True
            message = 'Student verified successfully'
        else:
            student.is_verified = False
            message = 'Student rejected'
        
        db.session.commit()
        
        return jsonify({
            'message': message,
            'student': student.to_dict_full()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@admin_bp.route('/dashboard-stats', methods=['GET'])
@admin_required
def get_admin_stats():
    """Get admin dashboard statistics"""
    try:
        total_students = StudentProfile.query.count()
        verified_students = StudentProfile.query.filter_by(is_verified=True).count()
        pending_students = StudentProfile.query.filter_by(is_verified=False).count()
        total_donors = User.query.filter_by(role='donor').count()
        total_donations = Donation.query.count()
        total_amount_raised = db.session.query(db.func.sum(Donation.amount)).scalar() or 0
        
        return jsonify({
            'total_students': total_students,
            'verified_students': verified_students,
            'pending_students': pending_students,
            'total_donors': total_donors,
            'total_donations': total_donations,
            'total_amount_raised': total_amount_raised
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@admin_bp.route('/donations', methods=['GET'])
@admin_required
def get_all_donations():
    """Get all donations (admin view)"""
    try:
        donations = Donation.query.order_by(Donation.created_at.desc()).all()
        return jsonify({
            'donations': [d.to_dict_with_details() for d in donations],
            'count': len(donations),
            'total_amount': sum(d.amount for d in donations)
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@admin_bp.route('/users', methods=['GET'])
@admin_required
def get_all_users():
    """Get all users (admin view)"""
    try:
        users = User.query.all()
        return jsonify({
            'users': [u.to_dict_basic() for u in users],
            'count': len(users)
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400