import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const EditPoll = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ question: "", description: "" });

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/polls/${id}`, {
          withCredentials: true,
        });
        setFormData({
          question: res.data.question,
          description: res.data.description,
        });
      } catch (err) {
        toast.error("Could not load poll data.");
        navigate("/polls");
      }
    };
    fetchPoll();
  }, [id, navigate]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/polls/${id}`, formData, {
        withCredentials: true,
      });
      toast.success("Poll updated successfully!");
      navigate("/polls");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update poll.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Poll</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-8">
        <div className="mb-4">
          <label htmlFor="question">Question</label>
          <input
            type="text"
            name="question"
            value={formData.question}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded"
        >
          Update Poll
        </button>
      </form>
    </div>
  );
};

export default EditPoll;
