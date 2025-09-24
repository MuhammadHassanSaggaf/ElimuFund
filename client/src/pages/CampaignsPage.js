import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const CampaignsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  // Refresh data when component becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        const allStudents = JSON.parse(localStorage.getItem('students') || '[]');
        setStudents(allStudents);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const loadStudents = () => {
      const allStudents = JSON.parse(localStorage.getItem('students') || '[]');
      
      // Filter based on user role
      if (user?.role === 'student') {
        // Students only see their own campaign
        const myStudents = allStudents.filter(s => s.full_name === user.name);
        setStudents(myStudents);
      } else {
        // Donors and admins see all students
        setStudents(allStudents);
      }
    };
    
    loadStudents();
    
    // Listen for storage changes
    window.addEventListener('storage', loadStudents);
    
    return () => {
      window.removeEventListener('storage', loadStudents);
    };
  }, [user?.name, user?.role]);
  
  // Show loading or redirect message while checking auth
  if (!user) {
    return (
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="campaigns-page">
      <div className="page-header">
        <h1>{user?.role === 'student' ? 'My Campaign' : 'Student Campaigns'}</h1>
        <p>{user?.role === 'student' ? 'Track your campaign progress' : 'Support students in their educational journey'}</p>
      </div>
      
      <div className="students-grid">
        {user?.role === 'student' && students.length === 0 && (
          <div style={{textAlign: 'center', padding: '40px', color: '#666'}}>
            <h3>No Campaign Yet</h3>
            <p>Complete your profile in the student dashboard to create your campaign.</p>
          </div>
        )}
        {user?.role !== 'student' && students.length === 0 && (
          <div style={{textAlign: 'center', padding: '40px', color: '#666'}}>
            <h3>No Students Available</h3>
            <p>Check back later for new student campaigns.</p>
          </div>
        )}
        {user?.role === 'admin' && (
          <button 
            onClick={() => {
              if (window.confirm('Are you sure you want to clear all data?')) {
                localStorage.removeItem('students');
                localStorage.removeItem('dummyStudents');
                localStorage.removeItem('users');
                localStorage.removeItem('user');
                localStorage.clear();
                alert('All data cleared!');
                window.location.reload();
              }
            }}
            style={{padding: '10px', background: 'red', color: 'white', border: 'none', borderRadius: '5px', margin: '20px'}}
          >
            Clear All Data (Admin)
          </button>
        )}
        {students.map((student) => {
          const amountRaised = student.amount_raised || 0;
          const goalAmount = student.fee_amount || 0;
          const progressPercentage = goalAmount > 0 ? Math.round((amountRaised / goalAmount) * 100) : 0;
          
          // Dynamic colors based on progress
          const getProgressColor = (percentage) => {
            if (percentage >= 100) return '#10B981';
            if (percentage >= 75) return '#F59E0B';
            if (percentage >= 50) return '#8B4513';
            if (percentage >= 25) return '#D2691E';
            return '#A0522D';
          };
          
          const getBackgroundColor = (percentage) => {
            if (percentage >= 100) return 'linear-gradient(135deg, #10B981 0%, #059669 100%)';
            if (percentage >= 75) return 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)';
            if (percentage >= 50) return 'linear-gradient(135deg, #8B4513 0%, #654321 100%)';
            if (percentage >= 25) return 'linear-gradient(135deg, #D2691E 0%, #B8860B 100%)';
            return 'linear-gradient(135deg, #A0522D 0%, #8B4513 100%)';
          };
          
          const progressColor = getProgressColor(progressPercentage);
          const backgroundGradient = getBackgroundColor(progressPercentage);
          
          return (
            <Link 
              key={student.id} 
              to={`/campaign/${student.id}`} 
              className="student-card clickable-card"
              style={{
                background: `${backgroundGradient} !important`,
                color: '#FFFFFF !important',
                transition: 'all 0.5s ease'
              }}
            >
              <div className="verified-badge"></div>
              <div className="student-header">
                <div className="student-avatar" style={{background: progressColor, color: '#FFFFFF'}}>
                  {student.full_name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="student-info">
                  <h3 style={{color: '#FFFFFF', textShadow: '0 2px 4px rgba(0,0,0,0.3)'}}>{student.full_name}</h3>
                  <p className="academic-level" style={{color: 'rgba(255,255,255,0.9)'}}>📚 {student.academic_level}</p>
                  <p className="school-name" style={{color: 'rgba(255,255,255,0.9)'}}>🏫 {student.school_name}</p>
                </div>
              </div>
              
              <div className="funding-info" style={{color: '#FFFFFF'}}>
                <div className="amounts">
                  <div style={{
                    background: `${progressColor} !important`,
                    color: '#FFFFFF !important',
                    padding: '12px 20px',
                    borderRadius: '25px',
                    marginBottom: '15px',
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
                    textAlign: 'center',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                    animation: 'bounceIn 0.8s ease',
                    border: '2px solid rgba(255,255,255,0.3)',
                    display: 'block',
                    width: '100%'
                  }}>
                    {progressPercentage}% funded 🎯
                  </div>
                  <div style={{fontSize: '0.95rem', lineHeight: '1.6'}}>
                    KSh {amountRaised.toLocaleString()} raised<br/>
                    of KSh {goalAmount.toLocaleString()} goal<br/>
                    👥 {student.supporters_count || 0} supporters
                  </div>
                </div>
                
                <div className="progress-circle">
                  <svg width="60" height="60">
                    <circle cx="30" cy="30" r="25" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="4"/>
                    <circle 
                      cx="30" 
                      cy="30" 
                      r="25" 
                      fill="none" 
                      stroke="#FFFFFF" 
                      strokeWidth="4"
                      strokeDasharray={`${2 * Math.PI * 25}`}
                      strokeDashoffset={`${2 * Math.PI * 25 * (1 - progressPercentage / 100)}`}
                      transform="rotate(-90 30 30)"
                      style={{
                        transition: 'stroke-dashoffset 1s ease',
                        filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.5))'
                      }}
                    />
                    <text x="30" y="35" textAnchor="middle" fontSize="12" fill="#FFFFFF" fontWeight="bold">
                      {progressPercentage}%
                    </text>
                  </svg>
                </div>
              </div>
              
              <p className="story">{student.story.substring(0, 100)}...</p>
              

              
              <div className="card-actions">
                <div className="funding-status">
                  {amountRaised >= goalAmount ? (
                    <span className="goal-achieved-badge">✅ Goal Achieved</span>
                  ) : (
                    <span className="needs-funding-badge">💰 Needs KSh {(goalAmount - amountRaised).toLocaleString()}</span>
                  )}
                </div>
                {user?.role === 'admin' && (
                  <button 
                    className="delete-campaign-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (window.confirm(`Delete ${student.full_name}'s campaign?`)) {
                        const allStudents = JSON.parse(localStorage.getItem('students') || '[]');
                        const updatedStudents = allStudents.filter(s => s.id !== student.id);
                        localStorage.setItem('students', JSON.stringify(updatedStudents));
                        
                        const storedDummy = JSON.parse(localStorage.getItem('dummyStudents') || '[]');
                        const updatedDummy = storedDummy.filter(s => s.id !== student.id);
                        localStorage.setItem('dummyStudents', JSON.stringify(updatedDummy));
                        
                        window.location.reload();
                      }
                    }}
                  >
                    🗑️
                  </button>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CampaignsPage;