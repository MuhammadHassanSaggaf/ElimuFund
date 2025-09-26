import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import StudentDetailsForm from "../components/StudentDetailsForm";
import apiService from "../services/api";
import NotificationSystem from "../components/NotificationSystem";

const StudentDashboard = () => {

	const { user } = useAuth();
	const navigate = useNavigate();
	const [profileComplete, setProfileComplete] = useState(false);
	const [studentData, setStudentData] = useState(null);
	const [campaignData, setCampaignData] = useState(null);
	const [donations, setDonations] = useState([]);
	const [loading, setLoading] = useState(true);

	// Get live campaign data from API
	useEffect(() => {
		const loadStudentProfile = async () => {
			if (user?.role === "student") {
				try {
					setLoading(true);
					const profile = await apiService.getMyProfile();
					if (profile) {
						setCampaignData(apiService.transformStudentData(profile));
						setProfileComplete(true);

						// Load donations for this student (we'll need to implement this endpoint)
						// For now, we'll use empty array
						setDonations([]);
					}
				} catch (err) {
					console.error("Error loading student profile:", err);
					// Profile doesn't exist yet
					setProfileComplete(false);
				} finally {
					setLoading(false);
				}
			}
		};

		if (user) {
			loadStudentProfile();
		}
	}, [user]);

	const totalRaised = campaignData?.amount_raised || 0;
	const supportersCount = campaignData?.supporters_count || 0;

	// Calculate progress percentage
	const progressPercentage = studentData?.fundingNeeded
		? Math.round((totalRaised / studentData.fundingNeeded) * 100)
		: 0;

	const handleProfileSubmit = async (values) => {
		try {
			setLoading(true);

			// Check if profile already exists
			const existingProfile = await apiService.getMyProfile();
			
			const profileData = {
				full_name: values.full_name,
				academic_level: values.academic_level,
				school_name: values.school_name,
				fee_amount: Number(values.fee_amount),
				story: values.story,
				profile_image:
					values.profile_image || "https://picsum.photos/seed/student/300/300",
			};

			let response;
			if (existingProfile) {
				// Update existing profile
				response = await apiService.updateStudentProfile(existingProfile.id, profileData);
				console.log("Profile updated successfully:", response);
			} else {
				// Create new profile
				response = await apiService.createStudentProfile(profileData);
				console.log("Profile created successfully:", response);
			}

			// Update local state with new data
			setStudentData(values);
			setCampaignData(apiService.transformStudentData(response.profile));
			setProfileComplete(true);

			// Show success message
			alert("Profile updated successfully!");

			// Refresh the page to show updated data from backend
			setTimeout(() => {
				window.location.reload();
			}, 1500);
		} catch (err) {
			console.error("Error updating student profile:", err);
			alert("Failed to update profile. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	if (!profileComplete) {
		return (
			<div className="student-dashboard">
				<StudentDetailsForm 
					onSubmit={handleProfileSubmit} 
					initialValues={campaignData ? {
						full_name: campaignData.full_name || '',
						academic_level: campaignData.academic_level || '',
						school_name: campaignData.school_name || '',
						fee_amount: campaignData.fee_amount || '',
						story: campaignData.story || '',
						profile_image: campaignData.profile_image || ''
					} : {}}
				/>
			</div>
		);
	}


	return (
		<div className="modern-dashboard">
			<div className="dashboard-container">
				{/* Header Section */}
				<div className="dashboard-header">
					<div className="welcome-section">
						<h1>Welcome back, {user?.name}!</h1>
						<p>Track your campaign progress and manage your profile</p>
					</div>
					<div className="header-actions">
						<button
							className="edit-btn"
							onClick={() => setProfileComplete(false)}
						>
							Edit Profile
						</button>
						<button
							className="delete-btn"
							onClick={() => {
								if (
									window.confirm(
										"Are you sure you want to delete your account? This action cannot be undone.",
									)
								) {
									// Remove user's campaign from localStorage
									const allStudents = JSON.parse(
										localStorage.getItem("students") || "[]",
									);
									const updatedStudents = allStudents.filter(
										(s) => s.full_name !== user?.name,
									);
									localStorage.setItem(
										"students",
										JSON.stringify(updatedStudents),
									);

									// Clear user session and redirect
									localStorage.removeItem("user");
									alert("Account deleted successfully");
									window.location.href = "/";
								}
							}}
						>
							Delete Account
						</button>
					</div>
				</div>

				{/* Stats Overview */}
				<div className="stats-overview">
					<div className="stat-card primary">
						<div className="stat-content">
							<h3>KSh {totalRaised.toLocaleString()}</h3>
							<p>Total Raised</p>
						</div>
					</div>
					<div className="stat-card success">
						<div className="stat-content">
							<h3>KSh {studentData?.fundingNeeded}</h3>
							<p>Goal Amount</p>
						</div>
					</div>
					<div className="stat-card info">
						<div className="stat-content">
							<h3>{supportersCount}</h3>
							<p>Supporters</p>
						</div>
					</div>
					<div className="stat-card warning">
						<div className="stat-content">
							<h3>{progressPercentage}%</h3>
							<p>Progress</p>
							<div className="progress-bar-mini">
								<div
									className="progress-fill-mini"
									style={{ width: `${progressPercentage}%` }}
								></div>
							</div>
						</div>
					</div>
				</div>

				{/* Main Content Grid */}
				<div className="dashboard-grid">
					{/* Profile Card */}
					<div className="dashboard-card profile-card">
						<div className="card-header">
							<h2>Your Profile</h2>
						</div>
						<div className="profile-details">
							<div className="detail-item">
								<span className="label">Institution:</span>
								<span className="value">{studentData?.institution}</span>
							</div>
							<div className="detail-item">
								<span className="label">Course:</span>
								<span className="value">{studentData?.course}</span>
							</div>
							<div className="detail-item">
								<span className="label">Year:</span>
								<span className="value">{studentData?.yearOfStudy}</span>
							</div>
							<div className="detail-item">
								<span className="label">Purpose:</span>
								<span className="value">{studentData?.purpose}</span>
							</div>
						</div>
					</div>

					{/* Campaign Status */}
					<div className="dashboard-card campaign-card">
						<div className="card-header">
							<h2>Campaign Status</h2>
						</div>
						<div className="campaign-status">
							<div className="status-indicator pending">
								<div className="status-dot"></div>
								<span>Pending Review</span>
							</div>
							<p className="status-description">
								Your campaign is being reviewed. This usually takes 24-48 hours.
							</p>
							<div className="campaign-actions">
								<button
									className="submit-campaign-btn"
									onClick={() => {
										if (campaignData?.id) {
											navigate(`/campaign/${campaignData.id}`);
										} else {
											alert("Campaign is now live!");
											setTimeout(() => navigate("/campaigns"), 1000);
										}
									}}
								>
									{campaignData?.id
										? "View My Campaign"
										: "Make Campaign Live"}
								</button>
							</div>
						</div>
					</div>

					{/* Donations Received */}
					<div className="dashboard-card donations-card">
						<div className="card-header">
							<h2>Recent Donations</h2>
						</div>
						<div className="donations-content">
							{donations.length === 0 ? (
								<p
									style={{
										textAlign: "center",
										color: "#666",
										padding: "20px",
									}}
								>
									No donations yet
								</p>
							) : (
								<div className="donations-list">
									{donations.map((donation) => (
										<div key={donation.id} className="donation-item">
											<div className="donation-info">
												<span className="donor-name">{donation.donor}</span>
												<span className="donation-amount">
													KSh {donation.amount.toLocaleString()}
												</span>
											</div>
											<div className="donation-date">
												{new Date(donation.date).toLocaleDateString()}
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				</div>


				{/* Notifications Section */}
				<div className="dashboard-card notifications-card">
					<NotificationSystem userId={user?.id} />
				</div>
			</div>
		</div>
	);
 
};

export default StudentDashboard;
