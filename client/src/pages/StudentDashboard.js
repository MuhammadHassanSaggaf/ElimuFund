import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import StudentDetailsForm from "../components/StudentDetailsForm";

import NotificationSystem from "../components/NotificationSystem";

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profileComplete, setProfileComplete] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const [campaignData, setCampaignData] = useState(null);
  const [donations, setDonations] = useState([]);
  
  // Get live campaign data from localStorage
  useEffect(() => {
    if (user?.name) {
      const allStudents = JSON.parse(localStorage.getItem('students') || '[]');
      const userCampaign = allStudents.find(s => s.full_name === user.name);
      if (userCampaign) {
        setCampaignData(userCampaign);
        setProfileComplete(true);
        
        // Load donation history (mock data for now)
        const mockDonations = [
          { id: 1, donor: 'Anonymous', amount: 5000, date: new Date().toISOString() },
          { id: 2, donor: 'John Doe', amount: 3000, date: new Date(Date.now() - 86400000).toISOString() }
        ];
        setDonations(mockDonations);
      }
    }
  }, [user]);
  
  const totalRaised = campaignData?.amount_raised || 0;
  const supportersCount = campaignData?.supporters_count || 0;
  
  // Calculate progress percentage
  const progressPercentage = studentData?.fundingNeeded ? 
    Math.round((totalRaised / studentData.fundingNeeded) * 100) : 0;

  const handleProfileSubmit = (values) => {
    setStudentData(values);
    setProfileComplete(true);
    
    // Automatically add student to campaigns
    const newStudent = {
      id: Date.now(),
      full_name: user?.name || 'Student',
      academic_level: values?.yearOfStudy || values?.educationLevel,
      school_name: values?.institution,
      fee_amount: Number(values?.fundingNeeded) || 0,
      amount_raised: 0,
      supporters_count: 0,
      story: values?.personalStatement || '',
      profile_image: values?.profileImage || null
    };
    
    const existingStudents = JSON.parse(localStorage.getItem('students') || '[]');
    // Check if student already exists
    const studentExists = existingStudents.some(s => s.full_name === user?.name);
    
    if (!studentExists) {
      existingStudents.push(newStudent);
      localStorage.setItem('students', JSON.stringify(existingStudents));
      
      // Trigger storage event to refresh campaigns page
      window.dispatchEvent(new Event('storage'));
    }
  };

  if (!profileComplete) {
    return (
      <div className="student-dashboard">
        <StudentDetailsForm onSubmit={handleProfileSubmit} />
      </div>
    );
  }

  return (
    <div className="modern-dashboard">
      <div className="dashboard-container">
        {/* Header Section */}
        <div className="dashboard-header">
          <div className="welcome-section">
            <h1>Welcome back, {user?.name}! 👋</h1>
            <p>Track your campaign progress and manage your profile</p>
          </div>
          <div className="header-actions">
            <button 
              className="edit-btn"
              onClick={() => setProfileComplete(false)}
            >
              ✏️ Edit Profile
            </button>
            <button 
              className="delete-btn"
              onClick={() => {
                if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                  // Remove user's campaign from localStorage
                  const allStudents = JSON.parse(localStorage.getItem('students') || '[]');
                  const updatedStudents = allStudents.filter(s => s.full_name !== user?.name);
                  localStorage.setItem('students', JSON.stringify(updatedStudents));
                  
                  // Clear user session and redirect
                  localStorage.removeItem('user');
                  alert('Account deleted successfully');
                  window.location.href = '/';
                }
              }}
            >
              🗑️ Delete Account
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="stats-overview">
          <div className="stat-card primary">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3>KSh {totalRaised.toLocaleString()}</h3>
              <p>Total Raised</p>
            </div>
          </div>
          <div className="stat-card success">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <h3>KSh {studentData?.fundingNeeded}</h3>
              <p>Goal Amount</p>
            </div>
          </div>
          <div className="stat-card info">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3>{supportersCount}</h3>
              <p>Supporters</p>
            </div>
          </div>
          <div className="stat-card warning">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>{progressPercentage}%</h3>
              <p>Progress</p>
              <div className="progress-bar-mini">
                <div className="progress-fill-mini" style={{width: `${progressPercentage}%`}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="dashboard-grid">
          {/* Profile Card */}
          <div className="dashboard-card profile-card">
            <div className="card-header">
              <h2>📋 Your Profile</h2>
            </div>
            <div className="profile-details">
              <div className="detail-item">
                <span className="label">🏫 Institution:</span>
                <span className="value">{campaignData?.school_name || studentData?.institution || 'Not specified'}</span>
              </div>
              <div className="detail-item">
                <span className="label">📚 Course:</span>
                <span className="value">{campaignData?.course || studentData?.course || 'Not specified'}</span>
              </div>
              <div className="detail-item">
                <span className="label">📅 Year:</span>
                <span className="value">{campaignData?.academic_level || studentData?.yearOfStudy || 'Not specified'}</span>
              </div>
              <div className="detail-item">
                <span className="label">🎯 Purpose:</span>
                <span className="value">{campaignData?.purpose || studentData?.purpose || 'Educational funding'}</span>
              </div>
            </div>
          </div>

          {/* Campaign Status */}
          <div className="dashboard-card campaign-card">
            <div className="card-header">
              <h2>🚀 Campaign Status</h2>
            </div>
            <div className="campaign-status">
              <div className="status-indicator pending">
                <div className="status-dot"></div>
                <span>Pending Review</span>
              </div>
              <p className="status-description">
                Your campaign is being reviewed. This usually takes 24-48 hours.
              </p>
              <div className="campaign-actions">
                <button 
                  className="submit-campaign-btn"
                  onClick={() => {
                    if (campaignData?.id) {
                      navigate(`/campaign/${campaignData.id}`);
                    } else {
                      alert('Campaign is now live!');
                      setTimeout(() => navigate('/campaigns'), 1000);
                    }
                  }}
                >
                  {campaignData?.id ? '👁️ View My Campaign' : '🚀 Make Campaign Live'}
                </button>
              </div>
            </div>
          </div>

          {/* Donations Received */}
          <div className="dashboard-card donations-card">
            <div className="card-header">
              <h2>💰 Recent Donations</h2>
            </div>
            <div className="donations-content">
              {donations.length === 0 ? (
                <p style={{textAlign: 'center', color: '#666', padding: '20px'}}>No donations yet</p>
              ) : (
                <div className="donations-list">
                  {donations.map(donation => (
                    <div key={donation.id} className="donation-item">
                      <div className="donation-info">
                        <span className="donor-name">👥 {donation.donor}</span>
                        <span className="donation-amount">💰 KSh {donation.amount.toLocaleString()}</span>
                      </div>
                      <div className="donation-date">
                        📅 {new Date(donation.date).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Notifications Section */}
        <div className="dashboard-card notifications-card">
          <NotificationSystem userId={user?.id} />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;