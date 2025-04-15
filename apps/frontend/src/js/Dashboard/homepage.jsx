import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, AreaChart, Area
} from "recharts";
import "../../css/Dashboard/dashboard.css";
import "../../css/Dashboard/homepage.css";
import VoiceAssistant from "../../component/ui/VoiceAssistant";

// Sidebar
const Sidebar = ({ onLogout }) => (
  <aside className="fixed top-0 left-0 h-screen w-64 bg-[#2850DA] text-white shadow-xl z-10">
    <div className="p-6 text-left text-2xl font-bold border-b border-white/20">
      DelightSense
    </div>
    <nav className="flex flex-col p-4 space-y-3">
      <SidebarButton>Dashboard</SidebarButton>
      <SidebarButton>Prediction Data</SidebarButton>
      <SidebarButton id="merchant-data">Merchant Data</SidebarButton>
      <SidebarButton onClick={onLogout}>Logout</SidebarButton>
    </nav>
  </aside>
);

const SidebarButton = ({ children, ...props }) => (
  <button
    className="w-full text-left px-4 py-2 rounded-md hover:bg-white/10 transition-colors"
    {...props}
  >
    {children}
  </button>
);

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

  const handleLogout = () => {
    console.log("Logout clicked");
    navigate("/login");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [predictionResponse, merchantResponse, ticketsResponse] = await Promise.all([
          axios.get(`http://localhost:3001/api/predict/${merchantId}`),
          axios.get(`http://localhost:3001/api/merchant/get/${merchantId}`),
          axios.get(`http://localhost:3001/api/tickets/get/${merchantId}`)
        ]);
        setPredictionData(predictionResponse.data);
        setMerchantData(merchantResponse.data);
        console.log("Tickets Response:", ticketsResponse.data.tickets);
        setTickets(ticketsResponse.data.tickets || []);
      } catch (err) {
        console.error("Error fetching data", err);
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


  if (loading) return <div className="ml-64 p-10">Loading...</div>;

  const chartData = {
    "Avg. Txn Value": [{ name: 'Today', "Avg. Txn Value": merchantData?.avg_txn_value || 0 }],
    "Failed Txns": [{ name: 'Last 7d', "Failed Txns": merchantData?.failed_txns_last_7d || 0 }],
    "Support Tickets": [{ name: 'Last 30d', Tickets: merchantData?.support_tickets_last_30d || 0 }],
    "CSAT": [{ name: 'Current', CSAT: merchantData?.csat_score || 0 }],
    "Settlement Delay": [{ name: 'Current', Delay: merchantData?.settlement_delay_avg || 0 }],
    "API Failure": [{ name: 'Current', "Failure Rate": merchantData?.api_failure_rate || 0 }],
    "Active Days": [{ name: 'Last Month', "Active Days": merchantData?.active_days_last_month || 0 }],
  };

  return (
    <div className="flex">
      <Sidebar onLogout={handleLogout} />

      {/* Scrollable main section */}
      <main className="ml-64 flex-1 h-screen overflow-y-auto bg-gray-100">
        {/* Header */}
        <header className="sticky top-0 bg-white shadow z-10 px-6 py-4 flex justify-between items-center border-b">
          <h1 className="text-lg font-semibold">Hi, {merchantId}</h1>
          <div className="relative">
            <button onClick={() => setShowDropdown(!showDropdown)} className="text-gray-700">
              Profile ⬇
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 bg-white border shadow-lg rounded-md w-32">
                <button onClick={handleLogout} className="w-full px-4 py-2 text-left hover:bg-gray-100">Logout</button>
              </div>
            )}
          </div>
        </header>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Prediction */}
          <motion.div
            className="bg-white rounded-xl shadow-2xl border border-gray-100 p-6"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-xl font-bold mb-3">Prediction Data</h2>
            <div className="flex items-center space-x-4 text-lg">
              <span className="text-4xl">{getEmojiForDelightScore(predictionData?.delight_score)}</span>
              <p>Delight Score: {predictionData?.delight_score}</p>
              <p className="delight-message">
                 <strong>{getMessageForDelightScore(predictionData?.delight_score)}</strong>
            </p>
            </div>
          </motion.div>

          {/* Merchant Data */}
          <motion.div
            className="bg-white rounded-xl shadow-2xl border border-gray-100 p-6"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-xl font-bold mb-4"><a href="#merchant-data">Merchant Data</a></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DataRow label="Merchant ID" value={merchantData?.merchant_id} />
              <DataRow label="Avg. Transaction Value" value={merchantData?.avg_txn_value} />
              <DataRow label="Failed Txns (7d)" value={merchantData?.failed_txns_last_7d} />
              <DataRow label="Support Tickets (30d)" value={merchantData?.support_tickets_last_30d} />
              <DataRow label="CSAT Score" value={merchantData?.csat_score} />
              <DataRow label="Settlement Delay" value={merchantData?.settlement_delay_avg} />
              <DataRow label="API Failure Rate" value={merchantData?.api_failure_rate} />
              <DataRow label="Active Days (Last Month)" value={merchantData?.active_days_last_month} />
            </div>
          </motion.div>

          {/* Tickets Table */}
<motion.div
  className="bg-white rounded-xl shadow-2xl border border-gray-100 p-6"
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ type: "spring", stiffness: 100, damping: 15 }}
>
  <h2 className="text-xl font-bold mb-4">Tickets</h2>
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200 text-sm">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-4 py-2 text-left font-semibold text-gray-600">Sr No.</th>
          <th className="px-4 py-2 text-left font-semibold text-gray-600">Ticket ID</th>
          <th className="px-4 py-2 text-left font-semibold text-gray-600">Description</th>
          <th className="px-4 py-2 text-left font-semibold text-gray-600">Status</th>
          <th className="px-4 py-2 text-left font-semibold text-gray-600">Created At</th>
          <th className="px-4 py-2 text-left font-semibold text-gray-600">Assigned To</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {tickets.length > 0 ? (
          tickets.map((ticket, index) => (
            <tr key={ticket._id} className="hover:bg-gray-50">
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">{ticket._id}</td>
              <td className="px-4 py-2">{ticket.description}</td>
              <td className="px-4 py-2">
                <span className={`inline-block px-2 py-1 text-xs rounded-full
                  ${ticket.status === "Open" ? "bg-green-100 text-green-800" :
                    ticket.status === "Closed" ? "bg-gray-200 text-gray-600" :
                    "bg-yellow-100 text-yellow-800"}`}>
                  {ticket.status}
                </span>
              </td>
              <td className="px-4 py-2">{new Date(ticket.created_at).toLocaleString()}</td>
              <td className="px-4 py-2">{ticket.assigned_to}</td>
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
            <td className="px-4 py-3 text-center text-gray-500 italic" colSpan="6">
              No tickets found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</motion.div>

{currentSummary && (
  <motion.div
    className="bg-white rounded-xl shadow-2xl border border-gray-100 p-6"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ type: "spring", stiffness: 100, damping: 15 }}
  >
    <h2 className="text-xl font-bold mb-3 text-blue-800">Summary of Ticket <span className="text-blue-600">{currentTicketId}</span></h2>
    <p className="text-gray-700 leading-relaxed">{currentSummary}</p>
  </motion.div>
)}

{/* Sentiment Analysis Response */}
<motion.div
  className="bg-white rounded-xl shadow-2xl border border-gray-100 p-6"
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ type: "spring", stiffness: 100, damping: 15 }}
>
  <h2 className="text-xl font-bold mb-3 text-purple-800">Sentiment Analysis On Latest Ticket</h2>
  <p className="text-gray-700 leading-relaxed">
    {sentimentResponse || <span className="italic text-gray-400">No sentiment analysis available.</span>}
  </p>
</motion.div>

{/* Voice Assistant */}
<motion.div
  className="bg-white rounded-xl shadow-2xl border border-gray-100 p-6"
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ type: "spring", stiffness: 100, damping: 15 }}
>
  <VoiceAssistant />
</motion.div>

          {/* Charts */}
          <section>
            <h2 className="text-xl font-bold mb-4">Merchant Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <ChartCard title="Avg. Txn Value (₹)">
                <LineChartWrapper data={chartData["Avg. Txn Value"]} dataKey="Avg. Txn Value" />
              </ChartCard>
              <ChartCard title="Failed Txns (7d)">
                <BarChartWrapper data={chartData["Failed Txns"]} dataKey="Failed Txns" />
              </ChartCard>
              <ChartCard title="Support Tickets (30d)">
                <AreaChartWrapper data={chartData["Support Tickets"]} dataKey="Tickets" />
              </ChartCard>
              <ChartCard title="CSAT Score">
                <LineChartWrapper data={chartData["CSAT"]} dataKey="CSAT" />
              </ChartCard>
              <ChartCard title="Settlement Delay">
                <LineChartWrapper data={chartData["Settlement Delay"]} dataKey="Delay" />
              </ChartCard>
              <ChartCard title="API Failure Rate">
                <BarChartWrapper data={chartData["API Failure"]} dataKey="Failure Rate" />
              </ChartCard>
              <ChartCard title="Active Days">
                <BarChartWrapper data={chartData["Active Days"]} dataKey="Active Days" />
              </ChartCard>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

// UI Helpers
const DataRow = ({ label, value }) => (
  <div className="text-sm bg-gray-50 p-3 rounded-md shadow-sm">
    <strong>{label}</strong>: <span>{value}</span>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div className="bg-white rounded-xl shadow-2xl border border-gray-100 p-4">
    <h3 className="text-md font-semibold mb-3">{title}</h3>
    <div className="h-40">{children}</div>
  </div>
);

const LineChartWrapper = ({ data, dataKey }) => (
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={data}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey={dataKey} stroke="#3b82f6" strokeWidth={2} />
    </LineChart>
  </ResponsiveContainer>
);

const BarChartWrapper = ({ data, dataKey }) => (
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={data}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey={dataKey} fill="#6366f1" />
    </BarChart>
  </ResponsiveContainer>
);

const AreaChartWrapper = ({ data, dataKey }) => (
  <ResponsiveContainer width="100%" height="100%">
    <AreaChart data={data}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Area type="monotone" dataKey={dataKey} stroke="#10b981" fill="#d1fae5" />
    </AreaChart>
  </ResponsiveContainer>
);

export default Dashboard;
