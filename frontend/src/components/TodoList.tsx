"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const TodoList = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { getToken, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTodos = async () => {
      const token = getToken();

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch("http://localhost:3006/todos", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setMessage(data.message);
        } else if (response.status === 401 || response.status === 403) {
          // Token is invalid, redirect to login
          navigate("/login");
        } else {
          setError("Failed to fetch todos");
        }
      } catch (error) {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, [getToken, navigate]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-lg font-medium text-gray-600">Loading...</div>
      </div>
    );

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Todo List</h1>
        {error && (
          <div className="mb-4 p-2 text-sm text-red-600 bg-red-100 border border-red-300 rounded">
            {error}
          </div>
        )}
        {message && (
          <div className="p-4 bg-green-50 border border-green-300 rounded text-green-700">
            <p className="mb-2">{message}</p>
            <p>Authentication is working perfectly! 🎉</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoList;
