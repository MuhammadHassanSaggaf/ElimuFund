# ElimuFund

**Empowering Dreams Through Education**

ElimuFund is a comprehensive educational crowdfunding platform that connects donors with students in need of financial support for their education. Built with modern web technologies, it provides a transparent, secure, and user-friendly way to fund educational dreams.

## 🌟 Features

### For Students
- **Student Profile Creation**: Create detailed profiles with academic information, school details, and personal stories
- **Campaign Management**: Set funding goals and track progress in real-time
- **Progress Tracking**: Monitor donations and funding status
- **Academic Reporting**: Share academic progress with supporters

### For Donors
- **Student Discovery**: Browse verified student campaigns
- **Secure Donations**: Make donations with multiple payment methods (M-Pesa integration)
- **Anonymous Giving**: Option to donate anonymously
- **Donation Tracking**: View donation history and supported students
- **Progress Updates**: Receive updates on student academic progress

### For Administrators
- **Student Verification**: Review and verify student profiles before they go live
- **Dashboard Analytics**: Comprehensive statistics on platform usage
- **User Management**: Monitor all users and their activities
- **Donation Oversight**: Track all donations and platform performance

## 🛠️ Technology Stack

### Backend
- **Framework**: Flask (Python)
- **Database**: SQLite (with PostgreSQL support)
- **ORM**: SQLAlchemy with Flask-SQLAlchemy
- **Authentication**: Session-based authentication with Werkzeug
- **API**: RESTful API with Flask-RESTful
- **CORS**: Flask-CORS for cross-origin requests
- **Migrations**: Flask-Migrate (Alembic)

### Frontend
- **Framework**: React 18
- **Routing**: React Router DOM
- **Forms**: Formik with Yup validation
- **HTTP Client**: Fetch API with custom service layer
- **State Management**: React Context API
- **Styling**: Custom CSS with modern design patterns

### Development Tools
- **Package Management**: npm (frontend), pip (backend)
- **Environment Management**: python-dotenv
- **Database Migrations**: Alembic
- **Testing**: React Testing Library (frontend)

## 📋 Prerequisites

- **Python 3.8+**
- **Node.js 16+**
- **npm or yarn**
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ElimuFund
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
echo "SECRET_KEY=your-secret-key-here" > .env
echo "DATABASE_URL=sqlite:///elimufund.db" >> .env

# Initialize database
flask db init
flask db migrate -m "Initial migration"
flask db upgrade

# Start backend server
python app.py
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to client directory (in new terminal)
cd client

# Install dependencies
npm install

# Create environment file
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env

# Start frontend server
npm start
```

The frontend will run on `http://localhost:3000`

## 🗄️ Database Configuration

### SQLite (Default)
- No additional setup required
- Database file: `server/elimufund.db`

### PostgreSQL (Optional)
1. Install PostgreSQL
2. Create database: `createdb elimufund`
3. Update `.env`:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/elimufund
   ```

## 📁 Project Structure

```
ElimuFund/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React Context providers
│   │   ├── services/      # API service layer
│   │   └── data/          # Static data and fixtures
│   └── package.json
├── server/                # Flask backend
│   ├── routes/            # API route handlers
│   ├── models.py          # Database models
│   ├── app.py             # Flask application
│   ├── config.py          # Configuration settings
│   └── utils/             # Utility functions and decorators
├── migrations/            # Database migrations
├── fixtures/              # Sample data
└── README.md
```

## 🔐 User Roles & Permissions

### Student
- Create and manage student profile
- View own campaign progress
- Update academic information
- Access student dashboard

### Donor
- Browse verified student campaigns
- Make donations (with anonymous option)
- Track donation history
- View supported students' progress
- Access donor dashboard

### Admin
- Verify student profiles
- View platform analytics
- Manage all users
- Monitor all donations
- Access admin dashboard

## 🔌 API Endpoints

### Authentication
- `POST /api/signup` - User registration
- `POST /api/login` - User login
- `DELETE /api/logout` - User logout
- `GET /api/check-session` - Check authentication status

### Students
- `GET /api/students` - Get all verified students
- `GET /api/students/:id` - Get student details
- `POST /api/student-profiles` - Create student profile
- `PATCH /api/student-profiles/:id` - Update student profile
- `GET /api/my-profile` - Get current user's profile

### Donations
- `POST /api/donations` - Create donation
- `GET /api/donations` - Get user's donations
- `GET /api/my-students` - Get supported students
- `DELETE /api/donations/:id` - Cancel donation (24h limit)

### Admin
- `GET /api/admin/dashboard-stats` - Platform statistics
- `GET /api/admin/students/pending` - Pending verifications
- `PATCH /api/admin/students/:id/verify` - Verify student
- `GET /api/admin/donations` - All donations
- `GET /api/admin/users` - All users

## 🧪 Testing the Setup

1. Open `http://localhost:3000`
2. Try signing up for a new account
3. Login with your credentials
4. Create a student profile (if student)
5. Make a donation (if donor)

## 🎨 Key Components

### Frontend Components
- **GlassCard**: Modern glass-morphism card design
- **FloatingLabelInput**: Enhanced form inputs
- **ProgressBar**: Visual progress indicators
- **StudentCard**: Student profile display
- **DonationForm**: Secure donation interface
- **NotificationSystem**: User feedback system

### Backend Models
- **User**: Authentication and role management
- **StudentProfile**: Student information and campaigns
- **Donation**: Donation tracking and management

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///elimufund.db
```

**Frontend (.env)**
```
REACT_APP_API_URL=http://localhost:5000/api
```

## 🚨 Troubleshooting

### Backend Issues
- Check if port 5000 is available
- Verify database migrations ran successfully
- Check server logs for errors
- Ensure virtual environment is activated

### Frontend Issues
- Check if port 3000 is available
- Verify API_URL in .env file
- Check browser console for errors
- Clear browser cache and cookies

### CORS Issues
- Backend CORS is configured for `http://localhost:3000`
- If using different ports, update CORS config in `server/app.py`

### Database Issues
- Ensure database file permissions are correct
- Check if migrations are up to date
- Verify database connection string

## 📈 Future Enhancements

- [ ] Payment gateway integration (Stripe, PayPal)
- [ ] Email notifications system
- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Social media integration
- [ ] Automated student verification
- [ ] Recurring donation options

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Authors

**Muhammad Saggaf**
- Email: muhammadsaggaf2004@gmail.com
- GitHub: [@MuhammadHassanSaggaf](https://github.com/MuhammadHassanSaggaf)

**Grace Eileen Bass**
- Email: grace.eileen.bass@gmail.com
- GitHub: [@Grace-Eileen7](https://github.com/Grace-Eileen7)

**Claire Mbogo**
- Email: claire.mbogo@student.moringaschool.com

## 🙏 Acknowledgments

- Flask and React communities for excellent documentation
- Educational institutions for inspiring this platform
- All contributors and supporters of educational initiatives

---

**ElimuFund** - Where education meets opportunity, and dreams become reality through the power of community support.