import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";

const DashboardContent = () => {
  // 1. Get the loading state from AuthContext, renaming it to authLoading
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState({
    myPetitions: 0,
    successfulPetitions: 0,
    pollsCreated: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/dashboard/stats",
          {
            withCredentials: true,
          }
        );
        setStats(res.data);
      } catch (err) {
        toast.error("Could not load dashboard stats.");
      } finally {
        setLoading(false);
      }
    };

    // 2. Only fetch stats after the main authentication check is finished
    if (!authLoading && user) {
      fetchStats();
    }
  }, [authLoading, user]); // 3. Rerun this effect when authLoading or user changes

  // Show a loading state if either the auth check or the stats fetch is in progress
  if (authLoading || loading) {
    return <div>Loading dashboard...</div>;
  }

  // This can happen if the auth check finishes but the user is not logged in
  if (!user) {
    return <div>Please log in to view the dashboard.</div>;
  }

  return (
    <>
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="font-semibold text-[#2D3E50]">
          Welcome back, {user.name}!
        </h2>
        <p className="text-gray-600">
          See what's happening in your community and make your voice heard.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-4 border-t-4 border-[#E84C3D]">
          <h3 className="text-gray-500 text-sm">My Petitions</h3>
          <p className="text-2xl font-bold text-[#2D3E50]">
            {stats.myPetitions}
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 border-t-4 border-[#E84C3D]">
          <h3 className="text-gray-500 text-sm">Successful Petitions</h3>
          <p className="text-2xl font-bold text-[#2D3E50]">
            {stats.successfulPetitions}
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 border-t-4 border-[#E84C3D]">
          <h3 className="text-gray-500 text-sm">Polls Created</h3>
          <p className="text-2xl font-bold text-[#2D3E50]">
            {stats.pollsCreated}
          </p>
        </div>
      </div>
    </>
  );
};

export default DashboardContent;
