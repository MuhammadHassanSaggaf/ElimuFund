import React, { useState, useEffect } from "react";

const AdminDashboard = () => {
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    setAllUsers(users);
  }, []);

  const donors = allUsers.filter((user) => user.role === "donor");
  const students = allUsers.filter((user) => user.role === "student");
  const admins = allUsers.filter((user) => user.role === "admin");

  return (
    <div className="dashboard-page admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Manage student verifications and fund disbursements</p>
        <button
          onClick={() => {
            const name = prompt("Enter full name:");
            const email = prompt("Enter email:");
            const role = prompt("Enter role (student/donor/admin):");

            if (name && email && role) {
              const newUser = {
                id: Date.now(),
                name,
                email,
                role,
                createdAt: new Date().toISOString(),
              };

              const users = JSON.parse(localStorage.getItem("users") || "[]");
              users.push(newUser);
              localStorage.setItem("users", JSON.stringify(users));

              alert(`Account created for ${name} as ${role}`);
            }
          }}
          style={{
            padding: "10px 20px",
            background: "green",
            color: "white",
            border: "none",
            borderRadius: "5px",
            marginTop: "10px",
          }}
        >
          + Add New Account
        </button>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-number">{allUsers.length}</p>
        </div>
        <div className="stat-card">
          <h3>Donors</h3>
          <p className="stat-number">{donors.length}</p>
        </div>
        <div className="stat-card">
          <h3>Students</h3>
          <p className="stat-number">{students.length}</p>
        </div>
        <div className="stat-card">
          <h3>Admins</h3>
          <p className="stat-number">{admins.length}</p>
        </div>
      </div>

      {/* User Management Section */}
      <div className="dashboard-section">
        <h2>User Management</h2>
        <div className="user-stats">
          <div className="user-stat-card">
            <h4>Total Users: {allUsers.length}</h4>
            <p>
              Donors: {donors.length} | Students: {students.length} | Admins:{" "}
              {admins.length}
            </p>
          </div>
        </div>

        <div className="user-tables">
          <div className="user-table-section">
            <h3>Donors ({donors.length})</h3>
            <div className="admin-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {donors.map((donor) => (
                    <tr key={donor.id}>
                      <td>{donor.name}</td>
                      <td>{donor.email}</td>
                      <td>{new Date(donor.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          className="action-btn reject"
                          onClick={() => {
                            if (
                              window.confirm(`Delete ${donor.name}'s account?`)
                            ) {
                              const updatedUsers = allUsers.filter(
                                (u) => u.id !== donor.id
                              );
                              localStorage.setItem(
                                "users",
                                JSON.stringify(updatedUsers)
                              );
                              setAllUsers(updatedUsers);
                            }
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="user-table-section">
            <h3>Students ({students.length})</h3>
            <div className="admin-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td>{student.name}</td>
                      <td>{student.email}</td>
                      <td>
                        {new Date(student.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <button
                          className="action-btn reject"
                          onClick={() => {
                            if (
                              window.confirm(
                                `Delete ${student.name}'s account?`
                              )
                            ) {
                              const updatedUsers = allUsers.filter(
                                (u) => u.id !== student.id
                              );
                              localStorage.setItem(
                                "users",
                                JSON.stringify(updatedUsers)
                              );
                              setAllUsers(updatedUsers);
                            }
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
