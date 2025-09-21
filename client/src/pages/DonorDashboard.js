import React from "react";
import ProgressBar from "../components/ProgressBar";
import { dummyStudents } from "../data/dummyData";

const DonorDashboard = () => {
  const supportedStudents = dummyStudents.slice(0, 2); // Mock supported students

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Your Impact Dashboard</h1>
        <p>Track the progress of students you've supported</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Donated</h3>
          <p className="stat-number">KSh 15,000</p>
        </div>
        <div className="stat-card">
          <h3>Students Supported</h3>
          <p className="stat-number">2</p>
        </div>
        <div className="stat-card">
          <h3>Success Stories</h3>
          <p className="stat-number">1</p>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Students You've Supported</h2>
        <div className="supported-students">
          {supportedStudents.map((student) => (
            <div key={student.id} className="supported-student-card">
              <img src={student.profile_image} alt={student.full_name} />
              <div className="student-details">
                <h4>{student.full_name}</h4>
                <p>
                  {student.academic_level} • {student.school_name}
                </p>
                <ProgressBar
                  percentage={
                    (student.amount_raised / student.fee_amount) * 100
                  }
                />
                <div className="recent-grades">
                  <h5>Recent Academic Performance</h5>
                  {student.grade_reports.map((report, index) => (
                    <p key={index} className="grade-item">
                      {report}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;
