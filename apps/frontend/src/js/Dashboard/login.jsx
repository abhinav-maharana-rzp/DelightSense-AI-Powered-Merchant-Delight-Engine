import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleRegisterRedirect = () => {
        navigate("/register");
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch("http://localhost:3001/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Login successful:", data);
                navigate("/", { state: { merchantId: username } });
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Login failed. Please try again.");
                setTimeout(() => setError(""), 5000);
            }
        } catch (err) {
            setError("An error occurred. Please try again later.");
            setTimeout(() => setError(""), 5000);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 px-4">
            <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
                
                {/* Login Section */}
                <div className="p-8 md:p-12">
                    <h2 className="text-3xl font-bold text-blue-800 mb-6">Merchant Login</h2>
                    <form className="space-y-5" onSubmit={handleLogin}>
                        <div>
                            <label className="block text-gray-700 mb-1">Merchant ID</label>
                            <input
                                type="text"
                                placeholder="Enter your merchant ID"
                                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-1">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    className="w-full border border-gray-300 rounded-md px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <div
                                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 cursor-pointer"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-600 text-sm bg-red-100 rounded-md px-3 py-2">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-all"
                        >
                            Login
                        </button>
                    </form>
                </div>

                {/* Register CTA Section */}
                <div className="bg-blue-50 p-8 md:p-12 flex flex-col justify-center items-start">
                    <h2 className="text-2xl font-semibold text-blue-900 mb-2">New to Merchant Delight?</h2>
                    <p className="text-gray-700 mb-6">Register yourself before logging in and get started with tracking your merchant tickets.</p>
                    <button
                        onClick={handleRegisterRedirect}
                        className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-all"
                    >
                        Register New Merchant
                    </button>
                </div>
            </div>
        </div>
    );
}
