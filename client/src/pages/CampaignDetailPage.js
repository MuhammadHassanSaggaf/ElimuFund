import React from "react";
import { useParams } from "react-router-dom";
import DonationForm from "../components/DonationForm";
import ProgressBar from "../components/ProgressBar";
import { dummyStudents } from "../data/dummyData";

const CampaignDetailPage = () => {
  const { id } = useParams();
  const student = dummyStudents.find((s) => s.id === parseInt(id));

  if (!student) {
    return <div className="error-page">Student not found</div>;
  }

  const progressPercentage = (student.amount_raised / student.fee_amount) * 100;

  return (
    <div className="campaign-detail-page">
      <div className="detail-container">
        <div className="student-profile">
          <div className="profile-image">
            <img src={student.profile_image} alt={student.full_name} />
            <div className="verified-badge large">✓ Verified Student</div>
          </div>

          <div className="profile-info">
            <h1>{student.full_name}</h1>
            <p className="academic-level">
              {student.academic_level} at {student.school_name}
            </p>

            <div className="funding-progress">
              <ProgressBar percentage={progressPercentage} className="large" />
              <div className="amounts-detail">
                <span className="raised">
                  KSh {student.amount_raised.toLocaleString()} raised
                </span>
                <span className="goal">
                  of KSh {student.fee_amount.toLocaleString()} goal
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="detail-content">
          <div className="story-section">
            <h2>About {student.full_name}</h2>
            <p className="full-story">{student.story}</p>

            <div className="academic-progress">
              <h3>Academic Progress</h3>
              <div className="grade-reports">
                {student.grade_reports.map((report, index) => (
                  <div key={index} className="grade-report">
                    <span className="report-icon">📊</span>
                    {report}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="donation-section">
            <DonationForm student={student} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetailPage;
