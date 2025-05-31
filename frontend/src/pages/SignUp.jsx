import { useState } from "react";
import { useNavigate } from "react-router-dom";
import email from "/assets/icons/email.svg";
import oeye from "/assets/icons/oeye.svg";
import ceye from "/assets/icons/ceye.svg";

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // Simulate successful signup
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center w-screen bg-[#000828] px-4 font-nunito">
      <div className="text-center mb-8 animate-fade-in">
        <img 
          src="/UglyTruthLogo.svg" 
          alt="Ugly Truth Logo" 
          className="w-32 h-32 sm:w-40 sm:h-40 mx-auto hover:scale-105 transition-transform"
        />
        <div className="text-2xl sm:text-3xl font-pica text-[#f2eadf] mt-3">Ugly Truth</div>
      </div>

      <div className="bg-[#6d8f8b] rounded-2xl px-8 py-10 w-full max-w-md md:max-w-lg text-[#f2eadf] 
        shadow-2xl hover:shadow-3xl transition-shadow">
        <h2 className="text-2xl sm:text-3xl font-pica mb-8 text-center">Create Account</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full py-3 px-4 pr-12 bg-transparent border-2 border-[#f2eadf] text-[#f2eadf] 
                rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-[#f2eadf] transition-all
                group-hover:border-opacity-80 font-nunito"
              required
            />
            <div className="flex items-center justify-center absolute right-4 top-3.5">
              <img src={email} alt="Email Icon" className="w-6 h-6 transition-opacity group-hover:opacity-80" />
            </div>
          </div>

          <div className="relative group">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full py-3 px-4 pr-12 bg-transparent border-2 border-[#f2eadf] text-[#f2eadf] 
                rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-[#f2eadf] transition-all
                group-hover:border-opacity-80 font-nunito"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3.5 focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <img 
                src={showPassword ? oeye : ceye} 
                alt={showPassword ? "Hide password" : "Show password"} 
                className="w-6 h-6 transition-opacity group-hover:opacity-80" 
              />
            </button>
          </div>

          <div className="relative group">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full py-3 px-4 pr-12 bg-transparent border-2 border-[#f2eadf] text-[#f2eadf] 
                rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-[#f2eadf] transition-all
                group-hover:border-opacity-80 font-nunito"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-3.5 focus:outline-none"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              <img 
                src={showConfirmPassword ? oeye : ceye} 
                alt={showConfirmPassword ? "Hide password" : "Show password"} 
                className="w-6 h-6 transition-opacity group-hover:opacity-80" 
              />
            </button>
          </div>
          <button            type="submit"            className="w-full bg-[#f2eadf] text-[#181D31] py-3 rounded-lg text-lg font-pica
              hover:bg-[#ddd2c3] active:bg-[#c8beb0] transition-colors mt-8
              transform hover:scale-[1.02] active:scale-[0.98] duration-200"
          >
            Sign Up
          </button>
        </form>
        <div className="mt-6 text-base text-center text-[#181D31] font-nunito">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="underline text-[#F0E9D2] hover:text-[#f2eadf] transition-colors
              focus:outline-none focus:ring-2 focus:ring-[#f2eadf] rounded-sm text-lg font-nunito"
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
}
