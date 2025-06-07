"use client";

import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Brand */}
        <div className="text-xl font-bold text-gray-800">
          <Link to="/" className="hover:text-blue-600">
            MERN Todo
          </Link>
        </div>

        {/* Links */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-gray-700">
                Welcome, <span className="font-semibold">{user.username}</span>!
              </span>
              <Link
                to="/todos"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Todos.
              </Link>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg shadow hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg shadow hover:bg-blue-600"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
