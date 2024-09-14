import { useState } from "react";
import { FaLock } from "react-icons/fa";
import { useAuthStore } from "../store/authStore";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const ResetPasswordPage = () => {
  // const [formData, setFormData] = useState({
  //   email: "",
  //   password: "",
  // });

  // const handleChange = (e) => {
  //   setFormData({
  //     ...formData,
  //     [e.target.name]: e.target.value,
  //   });
  // };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   // Submit the form data to backend
  //   console.log(formData);
  // };

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { resetPassword, error, isLoading, message } = useAuthStore();

  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      await resetPassword(token, password);

      toast.success(
        "Password reset successfully, redirecting to login page..."
      );
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Error resetting password");
    }
  };

  return (
    <div className="w-full max-w-md p-10 space-y-8 bg-white shadow-md rounded-md">
      <h2 className="text-3xl font-bold text-center">Password Reset</h2>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      {message && <p className="text-green-500 text-sm mb-4">{message}</p>}

      <form onSubmit={handleSubmit}>
        <div className="relative mb-4">
          <FaLock className="absolute left-3 top-4 text-gray-400" />
          <input
            type="password"
            name="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="relative mb-4">
          <FaLock className="absolute left-3 top-4 text-gray-400" />
          <input
            type="password"
            name="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Verify Button */}
        <button
          type="submit"
          className="w-full flex items-center justify-center p-3 space-x-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          {isLoading ? "Resetting..." : "Set New Password"}
          {/* <FaSignInAlt />
          <span>Confirm</span> */}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
