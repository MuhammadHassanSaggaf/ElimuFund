# server/seed.py
from app import create_app
from models import db, User, StudentProfile, Donation
from datetime import datetime, timedelta
import random

def seed_database():
    app = create_app()
    with app.app_context():
        # Clear existing data
        print("Clearing existing data...")
        db.drop_all()
        db.create_all()
        
        # Create admin user
        print("Creating admin user...")
        admin = User(
            username="Admin User",
            email="admin@elimufund.com",
            role="admin"
        )
        admin.password = "password123"
        db.session.add(admin)
        
        # Create donor users
        print("Creating donor users...")
        donors = []
        for i in range(5):
            donor = User(
                username=f"Donor {i+1}",
                email=f"donor{i+1}@example.com",
                role="donor"
            )
            donor.password = "password123"
            donors.append(donor)
            db.session.add(donor)
        
        # Create student users with profiles
        print("Creating student users and profiles...")
        students_data = [
            {
                "username": "Alice Wanjiku",
                "email": "alice@example.com",
                "full_name": "Alice Wanjiku",
                "academic_level": "Form 2",
                "school_name": "Starehe Girls Centre",
                "fee_amount": 45000,
                "amount_raised": 32000,
                "story": "Alice is a bright student from Mathare slums who dreams of becoming a doctor. Despite financial challenges, she consistently ranks top 3 in her class. Her mother works as a house help to support Alice and her two younger siblings. Alice needs support to continue her secondary education and achieve her dream of joining medical school.",
                "is_verified": True
            },
            {
                "username": "John Kimani",
                "email": "john@example.com",
                "full_name": "John Kimani",
                "academic_level": "Form 4",
                "school_name": "Mang'u High School",
                "fee_amount": 38000,
                "amount_raised": 15000,
                "story": "John is a talented student passionate about engineering. He comes from a single-parent household in Kibera. His determination and academic excellence have earned him a place in one of Kenya's top schools, but financial constraints threaten his education.",
                "is_verified": True
            },
            {
                "username": "Grace Achieng",
                "email": "grace@example.com",
                "full_name": "Grace Achieng",
                "academic_level": "Form 1",
                "school_name": "Alliance Girls High School",
                "fee_amount": 42000,
                "amount_raised": 8000,
                "story": "Grace is a brilliant young girl who scored 410 marks in KCPE despite studying under a kerosene lamp. She dreams of becoming a lawyer to help her community. Grace's father is a casual laborer and her mother sells vegetables at the local market.",
                "is_verified": True
            },
            {
                "username": "Peter Oduor",
                "email": "peter@example.com",
                "full_name": "Peter Oduor",
                "academic_level": "Form 3",
                "school_name": "Kagumo High School",
                "fee_amount": 35000,
                "amount_raised": 0,
                "story": "Peter is an orphan raised by his grandmother. Despite numerous challenges, he has maintained excellent grades and dreams of becoming a teacher to give back to his community.",
                "is_verified": False  # Pending verification
            }
        ]
        
        student_profiles = []
        for data in students_data:
            # Create user
            user = User(
                username=data["username"],
                email=data["email"],
                role="student"
            )
            user.password = "password123"
            db.session.add(user)
            db.session.flush()  # Get user ID
            
            # Create profile
            profile = StudentProfile(
                user_id=user.id,
                full_name=data["full_name"],
                academic_level=data["academic_level"],
                school_name=data["school_name"],
                fee_amount=data["fee_amount"],
                amount_raised=0,  # Will be updated by donations
                story=data["story"],
                is_verified=data["is_verified"]
            )
            student_profiles.append(profile)
            db.session.add(profile)
        
        db.session.commit()
        
        # Create sample donations for verified students
        print("Creating sample donations...")
        verified_profiles = [p for p in student_profiles if p.is_verified]
        
        for profile in verified_profiles:
            # Random number of donations
            num_donations = random.randint(3, 10)
            total_raised = 0
            
            for _ in range(num_donations):
                donor = random.choice(donors)
                amount = random.choice([1000, 2500, 5000, 10000])
                
                # Don't exceed the target amount
                if total_raised + amount > profile.fee_amount:
                    amount = profile.fee_amount - total_raised
                
                if amount > 0:
                    donation = Donation(
                        donor_id=donor.id,
                        student_profile_id=profile.id,
                        amount=amount,
                        is_anonymous=random.choice([True, False]),
                        message=random.choice([
                            "Keep up the good work!",
                            "Education is the key to success",
                            "Proud to support your journey",
                            "",
                            "All the best in your studies"
                        ]),
                        created_at=datetime.utcnow() - timedelta(days=random.randint(1, 30))
                    )
                    db.session.add(donation)
                    total_raised += amount
                
                if total_raised >= profile.fee_amount:
                    break
            
            # Update the profile's amount_raised
            profile.amount_raised = total_raised
        
        db.session.commit()
        
        print("\n✅ Database seeded successfully!")
        print("\nTest Accounts:")
        print("Admin: admin@elimufund.com / password123")
        print("Donor: donor1@example.com / password123")
        print("Student: alice@example.com / password123")
        print("\n🎉 Seed data created successfully!")

if __name__ == '__main__':
    seed_database()