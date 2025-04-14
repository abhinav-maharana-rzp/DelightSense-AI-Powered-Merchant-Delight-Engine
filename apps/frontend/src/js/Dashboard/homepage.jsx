import React, {useState} from "react";
import { motion } from "framer-motion";
import "../../css/Dashboard/dashboard.css";
import { FaUserCircle } from "react-icons/fa";
import "../../css/Dashboard/homepage.css";
import {useLocation, useNavigate} from "react-router-dom";

const Dashboard = () => {

    const [showDropdown, setShowDropdown] = useState(false);
    const location = useLocation();
    const merchantId = location.state?.merchantId || "Merchant";
    const navigate = useNavigate()

    //Handle logout
    const handleLogout = () => {
        console.log("Logout clicked");
        navigate("/login");
    };

    // Default data

    const teamMembers = [
        { name: "Vera Kartika", location: "Biribasne, Australia" },
        { name: "Sonny Kim", location: "Johor Bian, Malaysia" },
        { name: "Priyanka Chopra", location: "Jamalecipsei, India" },
    ];

    const payments = [
        { label: "Contractor Payment", amount: 1260, completed: false },
        { label: "Contractor Payment", amount: 320, completed: false },
        { label: "Your Balance", amount: 1420, completed: false },
    ];

    const timeOff = [
        { type: "Sick leave", used: 7, total: 11 },
        { type: "Vacation leave", used: 5, total: 11 },
        { type: "No news leave", used: 5, total: 11 },
    ];

    // Animation variants
    const container = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.15,
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, x: -30 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15
            }
        }
    };

    const cardVariantsRight = {
        hidden: { opacity: 0, x: 30 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15
            }
        }
    };

    return (

        // Header
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
            variants={container}
            initial="hidden"
            animate="visible"
        >
            {/* UI Designer Team Card - Left animation */}
            <motion.div
                className="card team-card"
                variants={cardVariants}
            >
                <h2>UI Designer Team</h2>
                {teamMembers.map((member, index) => (
                    <div key={index} className="team-member">
                        <strong>{member.name}</strong>
                        <div>{member.location}</div>
                    </div>
                ))}
                <div className="team-meta">
                    <div>
                        <strong>Manage</strong>
                    </div>
                    <div className="meta-row">
                        <div>
                            <strong>Remote</strong>
                            <div>Full-time</div>
                        </div>
                        <div>
                            <strong>Onalte</strong>
                            <div>Fireblanco</div>
                        </div>
                        <div>
                            <strong>Hybrid</strong>
                            <div>On training</div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Payment Status Card - Right animation */}
            <motion.div
                className="card payment-card"
                variants={cardVariantsRight}
            >
                <h2>Payment Status</h2>
                <ul>
                    {payments.map((payment, index) => (
                        <li key={index}>
                            <input type="checkbox" checked={payment.completed} readOnly />
                            <span>{payment.label} ${payment.amount.toLocaleString()}</span>
                        </li>
                    ))}
                </ul>
            </motion.div>

            {/* Entry Aula Ramadhan Card - Left animation */}
            <motion.div
                className="card entry-card"
                variants={cardVariants}
            >
                <h3>Entry Aula Ramadhan</h3>
                <div className="entry-title">IOS Developer</div>
                <div className="entry-service">Serviceists</div>
                <div className="entry-section">
                    <strong>Medical Insurance</strong>
                    <div>Medical Insurance to cover your healthy.</div>
                    <div className="entry-price">$140.00 / 2 years</div>
                </div>
                <div className="entry-section">
                    <strong>Employee's</strong>
                    <div>360</div>
                </div>
                <div className="entry-link">See details</div>
                <div className="entry-footer">
                    <div>Total Employees</div>
                    <div>Total</div>
                </div>
            </motion.div>

            {/* Time Off Card - Right animation */}
            <motion.div
                className="card timeoff-card"
                variants={cardVariantsRight}
            >
                <h2>Time Off</h2>
                {timeOff.map((item, index) => (
                    <div key={index} className="timeoff-item">
                        <div className="timeoff-type">
                            <strong>{item.type}</strong>
                        </div>
                        <div className="timeoff-stats">
                            {item.used} / {item.total} Used
                        </div>
                    </div>
                ))}
            </motion.div>

            {/* Session Insurance Card - Left animation */}
            <motion.div
                className="card insurance-card"
                variants={cardVariants}
            >
                <h2>Session Insurance</h2>
                <div>Pension insurance to cover your pension time.</div>
                <div className="insurance-price">$2,680.00 / 4 years</div>
            </motion.div>

            {/* Payroll Summary Card - Right animation */}
            <motion.div
                className="card payroll-card"
                variants={cardVariantsRight}
            >
                <h2>Payroll Summary</h2>
                <div className="payroll-download">Download</div>
                <div className="payroll-amount">$18,000</div>
                <div className="payroll-date">November 28, 2024</div>
            </motion.div>

            {/* Amanda Rocha Card - Left animation */}
            <motion.div
                className="card person-card"
                variants={cardVariants}
            >
                <h3>Amanda Rocha</h3>
                <div className="person-title">Assistant Manager</div>
                <div className="person-details">
                    <div>
                        <strong>3 Months</strong>
                        <div>Onboarding</div>
                    </div>
                    <div>
                        <strong>4 years</strong>
                        <div>covered</div>
                    </div>
                    <div>
                        <strong>$2,680.00</strong>
                    </div>
                </div>
            </motion.div>
        </motion.div>
            <div className="card trigger-card">
                <p>Not happy with the scores? Generate a Trigger and let our team know</p>
                <button className="trigger-button">Trigger</button>
            </div>
        </div>
    );
};

export default Dashboard;