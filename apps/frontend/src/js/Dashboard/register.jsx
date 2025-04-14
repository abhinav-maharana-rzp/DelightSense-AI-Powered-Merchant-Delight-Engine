import React, { useState } from "react";
import { Button } from "../../component/ui/button.jsx";
import { Input } from "../../component/ui/input.jsx";
import { Eye, EyeOff } from "lucide-react";
import "../../css/Dashboard/dashboard.css";
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
        <div className="register-page-container">
            <div className="register-card">
                <div className="register-left-section">
                    <h2 className="register-left-title">Already a User?</h2>
                    <p className="register-left-description">
                        If you already have an account, please log in.
                    </p>
                    <Button
                        variant="secondary"
                        className="register-left-button"
                        onClick={handleLoginRedirect}
                    >
                        Login
                    </Button>
                </div>

                <div className="register-right-section">
                    <h2 className="register-right-title">Register</h2>
                    <form className="register-form">
                        <Input
                            placeholder="Merchant ID"
                            type="text"
                            className="input-field"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <div className="password-container">
                            <Input
                                placeholder="Password"
                                type={showPassword ? "text" : "password"}
                                className="input-field"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {showPassword ? (
                                <EyeOff
                                    className="password-icon"
                                    onClick={() => setShowPassword(false)}
                                />
                            ) : (
                                <Eye
                                    className="password-icon"
                                    onClick={() => setShowPassword(true)}
                                />
                            )}
                        </div>
                        <Input
                            placeholder="Confirm Password"
                            type="password"
                            className="input-field"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <Button
                            className="register-submit-button"
                            onClick={handleRegister}
                        >
                            Register
                        </Button>
                    </form>
                    {error && <div className="error-message">{error}</div>}
                </div>
            </div>
        </div>
    );
}