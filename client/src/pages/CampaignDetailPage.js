import React from "react";
import { useParams } from "react-router-dom";
import DonationForm from "../components/DonationForm";
import ProgressBar from "../components/ProgressBar";
import { useAuth } from "../context/AuthContext";

const CampaignDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  
  // Get students from localStorage only
  const allStudents = JSON.parse(localStorage.getItem('students') || '[]');
  const student = allStudents.find((s) => s.id === parseInt(id));

  if (!student) {
    return (
      <div className="error-page">
        <div className="error-container">
          <div className="error-icon">😔</div>
          <h2>Student Not Found</h2>
          <p>The student campaign you're looking for doesn't exist.</p>
          <a href="/campaigns" className="back-btn">← Back to Campaigns</a>
        </div>
      </div>
    );
  }

  const amountRaised = student.amount_raised || 0;
  const goalAmount = student.fee_amount || 0;
  const progressPercentage = goalAmount > 0 ? Math.min(100, (amountRaised / goalAmount) * 100) : 0;

  return (
    <div className="modern-campaign-page">
      {/* Hero Section */}
      <div className="campaign-hero">
        <div className="hero-background"></div>
        <div className="hero-content">
          <div className="container">
            <div className="hero-grid">
              <div className="student-info">
                <div className="student-avatar">
                  {student.profile_image ? (
                    <img src={student.profile_image} alt={student.full_name} />
                  ) : (
                    <div className="default-avatar">
                      <span className="avatar-text">{student.full_name?.charAt(0) || 'S'}</span>
                    </div>
                  )}
                  <div className="verified-badge">✓ Verified</div>
                </div>
                <div className="student-details">
                  <h1>{student.full_name}</h1>
                  <p className="student-subtitle">
                    📚 {student.academic_level} at {student.school_name}
                  </p>
                  <div className="campaign-stats">
                    <div className="stat">
                      <span className="stat-value">KSh {amountRaised.toLocaleString()}</span>
                      <span className="stat-label">Raised</span>
                    </div>
                    <div className="stat">
                      <span className="stat-value">KSh {goalAmount.toLocaleString()}</span>
                      <span className="stat-label">Goal</span>
                    </div>
                    <div className="stat">
                      <span className="stat-value">{Math.round(progressPercentage)}%</span>
                      <span className="stat-label">{Math.round(progressPercentage) === 100 ? 'Complete' : 'Incomplete'}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="progress-section">
                <div className="progress-card">
                  <ProgressBar percentage={progressPercentage} className="large" />
                  <div className="progress-details">
                    <div className="supporters-count">
                      <span className="supporters-icon">👥</span>
                      <span>{student.supporters_count || 0} supporters</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="campaign-content">
        <div className="container">
          <div className="content-grid">
            {/* Story Section */}
            <div className="story-section">
              <div className="content-card">
                <div className="card-header">
                  <h2>📖 About {student.full_name}</h2>
                </div>
                <div className="story-content">
                  <p className="story-text">{student.story}</p>
                  
                  {student.grade_reports && (
                    <div className="academic-section">
                      <h3>📊 Academic Progress</h3>
                      <div className="grade-reports">
                        {student.grade_reports.map((report, index) => (
                          <div key={index} className="grade-item">
                            <span className="grade-icon">🎯</span>
                            <span className="grade-text">{report}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="impact-section">
                    <h3>💡 Your Impact</h3>
                    <div className="impact-grid">
                      <div className="impact-item">
                        <div className="impact-icon">📚</div>
                        <div className="impact-text">
                          <strong>Education Access</strong>
                          <p>Help provide quality education opportunities</p>
                        </div>
                      </div>
                      <div className="impact-item">
                        <div className="impact-icon">🚀</div>
                        <div className="impact-text">
                          <strong>Future Success</strong>
                          <p>Invest in a bright future and career growth</p>
                        </div>
                      </div>
                      <div className="impact-item">
                        <div className="impact-icon">🌍</div>
                        <div className="impact-text">
                          <strong>Community Impact</strong>
                          <p>Create positive change in the community</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Donation Section - Only show if not the student's own campaign */}
            {user?.name !== student.full_name && (
              <div className="donation-section">
                <div className="donation-sticky">
                  <DonationForm student={student} />
                  
                  <div className="trust-indicators">
                    <div className="trust-item">
                      <span className="trust-icon">🔒</span>
                      <span>Secure & Encrypted</span>
                    </div>
                    <div className="trust-item">
                      <span className="trust-icon">✅</span>
                      <span>Verified Student</span>
                    </div>
                    <div className="trust-item">
                      <span className="trust-icon">📊</span>
                      <span>Progress Tracking</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Student's own campaign message */}
            {user?.name === student.full_name && (
              <div className="own-campaign-message">
                <div className="message-card">
                  <h3>📊 Your Campaign Dashboard</h3>
                  <p>This is your campaign page. Share this link with potential donors to receive support!</p>
                  <div className="share-actions">
                    <button className="share-btn" onClick={() => navigator.clipboard.writeText(window.location.href)}>
                      📋 Copy Link to Share
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetailPage;