import React, { useState } from "react";
import { Button } from "../../component/ui/button.jsx";
import { Input } from "../../component/ui/input.jsx";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeftIcon } from "@heroicons/react/solid"; // Make sure this is installed

export default function RegisterPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleLoginRedirect = () => {
        navigate("/login");
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const response = await fetch("http://localhost:3001/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                navigate("/login");
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Registration failed. Please try again.");
            }
        } catch (err) {
            setError("An error occurred. Please try again later.");
        }
    };

    return (
        <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar mx-auto mb-5 sm:pt-10">
            <div className="w-full max-w-md mx-auto mb-5 sm:pt-10">
                <Link
                    to="/"
                    className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                    <ChevronLeftIcon className="size-5" />
                    Back to dashboard
                </Link>
            </div>
            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                <div>
                    <div className="mb-5 sm:mb-8">
                        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                            Register
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Enter your details to create an account.
                        </p>
                    </div>

                    <form className="space-y-5" onSubmit={handleRegister}>
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            {/* Merchant ID */}
                            <div className="sm:col-span-1">
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Merchant ID<span className="text-error-500">*</span>
                                </label>
                                <Input
                                    placeholder="Enter your merchant ID"
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="flex flex-col relative">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Password<span className="text-error-500">*</span>
                            </label>
                            <Input
                                placeholder="Enter your password"
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                            <div
                                className="absolute top-3 right-3 cursor-pointer"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="text-gray-500" />
                                ) : (
                                    <Eye className="text-gray-500" />
                                )}
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="flex flex-col">
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Confirm Password<span className="text-error-500">*</span>
                            </label>
                            <Input
                                placeholder="Confirm your password"
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                        </div>

                        {/* Submit Button */}
                        <div>
                            <Button
                                className="w-full py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                type="submit"
                            >
                                Register
                            </Button>
                        </div>
                    </form>

                    {/* Error Message */}
                    {error && (
                        <div className="mt-4 text-center text-red-500 font-medium">{error}</div>
                    )}
                </div>

                <div className="mt-5">
                    <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                        Already have an account? {""}
                        <Link
                            to="/login"
                            className="text-blue-500 hover:text-blue-600 dark:text-blue-400"
                        >
                            Log In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
