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

						// Load donations for this student
						try {
							const donationsResponse = await apiService.getStudentDonations(profile.id);
							setDonations(donationsResponse.donations || []);
						} catch (donationErr) {
							console.log("No donations endpoint yet, using empty array");
							setDonations([]);
						}
					}
				} catch (err) {
					console.error("Error loading student profile:", err);
					// Profile doesn't exist yet - this is normal for new users
					setProfileComplete(false);
					setCampaignData(null);
					setDonations([]);
				} finally {
					setLoading(false);
				}
			}
		};

		if (user) {
			loadStudentProfile();
		}

		// Auto-refresh every 30 seconds to check for new donations and updates
		const refreshInterval = setInterval(() => {
			if (user?.role === "student" && profileComplete) {
				loadStudentProfile();
			}
		}, 30000);

		return () => clearInterval(refreshInterval);
	}, [user, profileComplete]);

	const totalRaised = campaignData?.amount_raised || 0;
	const supportersCount = campaignData?.supporters_count || 0;

	// Calculate progress percentage
	const progressPercentage = (campaignData?.fee_amount || studentData?.fee_amount)
		? Math.round((totalRaised / (campaignData?.fee_amount || studentData?.fee_amount)) * 100)
		: 0;

	const handleProfileSubmit = async (values) => {
		try {
			setLoading(true);

			console.log("Starting profile submission for user:", user);
			console.log("Form values:", values);

			const profileData = {
				full_name: values.full_name,
				academic_level: values.academic_level,
				school_name: values.school_name,
				fee_amount: Number(values.fee_amount),
				story: values.story,
				profile_image:
					values.profile_image || "https://picsum.photos/seed/student/300/300",
			};

			console.log("Profile data to submit:", profileData);

			let response;
			try {
				// First try to get existing profile
				const existingProfile = await apiService.getMyProfile();
				if (existingProfile) {
					// Update existing profile
					console.log("Updating existing profile...");
					response = await apiService.updateStudentProfile(existingProfile.id, profileData);
					console.log("Profile updated successfully:", response);
				}
			} catch (profileError) {
				// Profile doesn't exist, create new one
				console.log("Profile doesn't exist, creating new profile...");
				response = await apiService.createStudentProfile(profileData);
				console.log("Profile created successfully:", response);
			}

			// Update local state with new data
			setStudentData(values);
			setCampaignData(apiService.transformStudentData(response.profile));
			setProfileComplete(true);

			// Show success message
			alert("Profile saved successfully!");

			// Refresh the page to show updated data from backend
			setTimeout(() => {
				window.location.reload();
			}, 1500);
		} catch (err) {
			console.error("Error saving student profile:", err);
			console.error("Error details:", err.message);
			console.error("Error stack:", err.stack);
			alert(`Failed to save profile. Error: ${err.message}`);
		} finally {
			setLoading(false);
		}
	};

	// Show loading while checking authentication
	if (loading) {
		return (
			<div className="student-dashboard">
				<div style={{ textAlign: 'center', padding: '2rem' }}>
					<div className="loading-spinner">⏳</div>
					<h2>Loading...</h2>
					<p>Please wait while we set up your profile</p>
				</div>
			</div>
		);
	}

	// Check if user is authenticated
	if (!user || user.role !== 'student') {
		return (
			<div className="student-dashboard">
				<div style={{ textAlign: 'center', padding: '2rem' }}>
					<h2>Access Denied</h2>
					<p>Please sign up as a student to access this page.</p>
					<a href="/signup" className="btn-primary">Sign Up</a>
				</div>
			</div>
		);
	}

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
								alert("To delete your account, please contact our admin team at admin@elimufund.com. This ensures proper handling of any donations received.");
							}}
						>
							Contact Admin for Account Deletion
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
							<h3>KSh {(campaignData?.fee_amount || studentData?.fee_amount)?.toLocaleString()}</h3>
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
								<span className="label">School:</span>
								<span className="value">{campaignData?.school_name || studentData?.school_name}</span>
							</div>
							<div className="detail-item">
								<span className="label">Education Level:</span>
								<span className="value">{campaignData?.academic_level || studentData?.academic_level}</span>
							</div>
							<div className="detail-item">
								<span className="label">Fee Amount:</span>
								<span className="value">KSh {(campaignData?.fee_amount || studentData?.fee_amount)?.toLocaleString()}</span>
							</div>
							<div className="detail-item">
								<span className="label">Status:</span>
								<span className="value">{campaignData?.is_verified ? 'Verified' : 'Pending Review'}</span>
							</div>
						</div>
					</div>

					{/* Campaign Status */}
					<div className="dashboard-card campaign-card">
						<div className="card-header">
							<h2>Campaign Status</h2>
						</div>
						<div className="campaign-status">
							{campaignData?.is_verified ? (
								<div className="status-indicator approved">
									<div className="status-dot"></div>
									<span>Approved & Live</span>
								</div>
							) : (
								<div className="status-indicator pending">
									<div className="status-dot"></div>
									<span>Pending Review</span>
								</div>
							)}
							<p className="status-description">
								{campaignData?.is_verified 
									? "Your campaign has been approved and is now live! Donors can now contribute to your education."
									: "Your campaign is being reviewed. This usually takes 24-48 hours."
								}
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
					<NotificationSystem userId={user?.id} campaignData={campaignData} donations={donations} />
				</div>
			</div>
		</div>
	);
 
};

export default StudentDashboard;