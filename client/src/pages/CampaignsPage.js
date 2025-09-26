import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import apiService from "../services/api";

const CampaignsPage = () => {

	const { user, loading: authLoading } = useAuth();
	const [students, setStudents] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Load students from API
	useEffect(() => {
		const loadStudents = async () => {
			try {
				setLoading(true);
				setError(null);

				if (user?.role === "student") {
					// Students see their own profile
					const profile = await apiService.getMyProfile();
					setStudents(
						profile ? [apiService.transformStudentData(profile)] : [],
					);
				} else {
					// Donors, admins, and unauthenticated users see all verified students
					const response = await apiService.getStudents(true);
					const transformedStudents = response.students.map((student) =>
						apiService.transformStudentData(student),
					);
					setStudents(transformedStudents);
				}
			} catch (err) {
				console.error("Error loading students:", err);
				setError("Failed to load students. Please try again.");
				setStudents([]);
			} finally {
				setLoading(false);
			}
		};

		// Only wait for auth loading to complete, then load students regardless of auth status
		if (!authLoading) {
			loadStudents();
		}
	}, [user, authLoading]);

	if (authLoading || loading) {
		return (
			<div className="campaigns-page">
				<div className="page-header">
					<h1>Loading...</h1>
					<p>Please wait while we fetch the latest campaigns</p>
				</div>
				<div style={{ textAlign: "center", padding: "40px" }}>
					<div className="loading-spinner">⏳</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="campaigns-page">
				<div className="page-header">
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
		<div className="campaigns-page">
			<div className="page-header">
				<h1>
					{user?.role === "student" ? "My Campaign" : "Student Campaigns"}
				</h1>
				<p>
					{user?.role === "student"
						? "Track your campaign progress"
						: user
						? "Support students in their educational journey"
						: "Discover and support students in their educational journey"}
				</p>
			</div>

			<div className="students-grid">
				{user?.role === "student" && students.length === 0 && (
					<div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
						<h3>No Campaign Yet</h3>
						<p>
							Complete your profile in the student dashboard to create your
							campaign.
						</p>
					</div>
				)}
				{user?.role !== "student" && students.length === 0 && (
					<div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
						<h3>No Students Available</h3>
						<p>Check back later for new student campaigns.</p>
					</div>
				)}
				{students.map((student) => {
					const amountRaised = student.amount_raised || 0;
					const goalAmount = student.fee_amount || 0;
					const progressPercentage =
						goalAmount > 0 ? Math.round((amountRaised / goalAmount) * 100) : 0;

					return (
						<Link
							key={student.id}
							to={`/campaign/${student.id}`}
							className="student-card clickable-card"
							style={{ textDecoration: "none", color: "inherit" }}
						>
							<div className="verified-badge">
								{student.is_verified ? "✓" : "⏳"}
							</div>
							<div className="student-header">
								<div className="student-avatar">
									{student.profile_image ? (
										<img
											src={student.profile_image}
											alt={student.full_name}
											style={{
												width: "100%",
												height: "100%",
												objectFit: "cover",
												borderRadius: "50%",
											}}
										/>
									) : (
										student.full_name
											.split(" ")
											.map((n) => n[0])
											.join("")
									)}
								</div>
								<div className="student-info">
									<h3>{student.full_name}</h3>
									<p className="academic-level">{student.academic_level}</p>
									<p className="school-name">{student.school_name}</p>
								</div>
							</div>

							<div className="funding-info">
								<div className="amounts">
									{progressPercentage}% funded
									<br />
									KSh {amountRaised.toLocaleString()} raised
									<br />
									of KSh {goalAmount.toLocaleString()} goal
									<br />
									{student.supporters_count || 0} supporters
								</div>

								<div className="progress-circle">
									<svg width="60" height="60">
										<circle
											cx="30"
											cy="30"
											r="25"
											fill="none"
											stroke="#e0e0e0"
											strokeWidth="4"
										/>
										<circle
											cx="30"
											cy="30"
											r="25"
											fill="none"
											stroke="#4CAF50"
											strokeWidth="4"
											strokeDasharray={`${2 * Math.PI * 25}`}
											strokeDashoffset={`${
												2 * Math.PI * 25 * (1 - progressPercentage / 100)
											}`}
											transform="rotate(-90 30 30)"
										/>
										<text
											x="30"
											y="35"
											textAnchor="middle"
											fontSize="12"
											fill="#333"
										>
											{progressPercentage}%
										</text>
									</svg>
								</div>
							</div>

							<p className="story">{student.story.substring(0, 100)}...</p>

							<div className="card-actions">
								<div className="funding-status">
									{amountRaised >= goalAmount ? (
										<span className="goal-achieved-badge">Goal Achieved</span>
									) : (
										<span className="needs-funding-badge">
											Needs KSh {(goalAmount - amountRaised).toLocaleString()}
										</span>
									)}
								</div>
							</div>
						</Link>
					);
				})}
			</div>
		</div>
	);
};

export default CampaignsPage;
