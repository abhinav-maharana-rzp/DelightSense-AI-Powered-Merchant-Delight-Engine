import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
    merchant_id: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    created_by: {
        type: String,
        default: "admin",
    },
    assigned_to: {
        type: String,
        default: "unassigned",
    },
    status: {
        type: String,
        default: "open",
        enum: ["open", "in_progress", "closed"], // Optional: restrict status values
    },
});

const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;