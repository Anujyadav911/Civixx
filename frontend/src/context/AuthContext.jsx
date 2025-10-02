import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // 1. On initial load, try to get the user from Session Storage.
  // This provides an immediate, synchronous value for the UI.
  const [user, setUser] = useState(() => {
    try {
      const storedUser = sessionStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  // This effect runs only once to verify the session with the backend.
  useEffect(() => {
    const verifySession = async () => {
      try {
        // The browser automatically sends the secure cookie.
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          withCredentials: true,
        });

        // If the session is valid, update user data with the latest from the server.
        setUser(res.data);
        sessionStorage.setItem("user", JSON.stringify(res.data));
      } catch (err) {
        // If the cookie is invalid or expired, the server will send a 401.
        // In this case, we log the user out completely.
        console.log("No valid session found. Logging out.");
        setUser(null);
        sessionStorage.removeItem("user");
      } finally {
        // The initial authentication check is now complete.
        setLoading(false);
      }
    };

    verifySession();
  }, []);

  const login = (userData) => {
    setUser(userData);
    sessionStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setUser(null);
      sessionStorage.removeItem("user");
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
