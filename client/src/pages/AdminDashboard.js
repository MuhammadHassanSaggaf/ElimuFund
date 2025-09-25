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
		<div className="dashboard-page admin-dashboard">
			<div className="dashboard-header">
				<h1>Admin Dashboard</h1>
				<p>Manage student verifications and fund disbursements</p>
			</div>

			<div className="dashboard-stats">
				<div className="stat-card">
					<h3>Total Users</h3>
					<p className="stat-number">{stats?.total_users || allUsers.length}</p>
				</div>
				<div className="stat-card">
					<h3>Donors</h3>
					<p className="stat-number">{stats?.total_donors || donors.length}</p>
				</div>
				<div className="stat-card">
					<h3>Students</h3>
					<p className="stat-number">
						{stats?.total_students || students.length}
					</p>
				</div>
				<div className="stat-card">
					<h3>Verified Students</h3>
					<p className="stat-number">{stats?.verified_students || 0}</p>
				</div>
				<div className="stat-card">
					<h3>Pending Students</h3>
					<p className="stat-number">
						{stats?.pending_students || pendingStudents.length}
					</p>
				</div>
				<div className="stat-card">
					<h3>Total Donations</h3>
					<p className="stat-number">{stats?.total_donations || 0}</p>
				</div>
				<div className="stat-card">
					<h3>Amount Raised</h3>
					<p className="stat-number">
						KSh {(stats?.total_amount_raised || 0).toLocaleString()}
					</p>
				</div>
			</div>

			{/* Student Verification Section */}
			<div className="dashboard-section">
				<h2>Student Verification ({pendingStudents.length} pending)</h2>
				{pendingStudents.length === 0 ? (
					<div className="no-pending-students">
						<h3>No Pending Students</h3>
						<p>All student profiles have been reviewed.</p>
					</div>
				) : (
					<div className="pending-students-grid">
						{pendingStudents.map((student) => (
							<div key={student.id} className="pending-student-card">
								<div className="student-header">
									<div className="student-info">
										<div className="student-avatar">
											{student.profile_image ? (
												<img
													src={student.profile_image}
													alt={student.full_name}
												/>
											) : (
												student.full_name
													.split(" ")
													.map((n) => n[0])
													.join("")
											)}
										</div>
										<div className="student-details">
											<h3>{student.full_name}</h3>
											<p className="student-school">
												{student.academic_level} at {student.school_name}
											</p>
											<p className="funding-goal">
												Funding Goal: KSh {student.fee_amount.toLocaleString()}
											</p>
										</div>
									</div>
								</div>

								<div className="student-story">
									<h4>Student Story:</h4>
									<p className="story-text">{student.story}</p>
								</div>

								<div className="verification-actions">
									<button
										className="btn-approve"
										onClick={() =>
											handleStudentVerification(student.id, "approve")
										}
										style={{
											padding: "8px 16px",
											backgroundColor: "#28a745",
											color: "white",
											border: "none",
											borderRadius: "5px",
											cursor: "pointer",
										}}
									>
										✓ Approve
									</button>
									<button
										className="btn-reject"
										onClick={() =>
											handleStudentVerification(student.id, "reject")
										}
										style={{
											padding: "8px 16px",
											backgroundColor: "#dc3545",
											color: "white",
											border: "none",
											borderRadius: "5px",
											cursor: "pointer",
										}}
									>
										✗ Reject
									</button>
									<button
										className="btn-view-details"
										onClick={() => {
											// View full details in a modal or navigate to detail page
											alert(
												`Full details for ${student.full_name}:\n\nSchool: ${
													student.school_name
												}\nLevel: ${
													student.academic_level
												}\nAmount: KSh ${student.fee_amount.toLocaleString()}\n\nStory:\n${
													student.story
												}`,
											);
										}}
									>
										👁️ View Details
									</button>
								</div>
							</div>
						))}
					</div>
				)}
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
											<td>{donor.username}</td>
											<td>{donor.email}</td>
											<td>{new Date(donor.created_at).toLocaleDateString()}</td>
											<td>
												<button
													className="action-btn reject"
													onClick={() => {
														if (
															window.confirm(
																`Delete ${donor.username}'s account?`,
															)
														) {
															// Note: User deletion would need to be implemented in the backend
															alert(
																"User deletion not implemented in backend yet",
															);
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
											<td>
												{new Date(student.created_at).toLocaleDateString()}
											</td>
											<td>
												<button
													className="action-btn reject"
													onClick={() => {
														if (
															window.confirm(
																`Delete ${student.username}'s account?`,
															)
														) {
															// Note: User deletion would need to be implemented in the backend
															alert(
																"User deletion not implemented in backend yet",
															);
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
