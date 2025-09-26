import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AboutPage from "./pages/AboutPage";
import HomePage from "./pages/HomePage";
import HowItWorksPage from "./pages/HowItWorksPage";
import SupportPage from "./pages/SupportPage";
import FAQPage from "./pages/FAQPage";
import TermsPage from "./pages/TermsPage";
import CampaignsPage from "./pages/CampaignsPage";
import CampaignDetailPage from "./pages/CampaignDetailPage";
import DonorDashboard from "./pages/DonorDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import FollowedStudentsPage from "./pages/FollowedStudentsPage";
import "./App.css";

const App = () => {
	return (
		<AuthProvider>
			<Router>
				<div className="app">
					<Navbar />
					<main className="main-content">
						<Routes>
							<Route path="/" element={<HomePage />} />
							<Route path="/campaigns" element={<CampaignsPage />} />
							<Route path="/about" element={<AboutPage />} />
							<Route path="/how-it-works" element={<HowItWorksPage />} />
							<Route path="/contact" element={<SupportPage />} />
							<Route path="/faq" element={<FAQPage />} />
							<Route path="/terms" element={<TermsPage />} />
							<Route path="/login" element={<LoginPage />} />
							<Route path="/signup" element={<SignupPage />} />
							<Route path="/campaign/:id" element={<CampaignDetailPage />} />
							<Route path="/donor-dashboard" element={<DonorDashboard />} />
							<Route path="/student-dashboard" element={<StudentDashboard />} />
							<Route path="/admin-dashboard" element={<AdminDashboard />} />
							<Route
								path="/followed-students"
								element={<FollowedStudentsPage />}
							/>
						</Routes>
					</main>
					<Footer />
				</div>
			</Router>
		</AuthProvider>
	);
};

export default App;
