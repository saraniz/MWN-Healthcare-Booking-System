"use client";

import { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  Check,
  AlertCircle,
  Heart,
} from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    acceptTerms: "",
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
  };

  const getStrengthColor = (strength: number) => {
    if (strength < 50) return "bg-red-500";
    if (strength < 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = (strength: number) => {
    if (strength < 50) return "Weak";
    if (strength < 75) return "Good";
    return "Strong";
  };

  const validateForm = () => {
    const newErrors = {
      fullName: "",
      email: "",
      mobile: "",
      password: "",
      confirmPassword: "",
      acceptTerms: "",
    };

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    const mobileRegex = /^[0-9]{10,15}$/;
    if (!formData.mobile) {
      newErrors.mobile = "Mobile number is required";
    } else if (!mobileRegex.test(formData.mobile.replace(/\s/g, ""))) {
      newErrors.mobile = "Please enter a valid mobile number (10-15 digits)";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one lowercase letter";
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter";
    } else if (
      !/[0-9]/.test(formData.password) &&
      !/[^A-Za-z0-9]/.test(formData.password)
    ) {
      newErrors.password =
        "Password must contain at least one number or special character";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "You must accept the terms to continue";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Registration successful:", {
        fullName: formData.fullName,
        email: formData.email,
        mobile: formData.mobile,
      });
      alert("Registration successful! Redirecting to login...");
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }

    if (name === "password") {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 3 && value.length <= 6) {
      value = value.replace(/(\d{3})(\d{0,3})/, "$1 $2");
    } else if (value.length > 6) {
      value = value.replace(/(\d{3})(\d{3})(\d{0,4})/, "$1 $2 $3");
    }

    handleChange({
      ...e,
      target: {
        ...e.target,
        name: "mobile",
        value: value,
      },
    });
  };

  return (
    <div className="min-h-screen flex text-black">
      {/* Left Side - Registration Form */}
      <div className="w-full lg:w-1/2 bg-gradient-to-b from-blue-50 via-white to-emerald-50 flex flex-col justify-center p-8 lg:p-12">
        <div className="max-w-md mx-auto w-full">
          {/* Logo and Header */}
          <div className="mb-10">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-emerald-500 p-2 rounded-xl">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <div>
                <div className="flex flex-col">
                  <div className="text-2xl font-bold bg-gradient-to-r from-[#0A8F7A] to-[#06D6A0] bg-clip-text text-transparent">
                    MediCare Wellness Network
                  </div>
                </div>
                <p className="text-emerald-600 text-sm">Patient Registration</p>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Create Your Account
            </h2>
           
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 border ${
                    errors.fullName ? "border-red-300" : "border-gray-200"
                  } rounded-xl bg-white focus:outline-none focus:ring-2 ${
                    errors.fullName
                      ? "focus:ring-red-500"
                      : "focus:ring-blue-500"
                  } focus:border-transparent transition-all duration-200`}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.fullName && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 border ${
                    errors.email ? "border-red-300" : "border-gray-200"
                  } rounded-xl bg-white focus:outline-none focus:ring-2 ${
                    errors.email ? "focus:ring-red-500" : "focus:ring-blue-500"
                  } focus:border-transparent transition-all duration-200`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleMobileChange}
                  className={`block w-full pl-10 pr-3 py-3 border ${
                    errors.mobile ? "border-red-300" : "border-gray-200"
                  } rounded-xl bg-white focus:outline-none focus:ring-2 ${
                    errors.mobile ? "focus:ring-red-500" : "focus:ring-blue-500"
                  } focus:border-transparent transition-all duration-200`}
                  placeholder="123 456 7890"
                />
              </div>
              {errors.mobile && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.mobile}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-12 py-3 border ${
                    errors.password ? "border-red-300" : "border-gray-200"
                  } rounded-xl bg-white focus:outline-none focus:ring-2 ${
                    errors.password
                      ? "focus:ring-red-500"
                      : "focus:ring-blue-500"
                  } focus:border-transparent transition-all duration-200`}
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </button>
              </div>

              {/* Password Strength */}
              {formData.password && (
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      Password Strength:
                    </span>
                    <span
                      className={`text-sm font-bold ${getStrengthColor(
                        passwordStrength
                      ).replace("bg-", "text-")}`}
                    >
                      {getStrengthText(passwordStrength)}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getStrengthColor(
                        passwordStrength
                      )} transition-all duration-300`}
                      style={{ width: `${passwordStrength}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {errors.password && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-12 py-3 border ${
                    errors.confirmPassword
                      ? "border-red-300"
                      : "border-gray-200"
                  } rounded-xl bg-white focus:outline-none focus:ring-2 ${
                    errors.confirmPassword
                      ? "focus:ring-red-500"
                      : "focus:ring-blue-500"
                  } focus:border-transparent transition-all duration-200`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Password Requirements */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Password must contain:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    check: formData.password.length >= 8,
                    text: "At least 8 characters",
                  },
                  {
                    check: /[a-z]/.test(formData.password),
                    text: "One lowercase letter",
                  },
                  {
                    check: /[A-Z]/.test(formData.password),
                    text: "One uppercase letter",
                  },
                  {
                    check:
                      /[0-9]/.test(formData.password) ||
                      /[^A-Za-z0-9]/.test(formData.password),
                    text: "Number or special character",
                  },
                ].map((req, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    {req.check ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-gray-300"></div>
                    )}
                    <span
                      className={`text-xs ${
                        req.check ? "text-green-600" : "text-gray-500"
                      }`}
                    >
                      {req.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Terms Agreement */}
            <div
              className={`p-4 rounded-xl ${
                errors.acceptTerms
                  ? "bg-red-50 border border-red-200"
                  : "bg-blue-50 border border-blue-100"
              }`}
            >
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className="mt-1 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="acceptTerms"
                  className="ml-3 text-gray-700 text-sm"
                >
                  <span className="font-medium">I agree to MWN's</span>{" "}
                  <Link
                    href="/privacy-policy"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Privacy Policy
                  </Link>{" "}
                  <span className="font-medium">and</span>{" "}
                  <Link
                    href="/medical-terms"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Medical Data Protection Terms
                  </Link>
                </label>
              </div>
              {errors.acceptTerms && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.acceptTerms}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-bold rounded-xl hover:from-blue-700 hover:to-emerald-600 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>

            {/* Already have account */}
            <div className="text-center pt-4">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative bg-gradient-to-br from-blue-600/90 to-emerald-600/90">
        <img
          src="/loginImage.png"
          alt="Friendly doctor consulting with patient in modern healthcare setting"
          className="mt-30"
        />
      </div>

      {/* Mobile Image Fallback */}
      <div className="lg:hidden w-full h-64 relative bg-gradient-to-r from-blue-600 to-emerald-500">
        <div className="absolute inset-0 flex items-center justify-center p-6 text-white">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full backdrop-blur-sm mb-4">
              <Heart className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold mb-2">
              Join Our Healthcare Family
            </h2>
            <p className="text-blue-100">
              Secure patient registration for comprehensive healthcare
              management
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
