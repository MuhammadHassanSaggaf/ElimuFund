import React, {
	createContext,
	useContext,
	useState,
	useMemo,
	useCallback,
	useEffect,
} from "react";
import apiService from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [loading, setLoading] = useState(true);

	// Check session on app load
	useEffect(() => {
		const checkSession = async () => {
			try {
				const response = await apiService.checkSession();
				if (response.authenticated) {
					setUser(response.user);
					setIsAuthenticated(true);
				}
			} catch (error) {
				console.log("No active session");
			} finally {
				setLoading(false);
			}
		};

		checkSession();
	}, []);

	const login = useCallback(async (credentials) => {
		try {
			const response = await apiService.login(credentials);
			setUser(response.user);
			setIsAuthenticated(true);
			return response;
		} catch (error) {
			throw error;
		}
	}, []);

	const signup = useCallback(async (userData) => {
		try {
			const response = await apiService.signup(userData);
			setUser(response.user);
			setIsAuthenticated(true);
			return response;
		} catch (error) {
			throw error;
		}
	}, []);

	const logout = useCallback(async () => {
		try {
			await apiService.logout();
		} catch (error) {
			console.error("Logout error:", error);
		} finally {
			setUser(null);
			setIsAuthenticated(false);
		}
	}, []);

	const contextValue = useMemo(
		() => ({
			user,
			isAuthenticated,
			loading,
			login,
			signup,
			logout,
		}),
		[user, isAuthenticated, loading, login, signup, logout],
	);

	return (
		<AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
