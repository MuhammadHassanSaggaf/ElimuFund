import React from "react";
import {
  verificationQueue,
  disbursementQueue,
  dummyStudents,
} from "../data/dummyData";

const AdminDashboard = () => {
  return (
    <div className="dashboard-page admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Manage student verifications and fund disbursements</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Pending Verifications</h3>
          <p className="stat-number">{verificationQueue.length}</p>
        </div>
        <div className="stat-card">
          <h3>Ready for Disbursement</h3>
          <p className="stat-number">1</p>
        </div>
        <div className="stat-card">
          <h3>Total Students</h3>
          <p className="stat-number">{dummyStudents.length}</p>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Verification Queue</h2>
        <div className="admin-table">
          <table>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>School</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {verificationQueue.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.school}</td>
                  <td>
                    <span className="status-badge pending">{item.status}</span>
                  </td>
                  <td>
                    <button className="action-btn approve">Approve</button>
                    <button className="action-btn reject">Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Disbursement Queue</h2>
        <div className="admin-table">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Amount</th>
                <th>School</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {disbursementQueue.map((item) => (
                <tr key={item.id}>
                  <td>{item.student}</td>
                  <td>KSh {item.amount.toLocaleString()}</td>
                  <td>{item.school}</td>
                  <td>
                    <span className={`status-badge ${item.status}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <button className="action-btn process">Process</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
