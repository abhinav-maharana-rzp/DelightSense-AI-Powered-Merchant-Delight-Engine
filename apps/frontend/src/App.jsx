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
                <Route path="/home" element={<Homepage/>}/>
                <Route
                    path="/"
                    element={
                        <div className="flex flex-col items-center justify-center min-h-screen">
                            <button className="bg-black text-white p-6 rounded-lg">Click me</button>
                        </div>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;