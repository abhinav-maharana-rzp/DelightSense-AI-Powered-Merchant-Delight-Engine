import React, {useState} from "react";
import { Button } from "../../component/ui/button.jsx";
import { Input } from "../../component/ui/input.jsx";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../css/Dashboard/dashboard.css"; // Import the CSS file

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
        setError(""); // Clear any previous errors

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
                navigate("/home", { state: { merchantId: username } }); // Redirect to home page
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
        <div className="login-page-container">
            <div className="login-card">
                <div className="login-form-container">
                    <h2 className="login-title">Login</h2>
                    <form className="login-form">
                        <Input placeholder="MerchantId"
                               type="string"
                               className="input-field"
                               value = {username}
                               onChange ={(e) => setUsername(e.target.value)}/>
                        <div className="password-container">
                            <Input
                                placeholder="Password"
                                type={showPassword ? "text" : "password"} // Toggle input type
                                className="input-field"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {showPassword ? (
                                <EyeOff
                                    className="password-icon"
                                    onClick={() => setShowPassword(false)} // Hide password
                                />
                            ) : (
                                <Eye
                                    className="password-icon"
                                    onClick={() => setShowPassword(true)} // Show password
                                />
                            )}
                        </div>
                        <Button className="login-button" onClick={handleLogin}>
                            Login
                        </Button>
                    </form>
                    {error && <div className="error-message">{error}</div>}
                </div>

                <div className="register-container">
                    <h2 className="register-title">New to Merchant Delight Dashboard</h2>
                    <p className="register-description">Register yourself first before login</p>
                    <Button
                        variant="secondary"
                        className="register-button"
                        onClick={handleRegisterRedirect}
                    >
                        Register New Merchant
                    </Button>
                </div>

            </div>

        </div>
    );
}