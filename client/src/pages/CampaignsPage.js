import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { dummyStudents } from "../data/dummyData";
import { useAuth } from "../context/AuthContext";

const CampaignsPage = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  
  // Refresh data when component becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        const localStudents = JSON.parse(localStorage.getItem('students') || '[]');
        const storedDummyStudents = JSON.parse(localStorage.getItem('dummyStudents') || JSON.stringify(dummyStudents));
        const allStudents = [...storedDummyStudents, ...localStudents];
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
      const localStudents = JSON.parse(localStorage.getItem('students') || '[]');
      const storedDummyStudents = JSON.parse(localStorage.getItem('dummyStudents') || JSON.stringify(dummyStudents));
      const allStudents = [...storedDummyStudents, ...localStudents];
      
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
          
          return (
            <Link 
              key={student.id} 
              to={`/campaign/${student.id}`} 
              className="student-card clickable-card"
              style={{textDecoration: 'none', color: 'inherit'}}
            >
              <div className="verified-badge"></div>
              <div className="student-header">
                <div className="student-avatar">
                  {student.full_name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="student-info">
                  <h3>{student.full_name}</h3>
                  <p className="academic-level">📚 {student.academic_level}</p>
                  <p className="school-name">🏫 {student.school_name}</p>
                </div>
              </div>
              
              <div className="funding-info">
                <div className="amounts">
                  {progressPercentage}% funded<br/>
                  KSh {amountRaised.toLocaleString()} raised<br/>
                  of KSh {goalAmount.toLocaleString()} goal<br/>
                  👥 {student.supporters_count || 0} supporters
                </div>
                
                <div className="progress-circle">
                  <svg width="60" height="60">
                    <circle cx="30" cy="30" r="25" fill="none" stroke="#e0e0e0" strokeWidth="4"/>
                    <circle 
                      cx="30" 
                      cy="30" 
                      r="25" 
                      fill="none" 
                      stroke="#4CAF50" 
                      strokeWidth="4"
                      strokeDasharray={`${2 * Math.PI * 25}`}
                      strokeDashoffset={`${2 * Math.PI * 25 * (1 - progressPercentage / 100)}`}
                      transform="rotate(-90 30 30)"
                    />
                    <text x="30" y="35" textAnchor="middle" fontSize="12" fill="#333">
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