import React, { useState, useEffect } from "react";

import { useAuth } from "../context/AuthContext";
import apiService from "../services/api";

const AdminDashboard = () => {
	const { user } = useAuth();
	const [allUsers, setAllUsers] = useState([]);
	const [stats, setStats] = useState(null);
	const [pendingStudents, setPendingStudents] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [activeSection, setActiveSection] = useState("dashboard");

	useEffect(() => {
		const loadAdminData = async () => {
			if (user?.role === "admin") {
				try {
					setLoading(true);
					setError(null);

					// Load users, stats, and pending students in parallel
					const [usersResponse, statsResponse, pendingResponse] =
						await Promise.all([
							apiService.getAllUsers(),
							apiService.getAdminStats(),
							apiService.getPendingStudents(),
						]);

					const transformedUsers = usersResponse.users.map((user) =>
						apiService.transformUserData(user),
					);
					const transformedPending = pendingResponse.students.map((student) =>
						apiService.transformStudentData(student),
					);

					setAllUsers(transformedUsers);
					setStats(statsResponse);
					setPendingStudents(transformedPending);
				} catch (err) {
					console.error("Error loading admin data:", err);
					setError("Failed to load admin data");
				} finally {
					setLoading(false);
				}
			}
		};

		if (user) {
			loadAdminData();
		}
	}, [user]);

	const handleStudentVerification = async (studentId, action) => {
		try {
			await apiService.verifyStudent(studentId, action);

			// Remove the student from pending list
			setPendingStudents((prev) => prev.filter((s) => s.id !== studentId));

			// Refresh stats
			const updatedStats = await apiService.getAdminStats();
			setStats(updatedStats);

			alert(
				`Student ${
					action === "approve" ? "approved" : "rejected"
				} successfully!`,
			);
		} catch (err) {
			console.error("Error verifying student:", err);
			alert("Failed to verify student. Please try again.");
		}
	};

	const donors = allUsers.filter((user) => user.role === "donor");
	const students = allUsers.filter((user) => user.role === "student");
	const admins = allUsers.filter((user) => user.role === "admin");

	if (loading) {
		return (
			<div className="dashboard-page admin-dashboard">
				<div className="dashboard-header">
					<h1>Loading...</h1>
					<p>Please wait while we fetch the admin data</p>
				</div>
				<div style={{ textAlign: "center", padding: "40px" }}>
					<div className="loading-spinner">⏳</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="dashboard-page admin-dashboard">
				<div className="dashboard-header">
					<h1>Error</h1>
					<p>{error}</p>
				</div>
				<div style={{ textAlign: "center", padding: "40px" }}>
					<button
						onClick={() => window.location.reload()}
						style={{
							padding: "10px 20px",
							background: "#007bff",
							color: "white",
							border: "none",
							borderRadius: "5px",
							cursor: "pointer",
						}}
					>
						Try Again
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="admin-control-panel">
			{/* Sidebar Navigation */}
			<div className="admin-sidebar">
				<div className="sidebar-header">
					<h2>Control Panel</h2>
					<p>ElimuFund Platform Management</p>
				</div>

				<nav className="sidebar-nav">
					<div className="nav-section">
						<h3>Overview</h3>
						<ul className="nav-links">
							<li>
								<button
									className={`nav-link ${activeSection === "dashboard" ? "active" : ""}`}
									onClick={() => setActiveSection("dashboard")}
								>
									<span className="nav-text">Dashboard</span>
								</button>
							</li>
						</ul>
					</div>

					<div className="nav-section">
						<h3>Management</h3>
						<ul className="nav-links">
							<li>
								<button
									className={`nav-link ${activeSection === "verification" ? "active" : ""}`}
									onClick={() => setActiveSection("verification")}
								>
									<span className="nav-text">Student Verification</span>
									{pendingStudents.length > 0 && (
										<span className="nav-badge">{pendingStudents.length}</span>
									)}
								</button>
							</li>
							<li>
								<button
									className={`nav-link ${activeSection === "users" ? "active" : ""}`}
									onClick={() => setActiveSection("users")}
								>
									<span className="nav-text">User Management</span>
								</button>
							</li>
							<li>
								<button
									className={`nav-link ${activeSection === "donations" ? "active" : ""}`}
									onClick={() => setActiveSection("donations")}
								>
									<span className="nav-text">Donations & Reports</span>
								</button>
							</li>
						</ul>
					</div>
				</nav>

				{/* Profile Section */}
				<div className="sidebar-profile">
					<div className="profile-info">
						<div className="profile-avatar">
							{user?.username ? user.username.charAt(0).toUpperCase() : "A"}
						</div>
						<div className="profile-details">
							<h4>{user?.username || "Admin"}</h4>
							<p>Platform Administrator</p>
						</div>
					</div>
				</div>
			</div>

			{/* Main Control Panel Content */}
			<div className="control-panel-content">
				{activeSection === "dashboard" && (
					<div className="dashboard-overview">
						<div className="control-header">
							<h1>Platform Overview</h1>
							<p>Monitor overall platform health and key metrics</p>
						</div>

						{/* Key Metrics Grid */}
						<div className="metrics-grid">
							<div className="metric-card">
								<div className="metric-content">
									<h3>Total Users</h3>
									<p className="metric-number">{stats?.total_users || allUsers.length}</p>
									<span className="metric-label">Platform Users</span>
								</div>
							</div>
							<div className="metric-card">
								<div className="metric-content">
									<h3>Donors</h3>
									<p className="metric-number">{stats?.total_donors || donors.length}</p>
									<span className="metric-label">Active Donors</span>
								</div>
							</div>
							<div className="metric-card">
								<div className="metric-content">
									<h3>Students</h3>
									<p className="metric-number">{stats?.total_students || students.length}</p>
									<span className="metric-label">Registered Students</span>
								</div>
							</div>
							<div className="metric-card">
								<div className="metric-content">
									<h3>Pending</h3>
									<p className="metric-number">{stats?.pending_students || pendingStudents.length}</p>
									<span className="metric-label">Awaiting Review</span>
								</div>
							</div>
						</div>

						{/* Financial Overview */}
						<div className="financial-overview">
							<h2>Financial Health</h2>
							<div className="financial-grid">
								<div className="financial-card">
									<h3>Total Donations</h3>
									<p className="financial-number">{stats?.total_donations || 0}</p>
									<span className="financial-label">Individual Donations</span>
								</div>
								<div className="financial-card">
									<h3>Amount Raised</h3>
									<p className="financial-number">KSh {(stats?.total_amount_raised || 0).toLocaleString()}</p>
									<span className="financial-label">Total Funding</span>
								</div>
								<div className="financial-card">
									<h3>Verified Students</h3>
									<p className="financial-number">{stats?.verified_students || 0}</p>
									<span className="financial-label">Approved for Funding</span>
								</div>
							</div>
						</div>
					</div>
				)}

				{activeSection === "verification" && (
					<div className="verification-panel">
						<div className="control-header">
							<h1>Student Verification</h1>
							<p>Review and approve student funding applications</p>
						</div>

						{pendingStudents.length === 0 ? (
							<div className="no-pending-students">
								<div className="empty-state">
									<h3>All Clear!</h3>
									<p>No pending student verifications at this time.</p>
								</div>
							</div>
						) : (
							<div className="verification-grid">
								{pendingStudents.map((student) => (
									<div key={student.id} className="verification-card">
										<div className="student-header">
											<div className="student-avatar">
												{student.profile_image ? (
													<img src={student.profile_image} alt={student.full_name} />
												) : (
													student.full_name.split(" ").map((n) => n[0]).join("")
												)}
											</div>
											<div className="student-info">
												<h3>{student.full_name}</h3>
												<p className="student-school">{student.academic_level} at {student.school_name}</p>
												<p className="funding-amount">KSh {student.fee_amount.toLocaleString()}</p>
											</div>
										</div>

										<div className="student-story">
											<h4>Application Story:</h4>
											<p>{student.story}</p>
										</div>

										<div className="verification-actions">
											<button
												className="action-btn approve"
												onClick={() => handleStudentVerification(student.id, "approve")}
											>
												Approve
											</button>
											<button
												className="action-btn reject"
												onClick={() => handleStudentVerification(student.id, "reject")}
											>
												Reject
											</button>
											<button
												className="action-btn view"
												onClick={() => {
													alert(`Full details for ${student.full_name}:\n\nSchool: ${student.school_name}\nLevel: ${student.academic_level}\nAmount: KSh ${student.fee_amount.toLocaleString()}\n\nStory:\n${student.story}`);
												}}
											>
												View Details
											</button>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				)}

				{activeSection === "users" && (
					<div className="user-management-panel">
						<div className="control-header">
							<h1>User Management</h1>
							<p>Manage platform users and their accounts</p>
						</div>

						<div className="user-overview">
							<div className="user-summary">
								<h3>User Breakdown</h3>
								<div className="user-stats">
									<div className="user-stat">
										<span className="stat-label">Total Users:</span>
										<span className="stat-value">{allUsers.length}</span>
									</div>
									<div className="user-stat">
										<span className="stat-label">Donors:</span>
										<span className="stat-value">{donors.length}</span>
									</div>
									<div className="user-stat">
										<span className="stat-label">Students:</span>
										<span className="stat-value">{students.length}</span>
									</div>
									<div className="user-stat">
										<span className="stat-label">Admins:</span>
										<span className="stat-value">{admins.length}</span>
									</div>
								</div>
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
													<td>{donor.username}</td>
													<td>{donor.email}</td>
													<td>{new Date(donor.created_at).toLocaleDateString()}</td>
													<td>
														<button
															className="action-btn delete"
															onClick={() => {
																if (window.confirm(`Delete ${donor.username}'s account?`)) {
																	alert("User deletion not implemented in backend yet");
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
													<td>{student.username}</td>
													<td>{student.email}</td>
													<td>{new Date(student.created_at).toLocaleDateString()}</td>
													<td>
														<button
															className="action-btn delete"
															onClick={() => {
																if (window.confirm(`Delete ${student.username}'s account?`)) {
																	alert("User deletion not implemented in backend yet");
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
				)}

				{activeSection === "donations" && (
					<div className="donations-panel">
						<div className="control-header">
							<h1>Donations & Reports</h1>
							<p>Monitor financial activity and generate reports</p>
						</div>

						<div className="donations-overview">
							<div className="donation-metrics">
								<div className="donation-card">
									<h3>Total Donations</h3>
									<p className="donation-number">{stats?.total_donations || 0}</p>
									<span className="donation-label">Individual Contributions</span>
								</div>
								<div className="donation-card">
									<h3>Amount Raised</h3>
									<p className="donation-number">KSh {(stats?.total_amount_raised || 0).toLocaleString()}</p>
									<span className="donation-label">Total Funding</span>
								</div>
								<div className="donation-card">
									<h3>Average Donation</h3>
									<p className="donation-number">
										KSh {stats?.total_donations > 0 ? Math.round((stats?.total_amount_raised || 0) / stats?.total_donations).toLocaleString() : 0}
									</p>
									<span className="donation-label">Per Contribution</span>
								</div>
							</div>
						</div>

						<div className="reports-section">
							<h2>Generate Reports</h2>
							<p>Create detailed reports for platform analytics and financial tracking.</p>
							<div className="report-actions">
								<button className="report-btn">
									Donation Report
								</button>
								<button className="report-btn">
									User Activity Report
								</button>
								<button className="report-btn">
									Financial Summary
								</button>
								<button className="report-btn">
									Student Progress Report
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);

};

export default AdminDashboard;
