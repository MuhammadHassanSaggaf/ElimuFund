import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProgressBar from "../components/ProgressBar";
import { useAuth } from "../context/AuthContext";
import { dummyStudents } from "../data/dummyData";

const DonorDashboard = () => {
  const { user } = useAuth();
  const [allStudents, setAllStudents] = useState([]);

  useEffect(() => {
    const localStudents = JSON.parse(localStorage.getItem("students") || "[]");
    const storedDummyStudents = JSON.parse(
      localStorage.getItem("dummyStudents") || JSON.stringify(dummyStudents)
    );
    const students = [...storedDummyStudents, ...localStudents];
    setAllStudents(students);
  }, []);

  const studentsNeedingHelp = allStudents.filter(
    (s) => (s.amount_raised || 0) < s.fee_amount
  );
  const totalStudents = allStudents.length;
  const totalFundingNeeded = studentsNeedingHelp.reduce(
    (sum, s) => sum + (s.fee_amount - (s.amount_raised || 0)),
    0
  );

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Students Who Need Help</h1>
        <p>Find students to support in their educational journey</p>
        {user?.role === "admin" && (
          <button
            onClick={() => {
              localStorage.removeItem("students");
              localStorage.removeItem("dummyStudents");
              localStorage.removeItem("users");
              localStorage.removeItem("user");
              localStorage.clear();
              alert("All data cleared!");
              window.location.href = "/";
            }}
            style={{
              padding: "10px",
              background: "red",
              color: "white",
              border: "none",
              borderRadius: "5px",
              marginTop: "10px",
            }}
          >
            Clear All Data (Admin)
          </button>
        )}
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Students Needing Help</h3>
          <p className="stat-number">{studentsNeedingHelp.length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Students</h3>
          <p className="stat-number">{totalStudents}</p>
        </div>
        <div className="stat-card">
          <h3>Funding Needed</h3>
          <p className="stat-number">
            KSh {totalFundingNeeded.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Students Who Need Your Help</h2>
        <div className="students-grid">
          {studentsNeedingHelp.length === 0 ? (
            <p style={{ textAlign: "center", color: "#666", padding: "40px" }}>
              No students need help at the moment
            </p>
          ) : (
            studentsNeedingHelp.map((student) => {
              const amountRaised = student.amount_raised || 0;
              const goalAmount = student.fee_amount || 0;
              const progressPercentage =
                goalAmount > 0
                  ? Math.round((amountRaised / goalAmount) * 100)
                  : 0;
              const amountNeeded = goalAmount - amountRaised;

              return (
                <Link
                  key={student.id}
                  to={`/campaign/${student.id}`}
                  className="student-help-card"
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    display: "block",
                    margin: "20px 0",
                    padding: "20px",
                    border: "1px solid #ddd",
                    borderRadius: "10px",
                    cursor: "pointer",
                  }}
                >
                  <div className="student-info">
                    <h4>{student.full_name}</h4>
                    <p> {student.school_name}</p>
                    <p> {student.academic_level}</p>
                  </div>
                  <div className="funding-info">
                    <ProgressBar percentage={progressPercentage} />
                    <p>{progressPercentage}% funded</p>
                    <p>KSh {amountRaised.toLocaleString()} raised</p>
                    <p>Needs KSh {amountNeeded.toLocaleString()}</p>
                  </div>
                  <div
                    style={{
                      background: "#341E10",
                      color: "white",
                      padding: "10px",
                      borderRadius: "5px",
                      textAlign: "center",
                      marginTop: "10px",
                    }}
                  >
                    Help {student.full_name.split(" ")[0]}
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;
