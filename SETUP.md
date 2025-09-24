# ElimuFund Setup Guide

## Prerequisites
- Python 3.8+ 
- Node.js 16+
- npm or yarn

## Backend Setup

### 1. Navigate to server directory
```bash
cd server
```

### 2. Create virtual environment
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Create environment file
```bash
echo "SECRET_KEY=your-secret-key-here" > .env
echo "DATABASE_URL=sqlite:///elimufund.db" >> .env
```

### 5. Initialize database
```bash
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```

### 6. Start backend server
```bash
python app.py
```

The backend will run on http://localhost:5000

## Frontend Setup

### 1. Navigate to client directory (in new terminal)
```bash
cd client
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create environment file
```bash
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
```

### 4. Start frontend server
```bash
npm start
```

The frontend will run on http://localhost:3000

## Database Options

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

## Testing the Setup

1. Open http://localhost:3000
2. Try signing up for a new account
3. Login with your credentials
4. Create a student profile (if student)
5. Make a donation (if donor)

## Troubleshooting

### Backend Issues
- Check if port 5000 is available
- Verify database migrations ran successfully
- Check server logs for errors

### Frontend Issues
- Check if port 3000 is available
- Verify API_URL in .env file
- Check browser console for errors

### CORS Issues
- Backend CORS is configured for http://localhost:3000
- If using different ports, update CORS config in `server/app.py`
