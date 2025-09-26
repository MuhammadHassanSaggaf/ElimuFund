// API service for connecting to Flask backend
// Use CRA proxy in development to keep cookies same-origin
const API_BASE_URL = process.env.REACT_APP_API_URL || "/api";

class ApiService {
	constructor() {
		this.baseURL = API_BASE_URL;
	}

	// Helper method to make HTTP requests
	async request(endpoint, options = {}) {
		const url = `${this.baseURL}${endpoint}`;
		const config = {
			headers: {
				"Content-Type": "application/json",
				...options.headers,
			},
			credentials: "include", // Important for session cookies
			...options,
		};

		try {
			const response = await fetch(url, config);
			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || `HTTP error! status: ${response.status}`);
			}

			return data;
		} catch (error) {
			console.error("API request failed:", error);
			throw error;
		}
	}

	// Authentication endpoints
	async signup(userData) {
		return this.request("/signup", {
			method: "POST",
			body: JSON.stringify({
				fullName: userData.fullName,
				email: userData.email,
				password: userData.password,
				userType: userData.userType,
			}),
		});
	}

	async login(credentials) {
		return this.request("/login", {
			method: "POST",
			body: JSON.stringify({
				email: credentials.email,
				password: credentials.password,
			}),
		});
	}

	async logout() {
		return this.request("/logout", {
			method: "DELETE",
		});
	}

	async checkSession() {
		return this.request("/check-session", {
			method: "GET",
		});
	}

	// Student endpoints
	async getStudents(verifiedOnly = true) {
		const params = new URLSearchParams({ verified: verifiedOnly });
		return this.request(`/students?${params}`);
	}

	async getStudentById(id) {
		return this.request(`/students/${id}`);
	}

	async createStudentProfile(profileData) {
		return this.request("/student-profiles", {
			method: "POST",
			body: JSON.stringify({
				full_name: profileData.full_name,
				academic_level: profileData.academic_level,
				school_name: profileData.school_name,
				fee_amount: profileData.fee_amount,
				story: profileData.story,
				profile_image: profileData.profile_image || "/api/placeholder/300/300",
			}),
		});
	}

	async updateStudentProfile(id, updates) {
		return this.request(`/student-profiles/${id}`, {
			method: "PATCH",
			body: JSON.stringify(updates),
		});
	}

	async getMyProfile() {
		return this.request("/my-profile");
	}

	// Donation endpoints
	async createDonation(donationData) {
		return this.request("/donations", {
			method: "POST",
			body: JSON.stringify({
				student_id: donationData.student_id,
				amount: donationData.amount,
				anonymous: donationData.anonymous || false,
				message: donationData.message || "",
				paymentMethod: donationData.paymentMethod || "mpesa",
			}),
		});
	}

	async getMyDonations() {
		return this.request("/donations");
	}

	async getSupportedStudents() {
		return this.request("/my-students");
	}

	async cancelDonation(id) {
		return this.request(`/donations/${id}`, {
			method: "DELETE",
		});
	}

	// Supporters/Following endpoints
	async followStudent(studentId) {
		return this.request(`/students/${studentId}/follow`, {
			method: "POST",
		});
	}

	async unfollowStudent(studentId) {
		return this.request(`/students/${studentId}/unfollow`, {
			method: "DELETE",
		});
	}

	async getMyFollowedStudents() {
		return this.request("/my-followed-students");
	}

	async getStudentSupporters(studentId) {
		return this.request(`/students/${studentId}/supporters`);
	}

	async checkIfFollowing(studentId) {
		return this.request(`/students/${studentId}/following-status`);
	}

	// Admin endpoints
	async getAdminStats() {
		return this.request("/admin/dashboard-stats");
	}

	async getPendingStudents() {
		return this.request("/admin/students/pending");
	}

	async verifyStudent(id, action = "approve") {
		return this.request(`/admin/students/${id}/verify`, {
			method: "PATCH",
			body: JSON.stringify({ action }),
		});
	}

	async getAllDonations() {
		return this.request("/admin/donations");
	}

	async getAllUsers() {
		return this.request("/admin/users");
	}

	// Test endpoint
	async testConnection() {
		return this.request("/test");
	}

	// Utility methods for data transformation
	transformStudentData(apiStudent) {
		return {
			id: apiStudent.id,
			full_name: apiStudent.full_name,
			academic_level: apiStudent.academic_level,
			school_name: apiStudent.school_name,
			fee_amount: apiStudent.fee_amount,
			amount_raised: apiStudent.amount_raised,
			story: apiStudent.story,
			profile_image: apiStudent.profile_image,
			is_verified: apiStudent.is_verified,
			supporters_count: apiStudent.total_donors || 0,
			followers_count: apiStudent.followers_count || 0,
			is_following: apiStudent.is_following || false,
			percentage_raised: apiStudent.percentage_raised || 0,
			remaining_amount: apiStudent.remaining_amount || 0,
			created_at: apiStudent.created_at,
			user_id: apiStudent.user_id,
		};
	}

	transformUserData(apiUser) {
		return {
			id: apiUser.id,
			username: apiUser.username,
			email: apiUser.email,
			role: apiUser.role,
			name: apiUser.username, // For compatibility with existing code
			created_at: apiUser.created_at,
		};
	}
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
