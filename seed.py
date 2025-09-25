#!/usr/bin/env python3
"""
ElimuFund Database Seeder

A comprehensive, idempotent database seeding script for the ElimuFund platform.
Supports Flask-SQLAlchemy with realistic test data generation.

Features:
- Auto-detects SQLAlchemy ORM
- Idempotent seeding (no duplicates on re-run)
- Realistic data using Faker
- CLI options for customization
- Transaction safety with rollback on errors
- Verification routine for seeded endpoints
- JSON fixture export

Usage:
    python seed.py                           # Basic seeding
    python seed.py --count-users 20          # More users
    python seed.py --wipe                    # Clear seeded data
    python seed.py --verify                  # Test endpoints
    python seed.py --dry-run                 # Preview without writing

Dependencies:
    pip install -r requirements-dev.txt

Default Test Credentials:
    Admin: test+admin@example.com / Password123!
    User:  test+user@example.com / Password123!
"""

import argparse
import json
import logging
import os
import sys
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Optional, Tuple, Any
import random

# Third-party imports
try:
    from faker import Faker
    import requests
except ImportError as e:
    print(f"Missing dependency: {e}")
    print("Install with: pip install -r requirements-dev.txt")
    sys.exit(1)

# Project imports with fallback detection
try:
    # Try package mode first (when run from project root)
    from server.app import create_app
    from server.models import db, User, StudentProfile, Donation
    from server.config import Config
except ImportError:
    try:
        # Try script mode (when run from server directory)
        from app import create_app
        from models import db, User, StudentProfile, Donation
        from config import Config
    except ImportError as e:
        print(f"Could not import project modules: {e}")
        print("Make sure you're running from the project root or server directory")
        sys.exit(1)

# Initialize Faker
fake = Faker()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class DatabaseSeeder:
    """Main seeder class handling all database operations."""
    
    def __init__(self, app, dry_run: bool = False):
        self.app = app
        self.dry_run = dry_run
        self.created_records = {
            'users': [],
            'student_profiles': [],
            'donations': []
        }
        
    def detect_orm(self) -> str:
        """Detect the ORM being used."""
        if hasattr(db, 'session') and hasattr(db, 'Model'):
            return 'SQLAlchemy'
        else:
            logger.warning("Could not detect ORM, assuming SQLAlchemy")
            return 'SQLAlchemy'
    
    def get_or_create_user(self, email: str, username: str, role: str, password: str) -> Optional[User]:
        """Get existing user or create new one (idempotent)."""
        if self.dry_run:
            logger.info(f"[DRY RUN] Would create user: {email}")
            return None
            
        existing = User.query.filter_by(email=email).first()
        if existing:
            logger.info(f"User already exists: {email}")
            return existing
            
        user = User(
            username=username,
            email=email,
            role=role
        )
        user.password = password
        
        db.session.add(user)
        db.session.flush()  # Get ID without committing
        
        logger.info(f"Created user: {email} (ID: {user.id})")
        self.created_records['users'].append({
            'id': user.id,
            'email': email,
            'username': username,
            'role': role
        })
        
        return user
    
    def get_or_create_student_profile(self, user: User, profile_data: Dict[str, Any]) -> Optional[StudentProfile]:
        """Get existing student profile or create new one."""
        if self.dry_run:
            logger.info(f"[DRY RUN] Would create student profile for: {user.email}")
            return None
            
        if user.student_profile:
            logger.info(f"Student profile already exists for: {user.email}")
            return user.student_profile
            
        profile = StudentProfile(
            user_id=user.id,
            full_name=profile_data['full_name'],
            academic_level=profile_data['academic_level'],
            school_name=profile_data['school_name'],
            fee_amount=profile_data['fee_amount'],
            story=profile_data['story'],
            profile_image=profile_data.get('profile_image', 'https://picsum.photos/seed/' + str(user.id) + '/300/300'),
            is_verified=profile_data.get('is_verified', False)
        )
        
        db.session.add(profile)
        db.session.flush()
        
        logger.info(f"Created student profile: {profile.full_name} (ID: {profile.id})")
        self.created_records['student_profiles'].append({
            'id': profile.id,
            'user_id': user.id,
            'full_name': profile.full_name,
            'school_name': profile.school_name,
            'fee_amount': profile.fee_amount,
            'is_verified': profile.is_verified
        })
        
        return profile
    
    def create_donation(self, donor: User, student_profile: StudentProfile, amount: float, 
                       is_anonymous: bool = False, message: str = "") -> Optional[Donation]:
        """Create a donation record."""
        if self.dry_run:
            logger.info(f"[DRY RUN] Would create donation: ${amount} from {donor.email} to {student_profile.full_name}")
            return None
            
        donation = Donation(
            donor_id=donor.id,
            student_profile_id=student_profile.id,
            amount=amount,
            is_anonymous=is_anonymous,
            message=message,
            payment_method=random.choice(['mpesa', 'card', 'bank']),
            created_at=fake.date_time_between(start_date='-30d', end_date='now')
        )
        
        db.session.add(donation)
        db.session.flush()
        
        logger.info(f"Created donation: ${amount} from {donor.email} to {student_profile.full_name}")
        self.created_records['donations'].append({
            'id': donation.id,
            'donor_id': donor.id,
            'student_profile_id': student_profile.id,
            'amount': amount,
            'is_anonymous': is_anonymous
        })
        
        return donation
    
    def generate_realistic_data(self, count_users: int, count_students: int) -> None:
        """Generate realistic test data."""
        logger.info(f"Generating {count_users} users and {count_students} student profiles...")
        
        # Create test admin user
        admin_user = self.get_or_create_user(
            email="test+admin@example.com",
            username="Test Admin",
            role="admin",
            password="Password123!"
        )
        
        # Create test regular user
        regular_user = self.get_or_create_user(
            email="test+user@example.com",
            username="Test User",
            role="donor",
            password="Password123!"
        )
        
        # Create donor users
        donors = [admin_user, regular_user] if not self.dry_run else []
        for i in range(max(0, count_users - 2)):
            donor = self.get_or_create_user(
                email=f"donor{i+1}@example.com",
                username=fake.name(),
                role="donor",
                password="Password123!"
            )
            if donor:
                donors.append(donor)
        
        # Create student users with profiles
        students = []
        academic_levels = ['primary', 'secondary', 'university']
        school_names = [
            'Starehe Girls Centre', 'Mang\'u High School', 'Alliance Girls High School',
            'Kagumo High School', 'Maseno School', 'Nairobi School',
            'University of Nairobi', 'Kenyatta University', 'Strathmore University'
        ]
        
        for i in range(count_students):
            # Create student user
            student_user = self.get_or_create_user(
                email=f"student{i+1}@example.com",
                username=fake.name(),
                role="student",
                password="Password123!"
            )
            
            if student_user:
                # Create student profile
                academic_level = random.choice(academic_levels)
                fee_amount = random.choice([25000, 35000, 45000, 55000, 75000])
                
                profile_data = {
                    'full_name': fake.name(),
                    'academic_level': academic_level,
                    'school_name': random.choice(school_names),
                    'fee_amount': fee_amount,
                    'story': fake.paragraph(nb_sentences=5) + " " + fake.paragraph(nb_sentences=3),
                    'profile_image': f'https://picsum.photos/seed/student{i+1}/300/300',
                    'is_verified': random.choice([True, True, True, False])  # 75% verified
                }
                
                profile = self.get_or_create_student_profile(student_user, profile_data)
                if profile:
                    students.append(profile)
        
        # Create donations for verified students
        if not self.dry_run and students:
            logger.info("Creating sample donations...")
            verified_students = [s for s in students if s.is_verified]
            
            for student in verified_students:
                # Update amount_raised based on donations
                num_donations = random.randint(2, 8)
                total_raised = 0
                
                for _ in range(num_donations):
                    donor = random.choice(donors)
                    amount = random.choice([1000, 2500, 5000, 10000, 15000])
                    
                    # Don't exceed target amount
                    if total_raised + amount > student.fee_amount:
                        amount = max(0, student.fee_amount - total_raised)
                    
                    if amount > 0:
                        self.create_donation(
                            donor=donor,
                            student_profile=student,
                            amount=amount,
                            is_anonymous=random.choice([True, False]),
                            message=random.choice([
                                "Keep up the good work!",
                                "Education is the key to success",
                                "Proud to support your journey",
                                "All the best in your studies",
                                "You've got this!",
                                ""
                            ])
                        )
                        total_raised += amount
                    
                    if total_raised >= student.fee_amount:
                        break
                
                # Update student's amount_raised
                student.amount_raised = total_raised
        
        # Commit all changes
        if not self.dry_run:
            try:
                db.session.commit()
                logger.info("✅ All changes committed successfully")
            except Exception as e:
                db.session.rollback()
                logger.error(f"❌ Error committing changes: {e}")
                raise
    
    def wipe_seeded_data(self, force: bool = False) -> None:
        """Remove seeded data (with confirmation unless --force)."""
        if not force:
            response = input("⚠️  This will delete all seeded data. Continue? (y/N): ")
            if response.lower() != 'y':
                logger.info("Wipe cancelled")
                return
        
        logger.info("Wiping seeded data...")
        
        try:
            # Delete in reverse dependency order
            Donation.query.delete()
            StudentProfile.query.delete()
            User.query.delete()
            
            db.session.commit()
            logger.info("✅ Seeded data wiped successfully")
            
        except Exception as e:
            db.session.rollback()
            logger.error(f"❌ Error wiping data: {e}")
            raise
    
    def export_fixtures(self) -> None:
        """Export created records to JSON fixture file."""
        if self.dry_run:
            logger.info("[DRY RUN] Would export fixtures")
            return
            
        fixtures_dir = Path("fixtures")
        fixtures_dir.mkdir(exist_ok=True)
        
        fixture_data = {
            'created_at': datetime.utcnow().isoformat(),
            'records': self.created_records,
            'summary': {
                'total_users': len(self.created_records['users']),
                'total_student_profiles': len(self.created_records['student_profiles']),
                'total_donations': len(self.created_records['donations'])
            }
        }
        
        fixture_file = fixtures_dir / "seeded_data.json"
        with open(fixture_file, 'w') as f:
            json.dump(fixture_data, f, indent=2)
        
        logger.info(f"📁 Fixtures exported to: {fixture_file}")
    
    def verify_endpoints(self, base_url: str = "http://localhost:5000") -> bool:
        """Verify that seeded endpoints are working."""
        logger.info("🔍 Verifying endpoints...")
        
        try:
            # Test health endpoint
            response = requests.get(f"{base_url}/api/test", timeout=5)
            if response.status_code != 200:
                logger.error(f"❌ Health check failed: {response.status_code}")
                return False
            logger.info("✅ Health check passed")
            
            # Test login endpoint
            login_data = {
                "email": "test+admin@example.com",
                "password": "Password123!"
            }
            response = requests.post(
                f"{base_url}/api/login",
                json=login_data,
                timeout=5
            )
            if response.status_code != 200:
                logger.error(f"❌ Login failed: {response.status_code}")
                return False
            
            login_response = response.json()
            logger.info("✅ Login successful")
            
            # Test students endpoint
            response = requests.get(f"{base_url}/api/students", timeout=5)
            if response.status_code != 200:
                logger.error(f"❌ Students endpoint failed: {response.status_code}")
                return False
            
            students_data = response.json()
            if not students_data.get('students'):
                logger.error("❌ No students found")
                return False
            
            logger.info(f"✅ Found {len(students_data['students'])} students")
            
            # Test single student endpoint
            first_student_id = students_data['students'][0]['id']
            response = requests.get(f"{base_url}/api/students/{first_student_id}", timeout=5)
            if response.status_code != 200:
                logger.error(f"❌ Student detail endpoint failed: {response.status_code}")
                return False
            
            logger.info("✅ Student detail endpoint working")
            
            logger.info("🎉 All endpoint verifications passed!")
            return True
            
        except requests.exceptions.RequestException as e:
            logger.error(f"❌ Network error during verification: {e}")
            return False
        except Exception as e:
            logger.error(f"❌ Verification error: {e}")
            return False


def load_env_file(env_file: Optional[str]) -> None:
    """Load environment variables from file."""
    if env_file and os.path.exists(env_file):
        from dotenv import load_dotenv
        load_dotenv(env_file)
        logger.info(f"Loaded environment from: {env_file}")


def print_summary(seeder: DatabaseSeeder) -> None:
    """Print seeding summary."""
    print("\n" + "="*60)
    print("🎉 SEEDING COMPLETE")
    print("="*60)
    
    if seeder.dry_run:
        print("📋 DRY RUN - No data was actually written")
    else:
        print(f"👥 Users created: {len(seeder.created_records['users'])}")
        print(f"🎓 Student profiles: {len(seeder.created_records['student_profiles'])}")
        print(f"💰 Donations: {len(seeder.created_records['donations'])}")
    
    print("\n🔑 Test Credentials:")
    print("   Admin: test+admin@example.com / Password123!")
    print("   User:  test+user@example.com / Password123!")
    
    print("\n📡 Example API Calls:")
    print("   # Login to get session")
    print("   curl -X POST http://localhost:5000/api/login \\")
    print("     -H 'Content-Type: application/json' \\")
    print("     -d '{\"email\":\"test+admin@example.com\",\"password\":\"Password123!\"}'")
    print()
    print("   # Get students list")
    print("   curl http://localhost:5000/api/students")
    print()
    print("   # Get student details (replace :id with actual ID)")
    print("   curl http://localhost:5000/api/students/:id")
    
    print("\n" + "="*60)


def main():
    """Main CLI entry point."""
    parser = argparse.ArgumentParser(
        description="ElimuFund Database Seeder",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python seed.py                           # Basic seeding
  python seed.py --count-users 20          # More users
  python seed.py --wipe                    # Clear seeded data
  python seed.py --verify                  # Test endpoints
  python seed.py --dry-run                 # Preview without writing
  python seed.py --env-file .env.prod      # Use custom env file
        """
    )
    
    parser.add_argument('--count-users', type=int, default=10,
                       help='Number of users to create (default: 10)')
    parser.add_argument('--count-items', type=int, default=5,
                       help='Number of student profiles to create (default: 5)')
    parser.add_argument('--env-file', type=str,
                       help='Path to .env file to load')
    parser.add_argument('--wipe', action='store_true',
                       help='Delete seeded data')
    parser.add_argument('--force', action='store_true',
                       help='Skip confirmations')
    parser.add_argument('--dry-run', action='store_true',
                       help='Show what would be created without writing')
    parser.add_argument('--verify', action='store_true',
                       help='Verify seeded endpoints are working')
    parser.add_argument('--log-level', choices=['DEBUG', 'INFO', 'WARNING', 'ERROR'],
                       default='INFO', help='Logging level')
    
    args = parser.parse_args()
    
    # Set logging level
    logging.getLogger().setLevel(getattr(logging, args.log_level))
    
    # Load environment file if specified
    load_env_file(args.env_file)
    
    # Create Flask app
    app = create_app()
    
    with app.app_context():
        seeder = DatabaseSeeder(app, dry_run=args.dry_run)
        
        try:
            if args.wipe:
                seeder.wipe_seeded_data(force=args.force)
            else:
                # Generate data
                seeder.generate_realistic_data(
                    count_users=args.count_users,
                    count_students=args.count_items
                )
                
                # Export fixtures
                seeder.export_fixtures()
                
                # Print summary
                print_summary(seeder)
            
            # Run verification if requested
            if args.verify:
                success = seeder.verify_endpoints()
                if not success:
                    sys.exit(1)
                    
        except Exception as e:
            logger.error(f"❌ Seeding failed: {e}")
            if not args.dry_run:
                db.session.rollback()
            sys.exit(1)


if __name__ == '__main__':
    main()
