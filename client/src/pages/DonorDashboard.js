import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProgressBar from "../components/ProgressBar";
import { useAuth } from "../context/AuthContext";

import apiService from "../services/api";

const DonorDashboard = () => {

	const { user } = useAuth();
	const [allStudents, setAllStudents] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [cardsVisible, setCardsVisible] = useState(false);

	useEffect(() => {
		const loadStudents = async () => {
			try {
				setLoading(true);
				setError(null);
				const response = await apiService.getStudents(true); // Get verified students
				const transformedStudents = response.students.map((student) =>
					apiService.transformStudentData(student),
				);
				setAllStudents(transformedStudents);
			} catch (err) {
				console.error("Error loading students:", err);
				setError("Failed to load students");
				setAllStudents([]);
			} finally {
				setLoading(false);
			}
		};

		if (user) {
			loadStudents();
		}
	}, [user]);

	useEffect(() => {
		const handleScroll = () => {
			const cardsSection = document.querySelector('.donor-students-grid');
			if (cardsSection) {
				const rect = cardsSection.getBoundingClientRect();
				const windowHeight = window.innerHeight;
				
				// Trigger animation when cards section is 50% visible
				if (rect.top <= windowHeight * 0.5 && rect.bottom >= 0) {
					setCardsVisible(true);
				}
			}
		};

		// Add scroll listener
		window.addEventListener('scroll', handleScroll);
		
		// Check on mount in case cards are already visible
		handleScroll();

		// Cleanup
		return () => window.removeEventListener('scroll', handleScroll);
	}, [allStudents.length]);

	const studentsNeedingHelp = allStudents.filter(
		(s) => (s.amount_raised || 0) < s.fee_amount,
	);
	const totalStudents = allStudents.length;
	const totalFundingNeeded = studentsNeedingHelp.reduce(
		(sum, s) => sum + (s.fee_amount - (s.amount_raised || 0)),
		0,
	);

	if (loading) {
		return (
			<div className="donor-dashboard-page">
				<div className="donor-dashboard-header">
					<h1>Loading...</h1>
					<p>Please wait while we fetch the latest student campaigns</p>
				</div>
				<div className="donor-loading-container">
					<div className="donor-loading-spinner"></div>
					<p>Loading student campaigns...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="donor-dashboard-page">
				<div className="donor-dashboard-header">
					<h1>Error</h1>
					<p>{error}</p>
				</div>
				<div className="donor-error-container">
					<button
						onClick={() => window.location.reload()}
						className="donor-error-button"
					>
						Try Again
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="donor-dashboard-page">
			<div className="donor-dashboard-header">
				<h1>Students Who Need Help</h1>
				<p>Find students to support in their educational journey</p>
			</div>

			<div className="donor-dashboard-stats">
				<div className="donor-stat-card">
					<h3>Students Needing Help</h3>
					<p className="donor-stat-number">{studentsNeedingHelp.length}</p>
				</div>
				<div className="donor-stat-card">
					<h3>Total Students</h3>
					<p className="donor-stat-number">{totalStudents}</p>
				</div>
				<div className="donor-stat-card">
					<h3>Funding Needed</h3>
					<p className="donor-stat-number">
						KSh {totalFundingNeeded.toLocaleString()}
					</p>
				</div>
			</div>

			<div className="donor-dashboard-section">
				<h2>Students Who Need Your Help</h2>
				<div className={`donor-students-grid ${cardsVisible ? 'cards-visible' : ''}`}>
					{studentsNeedingHelp.length === 0 ? (
						<div className="donor-empty-state">
							<p>No students need help at the moment</p>
						</div>
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
									className="donor-student-help-card"
								>
									<div className="donor-student-info">
										<h4>{student.full_name}</h4>
										<div className="donor-student-detail">
											<span className="donor-student-detail-label">School:</span>
											<span>{student.school_name}</span>
										</div>
										<div className="donor-student-detail">
											<span className="donor-student-detail-label">Level:</span>
											<span>{student.academic_level}</span>
										</div>
									</div>
									<div className="donor-funding-info">
										<div className="donor-funding-progress">
											<ProgressBar percentage={progressPercentage} />
										</div>
										<div className="donor-funding-stats">
											<div className="donor-funding-stat">
												<div className="donor-funding-stat-label">Progress</div>
												<div className="donor-funding-stat-value">{progressPercentage}%</div>
											</div>
											<div className="donor-funding-stat">
												<div className="donor-funding-stat-label">Raised</div>
												<div className="donor-funding-stat-value">KSh {amountRaised.toLocaleString()}</div>
											</div>
											<div className="donor-funding-stat">
												<div className="donor-funding-stat-label">Needed</div>
												<div className="donor-funding-stat-value">KSh {amountNeeded.toLocaleString()}</div>
											</div>
										</div>
									</div>
									<button className="donor-help-button">
										Help {student.full_name.split(" ")[0]}
									</button>
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
