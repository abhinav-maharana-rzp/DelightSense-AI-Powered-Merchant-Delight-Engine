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

        // Check if a ticket already exists for the merchant within the last 2 days
        const existingTicket = await Ticket.findOne({
            merchant_id,
            created_at: { $gte: twoDaysAgo },
        });

        if (existingTicket) {
            return res.status(400).json({ message: "A ticket already exists for this merchant within the last 2 days." });
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