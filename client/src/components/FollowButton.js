import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import apiService from "../services/api";

const FollowButton = ({
	studentId,
	initialFollowing = false,
	onFollowChange,
}) => {
	const { user } = useAuth();
	const [isFollowing, setIsFollowing] = useState(initialFollowing);
	const [loading, setLoading] = useState(false);

	// Check if user is following this student on component mount
	useEffect(() => {
		const checkFollowingStatus = async () => {
			if (user && user.role === "donor" && studentId) {
				try {
					const response = await apiService.checkIfFollowing(studentId);
					setIsFollowing(response.is_following);
				} catch (error) {
					console.error("Error checking following status:", error);
				}
			}
		};

		checkFollowingStatus();
	}, [user, studentId]);

	const handleFollowToggle = async () => {
		if (!user || user.role !== "donor") {
			alert("Please log in as a donor to follow students");
			return;
		}

		setLoading(true);
		try {
			if (isFollowing) {
				await apiService.unfollowStudent(studentId);
				setIsFollowing(false);
				if (onFollowChange) onFollowChange(false);
			} else {
				await apiService.followStudent(studentId);
				setIsFollowing(true);
				if (onFollowChange) onFollowChange(true);
			}
		} catch (error) {
			console.error("Error toggling follow status:", error);
			alert("Failed to update follow status. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	// Don't show follow button for students or non-logged in users
	if (!user || user.role !== "donor") {
		return null;
	}

	return (
		<button
			onClick={handleFollowToggle}
			disabled={loading}
			style={{
				backgroundColor: isFollowing ? "#dc3545" : "#28a745",
				color: "white",
				border: "none",
				borderRadius: "4px",
				padding: "8px 16px",
				cursor: loading ? "not-allowed" : "pointer",
				fontSize: "14px",
				fontWeight: "500",
				transition: "background-color 0.2s",
				opacity: loading ? 0.7 : 1,
			}}
		>
			{loading ? "..." : isFollowing ? "Unfollow" : "Follow"}
		</button>
	);
};

export default FollowButton;
