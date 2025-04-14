import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./js/Dashboard/login.jsx";
import RegisterPage from "./js/Dashboard/register.jsx";
import Homepage from "./js/Dashboard/homepage.jsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/" element={<Homepage/>}/>
            </Routes>
        </Router>
    );
}

export default App;