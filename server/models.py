# server/models.py
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

# Many-to-Many Association Table
# User-StudentProfile Supporters (Donors following/supporting students)
user_student_supporters = db.Table('user_student_supporters',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('student_profile_id', db.Integer, db.ForeignKey('student_profiles.id'), primary_key=True),
    db.Column('followed_at', db.DateTime, default=datetime.utcnow)
)

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    
    # Columns
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    _password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.Enum('admin', 'donor', 'student', name='user_roles'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    student_profile = db.relationship('StudentProfile', back_populates='user', uselist=False, cascade='all, delete-orphan')
    donations = db.relationship('Donation', back_populates='donor', cascade='all, delete-orphan')
    
    # Many-to-Many Relationship
    supported_students = db.relationship('StudentProfile', 
                                       secondary=user_student_supporters, 
                                       back_populates='supporters',
                                       lazy='dynamic')
    
    # Serialization rules
    serialize_rules = ('-_password_hash', '-student_profile.user', '-donations.donor')
    
    # Password property
    @property
    def password(self):
        raise AttributeError('Password is not readable')
    
    @password.setter
    def password(self, password):
        self._password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self._password_hash, password)
    
    # Validations
    @validates('email')
    def validate_email(self, key, email):
        if '@' not in email:
            raise ValueError('Invalid email address')
        return email
    
    @validates('username')
    def validate_username(self, key, username):
        if len(username) < 3:
            raise ValueError('Username must be at least 3 characters')
        return username
    
    def to_dict_basic(self):
        """Return basic user info without sensitive data"""
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
    def __repr__(self):
        return f'<User {self.username}>'


class StudentProfile(db.Model, SerializerMixin):
    __tablename__ = 'student_profiles'
    
    # Columns
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True, nullable=False)
    full_name = db.Column(db.String(100), nullable=False)
    academic_level = db.Column(db.String(50), nullable=False)
    school_name = db.Column(db.String(100), nullable=False)
    fee_amount = db.Column(db.Float, nullable=False)
    amount_raised = db.Column(db.Float, default=0.0)
    story = db.Column(db.Text, nullable=False)
    profile_image = db.Column(db.String(200), default='/api/placeholder/300/300')
    is_verified = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User', back_populates='student_profile')
    donations = db.relationship('Donation', back_populates='student_profile', cascade='all, delete-orphan')
    
    # Many-to-Many Relationship
    supporters = db.relationship('User', 
                               secondary=user_student_supporters, 
                               back_populates='supported_students',
                               lazy='dynamic')
    
    # Serialization rules
    serialize_rules = ('-user.student_profile', '-donations.student_profile', '-user._password_hash')
    
    # Validations
    @validates('fee_amount')
    def validate_fee_amount(self, key, amount):
        if amount <= 0:
            raise ValueError('Fee amount must be positive')
        return amount
    
    @validates('story')
    def validate_story(self, key, story):
        if len(story) < 50:
            raise ValueError('Story must be at least 50 characters')
        return story
    
    def to_dict_full(self, current_user_id=None):
        """Return full student profile with user info"""
        # Get followers count
        followers_count = self.supporters.count()
        
        # Check if current user is following this student
        is_following = False
        if current_user_id:
            current_user = User.query.get(current_user_id)
            if current_user and current_user.role == 'donor':
                is_following = current_user.supported_students.filter_by(id=self.id).first() is not None
        
        return {
            'id': self.id,
            'user_id': self.user_id,
            'full_name': self.full_name,
            'academic_level': self.academic_level,
            'school_name': self.school_name,
            'fee_amount': self.fee_amount,
            'amount_raised': self.amount_raised,
            'story': self.story,
            'profile_image': self.profile_image,
            'is_verified': self.is_verified,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'percentage_raised': (self.amount_raised / self.fee_amount * 100) if self.fee_amount > 0 else 0,
            'remaining_amount': self.fee_amount - self.amount_raised,
            'followers_count': followers_count,
            'is_following': is_following
        }
    
    def __repr__(self):
        return f'<StudentProfile {self.full_name}>'


class Donation(db.Model, SerializerMixin):
    __tablename__ = 'donations'
    
    # Columns
    id = db.Column(db.Integer, primary_key=True)
    donor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    student_profile_id = db.Column(db.Integer, db.ForeignKey('student_profiles.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    is_anonymous = db.Column(db.Boolean, default=False)
    message = db.Column(db.String(250))
    payment_method = db.Column(db.String(50), default='mpesa')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    donor = db.relationship('User', back_populates='donations')
    student_profile = db.relationship('StudentProfile', back_populates='donations')
    
    # Serialization rules
    serialize_rules = ('-donor.donations', '-student_profile.donations', '-donor._password_hash')
    
    # Validations
    @validates('amount')
    def validate_amount(self, key, amount):
        if amount <= 0:
            raise ValueError('Donation amount must be positive')
        return amount
    
    def to_dict_with_details(self):
        """Return donation with donor and student details"""
        return {
            'id': self.id,
            'amount': self.amount,
            'is_anonymous': self.is_anonymous,
            'message': self.message,
            'payment_method': self.payment_method,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'donor': {
                'username': self.donor.username if not self.is_anonymous else 'Anonymous',
                'email': self.donor.email if not self.is_anonymous else None
            },
            'student': {
                'id': self.student_profile.id,
                'full_name': self.student_profile.full_name,
                'school_name': self.student_profile.school_name
            }
        }
    
    def __repr__(self):
        return f'<Donation ${self.amount} to {self.student_profile_id}>'