import axios from "axios";
import { useState } from "react";
import { FaLock, FaSignInAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";

const EmailVerificationPage = () => {
  const [code, setCode] = useState();
  const navigate = useNavigate();

  const { error, isLoading, verifyEmail } = useAuthStore();

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   // Submit the form data to backend
  //   const response = await axios.post(
  //     "http://localhost:3000/api/auth/verifyEmail",
  //     { code },
  //     { type: "application/json" }
  //   );
  //   if (response.status === 200) {
  //     navigate("/login");
  //   }
  //   console.log(response);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = code.join("");
    try {
      await verifyEmail(verificationCode);
      navigate("/");
      toast.success("Email verified successfully");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full max-w-md p-10 space-y-8 bg-white shadow-md rounded-md">
      <h2 className="text-3xl font-bold text-center">Email Verification</h2>

      <form onSubmit={handleSubmit}>
        {/* Email Input */}
        <div className="relative mb-4">
          <FaLock className="absolute left-3 top-4 text-gray-400" />
          <input
            type="text"
            name="code"
            placeholder="OTP"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Verify Button */}
        <button
          type="submit"
          className="w-full flex items-center justify-center p-3 space-x-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          {isLoading ? "Verifying..." : "Verify Email"}
        </button>
      </form>
    </div>
  );
};

export default EmailVerificationPage;
