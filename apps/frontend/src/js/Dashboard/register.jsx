import React, { useState } from "react";
import { Button } from "../../component/ui/button.jsx";
import { Input } from "../../component/ui/input.jsx";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-4xl w-full bg-white shadow-xl rounded-lg flex">
                {/* Left Section */}
                <div className="w-1/2 bg-gray-50 p-8 flex flex-col justify-center items-center text-center">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-4">Already a User?</h2>
                    <p className="text-lg text-gray-600 mb-6">If you already have an account, please log in.</p>
                    <Button
                        variant="secondary"
                        className="px-6 py-3 text-lg text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                        onClick={handleLoginRedirect}
                    >
                        Login
                    </Button>
                </div>

                {/* Right Section */}
                <div className="w-1/2 p-8">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-6">Register</h2>
                    <form className="space-y-6" onSubmit={handleRegister}>
                        {/* Merchant ID */}
                        <div className="flex flex-col">
                            <Input
                                placeholder="Merchant ID"
                                type="text"
                                className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        {/* Password */}
                        <div className="flex flex-col relative">
                            <Input
                                placeholder="Password"
                                type={showPassword ? "text" : "password"}
                                className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
                            <Input
                                placeholder="Confirm Password"
                                type="password"
                                className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-center">
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
            </div>
        </div>
    );
}
