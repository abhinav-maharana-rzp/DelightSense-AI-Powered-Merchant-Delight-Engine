import Ticket from '../models/Ticket.js';

export const createTicket = async (req, res) => {
    const { merchant_id, description } = req.body;

    if (!merchant_id || !description) {
        return res.status(400).json({ message: "Merchant ID and description are required." });
    }

    try {
        // Calculate the date 2 days ago
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

        // Check if an open ticket already exists for the merchant within the last 2 days
        const existingTicket = await Ticket.findOne({
            merchant_id,
            status: "open", // Check for open tickets
            created_at: { $gte: twoDaysAgo },
        });

        if (existingTicket) {
            return res.status(400).json({ message: "A open ticket already exists for this merchant within the last 2 days." });
        }

        // Create a new ticket
        const newTicket = new Ticket({
            merchant_id,
            description,
            created_at: new Date(),
            created_by: "admin",
            assigned_to: "unassigned",
            status: "open",
        });

        await newTicket.save();
        res.status(201).json({ message: "Ticket created successfully.", ticket: newTicket });
    } catch (err) {
        res.status(500).json({ message: "Error creating ticket.", error: err.message });
    }
};

export const getTicketsByMerchantId = async (req, res) => {
    const { merchant_id } = req.params;

    if (!merchant_id) {
        return res.status(400).json({ message: "Merchant ID is required." });
    }

    try {
        // Fetch tickets for the specified merchant ID
        const tickets = await Ticket.find({ merchant_id });
        res.status(200).json({ message: "Tickets retrieved successfully.", tickets });
    } catch (err) {
        res.status(500).json({ message: "Error retrieving tickets.", error: err.message });
    }
};