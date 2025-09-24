import React, { useState } from "react";

const ProgressReports = ({ studentId }) => {
  const [reports] = useState([
    {
      id: 1,
      date: "2024-01-15",
      title: "First Semester Results",
      grade: "A-",
      description: "Completed first semester with excellent performance in Mathematics and Science.",
      attachments: ["transcript_sem1.pdf"]
    },
    {
      id: 2,
      date: "2024-03-20",
      title: "Mid-Year Progress",
      grade: "B+",
      description: "Maintaining good academic standing. Participating in science club activities.",
      attachments: []
    }
  ]);

  return (
    <div className="progress-reports">
      <h3>📊 Academic Progress Reports</h3>
      <div className="reports-list">
        {reports.map(report => (
          <div key={report.id} className="report-card">
            <div className="report-header">
              <h4>{report.title}</h4>
              <span className="report-date">{new Date(report.date).toLocaleDateString()}</span>
            </div>
            <div className="report-grade">
              <span className="grade-label">Grade:</span>
              <span className="grade-value">{report.grade}</span>
            </div>
            <p className="report-description">{report.description}</p>
            {report.attachments.length > 0 && (
              <div className="attachments">
                <span className="attachments-label">📎 Attachments:</span>
                {report.attachments.map((file, index) => (
                  <span key={index} className="attachment-file">{file}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressReports;