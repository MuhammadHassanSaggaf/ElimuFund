import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import StudentCard from "../components/StudentCard";
import LoadingSpinner from "../components/LoadingSpinner";
import apiService from "../services/api";

const FollowedStudentsPage = () => {
	const { user } = useAuth();
	const [followedStudents, setFollowedStudents] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const loadFollowedStudents = async () => {
			if (user?.role === "donor") {
				try {
					setLoading(true);
					setError(null);
					const response = await apiService.getMyFollowedStudents();
					const transformedStudents = response.students.map((student) =>
						apiService.transformStudentData(student),
					);
					setFollowedStudents(transformedStudents);
				} catch (err) {
					console.error("Error loading followed students:", err);
					setError("Failed to load followed students");
					setFollowedStudents([]);
				} finally {
					setLoading(false);
				}
			}
		};

		if (user) {
			loadFollowedStudents();
		}
	}, [user]);

	if (!user) {
		return (
			<div className="error-page">
				<div className="error-container">
					<h2>Please Log In</h2>
					<p>You need to be logged in to view your followed students.</p>
					<Link to="/login" className="back-btn">
						Go to Login
					</Link>
				</div>
			</div>
		);
	}

	if (user.role !== "donor") {
		return (
			<div className="error-page">
				<div className="error-container">
					<h2>Access Denied</h2>
					<p>Only donors can follow students.</p>
					<Link to="/" className="back-btn">
						Go Home
					</Link>
				</div>
			</div>
		);
	}

	if (loading) {
		return (
			<div className="page-container">
				<div className="loading-container">
					<LoadingSpinner />
					<h2>Loading your followed students...</h2>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="error-page">
				<div className="error-container">
					<h2>Error Loading Students</h2>
					<p>{error}</p>
					<button onClick={() => window.location.reload()} className="back-btn">
						Try Again
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="page-container">
			<div className="page-header">
				<h1>My Followed Students</h1>
				<p>Students you're following and supporting</p>
			</div>

			{followedStudents.length === 0 ? (
				<div className="empty-state">
					<div className="empty-icon">👥</div>
					<h3>No Students Followed Yet</h3>
					<p>
						Start following students to track their progress and show your
						support!
					</p>
					<Link to="/campaigns" className="cta-button">
						Browse Students
					</Link>
				</div>
			) : (
				<div className="students-grid">
					{followedStudents.map((student) => (
						<StudentCard key={student.id} student={student} />
					))}
				</div>
			)}

			<div className="page-footer">
				<Link to="/campaigns" className="back-link">
					← Back to All Campaigns
				</Link>
			</div>
		</div>
	);
};

export default FollowedStudentsPage;
