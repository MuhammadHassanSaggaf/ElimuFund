# server/routes/donation_routes.py
from flask import Blueprint, request, jsonify, session
from ..models import db, User, StudentProfile, Donation
from ..utils.decorators import login_required
from datetime import datetime

donation_bp = Blueprint('donations', __name__, url_prefix='/api')

@donation_bp.route('/donations', methods=['POST'])
@login_required
def create_donation():
    """Create a new donation"""
    try:
        data = request.get_json()
        user = User.query.get(session['user_id'])
        
        # Verify donor role
        if user.role != 'donor':
            return jsonify({'error': 'Only donors can make donations'}), 403
        
        # Verify student exists and is verified
        student = StudentProfile.query.get(data['student_id'])
        if not student:
            return jsonify({'error': 'Student not found'}), 404
        if not student.is_verified:
            return jsonify({'error': 'Student not verified'}), 400
        
        # Create donation
        new_donation = Donation(
            donor_id=user.id,
            student_profile_id=student.id,
            amount=float(data['amount']),
            is_anonymous=data.get('anonymous', False),
            message=data.get('message', ''),
            payment_method=data.get('paymentMethod', 'mpesa')
        )
        
        # Update student's amount_raised
        student.amount_raised += float(data['amount'])
        
        db.session.add(new_donation)
        db.session.commit()
        
        return jsonify({
            'message': 'Donation successful',
            'donation': new_donation.to_dict_with_details()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@donation_bp.route('/donations', methods=['GET'])
@login_required
def get_my_donations():
    """Get logged-in user's donations"""
    try:
        user = User.query.get(session['user_id'])
        
        if user.role != 'donor':
            return jsonify({'error': 'Only donors can view donations'}), 403
        
        donations = Donation.query.filter_by(donor_id=user.id).order_by(Donation.created_at.desc()).all()
        
        return jsonify({
            'donations': [d.to_dict_with_details() for d in donations],
            'total_donated': sum(d.amount for d in donations),
            'students_supported': len(set(d.student_profile_id for d in donations))
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@donation_bp.route('/my-students', methods=['GET'])
@login_required
def get_supported_students():
    """Get list of students the donor has supported"""
    try:
        user = User.query.get(session['user_id'])
        
        if user.role != 'donor':
            return jsonify({'error': 'Only donors can view this'}), 403
        
        # Get unique students donated to
        donated_student_ids = db.session.query(Donation.student_profile_id).filter_by(
            donor_id=user.id
        ).distinct().all()
        
        supported_students = []
        for (student_id,) in donated_student_ids:
            student = StudentProfile.query.get(student_id)
            total_donated = sum(d.amount for d in student.donations if d.donor_id == user.id)
            
            supported_students.append({
                **student.to_dict_full(),
                'my_total_donation': total_donated,
                'my_donation_count': len([d for d in student.donations if d.donor_id == user.id])
            })
        
        return jsonify({
            'students': supported_students,
            'count': len(supported_students)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@donation_bp.route('/donations/<int:id>', methods=['DELETE'])
@login_required
def cancel_donation(id):
    """Cancel a donation (within 24 hours only)"""
    try:
        donation = Donation.query.get(id)
        if not donation:
            return jsonify({'error': 'Donation not found'}), 404
        
        # Check ownership
        if donation.donor_id != session['user_id']:
            return jsonify({'error': 'Unauthorized'}), 403
        
        # Check time limit (24 hours)
        time_diff = datetime.utcnow() - donation.created_at
        if time_diff.total_seconds() > 86400:  # 24 hours
            return jsonify({'error': 'Cannot cancel after 24 hours'}), 400
        
        # Update student's amount_raised
        student = donation.student_profile
        student.amount_raised -= donation.amount
        
        db.session.delete(donation)
        db.session.commit()
        
        return jsonify({'message': 'Donation cancelled successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400