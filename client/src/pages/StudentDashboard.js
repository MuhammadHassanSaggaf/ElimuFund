import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import StudentDetailsForm from "../components/StudentDetailsForm";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [profileComplete, setProfileComplete] = useState(false);
  const [studentData, setStudentData] = useState(null);

  const handleProfileSubmit = (values) => {
    // TODO: Connect to backend API
    setStudentData(values);
    setProfileComplete(true);
  };

  if (!profileComplete) {
    return (
      <div className="student-dashboard">
        <div className="container">
          <h1>Complete Your Profile</h1>
          <p>Please fill in your details to create your funding campaign.</p>
          <StudentDetailsForm onSubmit={handleProfileSubmit} />
        </div>
      </div>
    );
  }

  return (
    <div className="student-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Welcome, {user?.name}</h1>
          <p>Manage your funding campaign and track your progress</p>
        </div>

        <div className="dashboard-content">
          <div className="profile-summary">
            <h2>Your Profile</h2>
            <div className="profile-info">
              <p><strong>Institution:</strong> {studentData?.institution}</p>
              <p><strong>Course:</strong> {studentData?.course}</p>
              <p><strong>Year:</strong> {studentData?.yearOfStudy}</p>
              <p><strong>Funding Needed:</strong> ${studentData?.fundingNeeded}</p>
              <p><strong>Purpose:</strong> {studentData?.purpose}</p>
            </div>
          </div>

          <div className="campaign-stats">
            <h2>Campaign Progress</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>$0</h3>
                <p>Raised</p>
              </div>
              <div className="stat-card">
                <h3>${studentData?.fundingNeeded}</h3>
                <p>Goal</p>
              </div>
              <div className="stat-card">
                <h3>0</h3>
                <p>Donors</p>
              </div>
              <div className="stat-card">
                <h3>0%</h3>
                <p>Complete</p>
              </div>
            </div>
          </div>

          <div className="recent-activity">
            <h2>Recent Activity</h2>
            <div className="activity-list">
              <p>No recent activity. Your campaign will appear here once it's live.</p>
            </div>
          </div>

          <div className="actions">
            <button 
              className="btn-primary"
              onClick={() => setProfileComplete(false)}
            >
              Edit Profile
            </button>
            <button 
              className="btn-secondary"
              onClick={() => navigator.share ? navigator.share({title: 'Support My Education', url: window.location.href}) : alert('Share feature not supported')}
            >
              Share Campaign
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;