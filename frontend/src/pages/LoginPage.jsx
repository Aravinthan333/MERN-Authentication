import { useState } from "react";
import { FaUser, FaEnvelope, FaLock, FaSignInAlt } from "react-icons/fa";
import { Link } from "react-router-dom"; // If using routing for the login link

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit the form data to backend
    console.log(formData);
  };

  return (
    // <div className="flex items-center justify-center p-8 bg-gray-100">
    <div className="w-full max-w-md p-10 space-y-8 bg-white shadow-md rounded-md">
      <h2 className="text-3xl font-bold text-center">Login</h2>

      <form onSubmit={handleSubmit}>
        {/* Email Input */}
        <div className="relative mb-4">
          <FaEnvelope className="absolute left-3 top-4 text-gray-400" />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Password Input */}
        <div className="relative mb-4">
          <FaLock className="absolute left-3 top-4 text-gray-400" />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="w-full flex items-center justify-center p-3 space-x-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          <FaSignInAlt />
          <span>Login</span>
        </button>
      </form>

      {/* Already registered link */}
      <p className="text-center mt-4">
        Don't have an account?{" "}
        <Link to="/login" className="text-indigo-600 hover:underline">
          Signup here
        </Link>
      </p>
    </div>
    // </div>
  );
};

export default LoginPage;
