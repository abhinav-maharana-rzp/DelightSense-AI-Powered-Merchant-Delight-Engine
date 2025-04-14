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
    const [tickets, setTickets] = useState([]);
    const [currentSummary, setCurrentSummary] = useState(null);
    const [currentTicketId, setCurrentTicketId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sentimentResponse, setSentimentResponse] = useState("");

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
                const [predictionResponse, merchantResponse, ticketsResponse] = await Promise.all([
                    axios.get(`http://localhost:3001/api/predict/${merchantId}`), // Predict API
                    axios.get(`http://localhost:3001/api/merchant/get/${merchantId}`),
                    axios.get(`http://localhost:3001/api/tickets/get/${merchantId}`)// Merchant API
                ]);

                setPredictionData(predictionResponse.data);
                setMerchantData(merchantResponse.data);
                setTickets(ticketsResponse.data.tickets || []);
                // Call fetchSentiment after tickets are loaded
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [merchantId]);

    useEffect(() => {
        if (tickets.length > 0) {
            console.log("Tickets loaded:", tickets);
            fetchSentimentForLatestOpenTicket();
        }
    }, [tickets]);

    // Add this function to your component
    const getEmojiForDelightScore = (score) => {
        if (score < 0.4) {
            return "😡"; // Super angry emoji
        } else if (score >= 0.4 && score < 0.7) {
            return "☹️"; // Frowning emoji
        } else if (score >= 0.7 && score <= 1) {
            return "😊"; // Happy emoji
        }
        return ""; // Default case
    };

    const getMessageForDelightScore = (score) => {
        if (score < 0.4) {
            return "We are sorry that you don't seem happy, but rest assured our team is working on it.";
        } else if (score >= 0.4 && score < 0.7) {
            return "We are committed to improving your experience and getting you to the happy emoji!";
        } else if (score >= 0.7 && score <= 1) {
            return "Keep smiling! We're glad to see you're happy with our service.";
        }
        return ""; // Default case
    };

    const fetchSentimentForLatestOpenTicket = async () => {
        try {
            // Filter tickets to include only open ones
            console.log("tickets",tickets);
            const openTickets = tickets.filter(ticket => ticket.status.toLowerCase() === "open");

            if (openTickets.length === 0) {
                console.error("No open tickets available for sentiment analysis.");
                return;
            }

            // Sort open tickets by created_at in descending order
            const latestTicket = openTickets.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];

            console.log("Latest Open Ticket:", latestTicket);

            // Call the sentiment API with the latest ticket's description
            const response = await axios.post("http://localhost:3001/api/nlp/sentiment", {
                text: latestTicket.description,
            });

            // Update the state with the response text
            setSentimentResponse(response.data.sentiment);
        } catch (error) {
            console.error("Error fetching sentiment for latest open ticket:", error);
        }
    };

// Function to fetch summary for a ticket
    const fetchSummary = async (ticketId, description) => {
        try {
            const response = await axios.post('http://localhost:3001/api/nlp/summarize', {
                text: description,
            });
            setCurrentSummary(response.data.summary);
            setCurrentTicketId(ticketId);
        } catch (error) {
            console.error("Error summarizing ticket:", error);
            alert("Failed to summarize the ticket.");
        }
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
                <div className="data-grid">
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
                        <p className="delight-message">
                            <strong>{getMessageForDelightScore(predictionData?.delight_score)}</strong>
                        </p>
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
                </div>
                {/* Tickets Table */}
                <motion.div
                    className="card"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                >
                    <h2>Tickets</h2>
                    <table className="tickets-table">
                        <thead>
                        <tr>
                            <th>Sr No.</th>
                            <th>Ticket ID</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Created At</th>
                            <th>Assigned To</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {tickets.length > 0 ? (
                            tickets.map((ticket, index) => (
                                <tr
                                    key={ticket._id}
                                    className={currentTicketId === ticket._id ? "highlighted-row" : ""}
                                >
                                    <td>{index + 1}</td>
                                    <td>{ticket._id}</td>
                                    <td>{ticket.description}</td>
                                    <td>{ticket.status}</td>
                                    <td>{new Date(ticket.created_at).toLocaleString()}</td>
                                    <td>{ticket.assigned_to}</td>

                                    <td>
                                        <button
                                            className="summarize-button"
                                            onClick={() => fetchSummary(ticket._id, ticket.description)}
                                        >
                                            Summarize
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">No tickets found.</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </motion.div>

                {currentSummary && (
                    <motion.div
                        className="card summary-card"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 100, damping: 15 }}
                    >
                        <h2>Summary of Ticket {currentTicketId}</h2>
                        <p>{currentSummary}</p>
                    </motion.div>
                )}

                {/* Sentiment Analysis Response */}
                <motion.div
                    className="sentiment-card"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                >
                    <h2>Sentiment Analysis On Latest Ticket</h2>
                    <p>{sentimentResponse || "No sentiment analysis available."}</p>
                </motion.div>
            </motion.div>






        </div>
    );
};

export default Dashboard;