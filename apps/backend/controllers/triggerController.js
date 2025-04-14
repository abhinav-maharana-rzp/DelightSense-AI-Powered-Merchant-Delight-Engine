import axios from 'axios';

export const triggerDelightAction = async (req, res) => {
  const { type, payload } = req.body;

  try {
    if (type === 'email') {
      await axios.post('http://localhost:6000/email', payload);
    } else if (type === 'webhook') {
      await axios.post('http://localhost:6000/webhook', payload);
    }

    res.json({ message: 'Delight action triggered.' });
  } catch (err) {
    res.status(500).json({ message: 'Trigger failed.', error: err.message });
  }
};

export const getRecentTriggers = async (req, res) => {
  try {
    const recentTrigger = await Trigger.findOne().sort({ createdAt: -1 });
    const now = new Date();
    const isNew = recentTrigger && (now - new Date(recentTrigger.createdAt)) < 10000;

    res.json({ newTrigger: isNew });
  } catch (err) {
    res.status(500).json({ error: "Error checking recent trigger" });
  }
};
