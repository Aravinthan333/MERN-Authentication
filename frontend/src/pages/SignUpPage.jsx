import { Loader } from "lucide-react";
import { useState } from "react";
import { FaUser, FaEnvelope, FaLock, FaSignInAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom"; // If using routing for the login link
import { useAuthStore } from "../store/authStore";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { signup, isLoading } = useAuthStore();

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      await signup(email, password, name);
      navigate("/verify-email");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    // <div className="flex items-center justify-center p-8 bg-gray-100">
    <div className="w-full max-w-md p-10 space-y-8 bg-white shadow-md rounded-md">
      <h2 className="text-3xl font-bold text-center">Sign Up</h2>

      <form onSubmit={handleSignUp}>
        {/* Name Input */}
        <div className="relative mb-4">
          <FaUser className="absolute left-3 top-4 text-gray-400" />
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Email Input */}
        <div className="relative mb-4">
          <FaEnvelope className="absolute left-3 top-4 text-gray-400" />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Signup Button */}
        <button
          type="submit"
          className="w-full flex items-center justify-center p-3 space-x-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          {isLoading ? (
            <Loader className=" animate-spin mx-auto" size={24} />
          ) : (
            <>
              <FaSignInAlt />
              <span>Sign Up</span>
            </>
          )}
        </button>
      </form>

      {/* Already registered link */}
      <p className="text-center mt-4">
        Already registered?{" "}
        <Link to="/login" className="text-indigo-600 hover:underline">
          Log in here
        </Link>
      </p>
    </div>
    // </div>
  );
};

export default SignupPage;
