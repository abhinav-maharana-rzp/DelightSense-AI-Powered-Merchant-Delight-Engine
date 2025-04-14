import axios from 'axios';

export const handleNLPRequest = async (req, res) => {
  const { type } = req.params;
  const { message } = req.body;  // Assuming message is passed as JSON

  try {
    // Send JSON data to the Python NLP service
    const nlpResponse = await axios.post(
      `http://localhost:5001/nlp/${type}`, 
      { message },  // Sending JSON with "message"
      { headers: { 'Content-Type': 'application/json' } }
    );

    res.json(nlpResponse.data);  // Return the NLP service response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "NLP processing failed.", error: error.message });
  }
};
