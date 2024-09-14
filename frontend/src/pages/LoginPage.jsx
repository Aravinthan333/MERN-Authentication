import axios from "axios";
import { useState } from "react";
import { Loader } from "lucide-react";
import { FaEnvelope, FaLock, FaSignInAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom"; // If using routing for the login link
import { useAuthStore } from "../store/authStore";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [isLoading, setIsLoading] = useState(false);

  // const navigate = useNavigate();

  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   // Submit the form data to backend
  //   const response = await axios.post("http://localhost:3000/api/auth/login", {
  //     email,
  //     password,
  //   });
  //   // navigate("/");
  //   console.log(response.data);
  //   setIsLoading(false);
  // };

  const { login, isLoading } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    // <div className="flex items-center justify-center p-8 bg-gray-100">
    <div className="w-full max-w-md p-10 space-y-8 bg-white shadow-md rounded-md">
      <h2 className="text-3xl font-bold text-center">Login</h2>

      <form onSubmit={handleLogin}>
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

        {/* Login Button */}
        <button
          type="submit"
          className="w-full flex items-center justify-center p-3 space-x-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          {isLoading ? (
            <Loader className="w-6 h-6 animate-spin  mx-auto" />
          ) : (
            <>
              <FaSignInAlt />
              <span>Login</span>
            </>
          )}
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
