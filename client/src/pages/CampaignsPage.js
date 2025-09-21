import React from "react";
import StudentCard from "../components/StudentCard";
import { dummyStudents } from "../data/dummyData";

const CampaignsPage = () => {
  return (
    <div className="campaigns-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Support a Student's Educational Journey</h1>
          <p>
            Every donation is tracked transparently. See the real impact of your
            contribution through academic progress reports.
          </p>
        </div>
      </div>

      <div className="campaigns-container">
        <div className="campaigns-header">
          <h2>Students Seeking Support</h2>
          <p>
            All students are verified and their progress is tracked
            transparently
          </p>
        </div>

        <div className="campaigns-grid">
          {dummyStudents.map((student) => (
            <StudentCard key={student.id} student={student} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CampaignsPage;
