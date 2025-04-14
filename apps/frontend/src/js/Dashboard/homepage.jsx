import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "../../css/Dashboard/dashboard.css";
import { FaUserCircle } from "react-icons/fa";
import "../../css/Dashboard/homepage.css";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [predictionData, setPredictionData] = useState(null);
    const [merchantData, setMerchantData] = useState(null);
    const [loading, setLoading] = useState(true);

    const location = useLocation();
    const merchantId = location.state?.merchantId || "Merchant";
    const navigate = useNavigate();

    // Handle logout
    const handleLogout = () => {
        console.log("Logout clicked");
        navigate("/login");
    };

    // Fetch data from APIs
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [predictionResponse, merchantResponse] = await Promise.all([
                    axios.get(`http://localhost:3001/api/predict/${merchantId}`), // Predict API
                    axios.get(`http://localhost:3001/api/merchant/get/${merchantId}`) // Merchant API
                ]);

                setPredictionData(predictionResponse.data);
                setMerchantData(merchantResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [merchantId]);

    // Add this function to your component
    const getEmojiForDelightScore = (score) => {
        if (score < 0.4) {
            return "😡"; // Super angry emoji
        } else if (score >= 0.4 && score < 0.8) {
            return "☹️"; // Frowning emoji
        } else if (score >= 0.8 && score <= 1) {
            return "😊"; // Happy emoji
        }
        return ""; // Default case
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {/* Header Section */}
            <div className="dashboard-header">
                <p className="dashboard-header-text-homepage">Hi, {merchantId}</p>
                <div className="relative">
                    <button onClick={() => setShowDropdown(!showDropdown)}>
                        <FaUserCircle />
                        <span>Profile</span>
                    </button>
                    {showDropdown && (
                        <div className="absolute">
                            <button onClick={handleLogout}>Logout</button>
                        </div>
                    )}
                </div>
            </div>

            <motion.div
                className="dashboard"
                initial="hidden"
                animate="visible"
            >
                {/* Prediction Data Card */}
                <motion.div
                    className="card"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                >

                    <h2>Prediction Data</h2>
                    <div className="prediction-data-container">
                        <div className="prediction-emoji">
                            {getEmojiForDelightScore(predictionData?.delight_score)}
                        </div>
                        <p>Delight Score: {predictionData?.delight_score}</p>

                    </div>

                </motion.div>

                {/* Merchant Data Card */}
                <motion.div
                    className="card"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                >
                    <h2>Merchant Data</h2>
                    <div className="merchant-data-container">
                        <div className="merchant-data-row">
                            <strong>Merchant ID:</strong> <span>{merchantData?.merchant_id}</span>
                        </div>
                        <div className="merchant-data-row">
                            <strong>Average Transaction Value:</strong> <span>{merchantData?.avg_txn_value}</span>
                        </div>
                        <div className="merchant-data-row">
                            <strong>Failed Transactions (Last 7 Days):</strong> <span>{merchantData?.failed_txns_last_7d}</span>
                        </div>
                        <div className="merchant-data-row">
                            <strong>Support Tickets (Last 30 Days):</strong> <span>{merchantData?.support_tickets_last_30d}</span>
                        </div>
                        <div className="merchant-data-row">
                            <strong>CSAT Score:</strong> <span>{merchantData?.csat_score}</span>
                        </div>
                        <div className="merchant-data-row">
                            <strong>Settlement Delay (Avg):</strong> <span>{merchantData?.settlement_delay_avg}</span>
                        </div>
                        <div className="merchant-data-row">
                            <strong>API Failure Rate:</strong> <span>{merchantData?.api_failure_rate}</span>
                        </div>
                        <div className="merchant-data-row">
                            <strong>Active Days (Last Month):</strong> <span>{merchantData?.active_days_last_month}</span>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Dashboard;