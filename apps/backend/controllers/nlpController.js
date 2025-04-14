import axios from 'axios';

export const handleNLPRequest = async (req, res) => {
  const { type } = req.params;
  console.log("Request Body:", req.body); // Debugging the request body

  const { text } = req.body; // Extracting message
  if (!text) {
    return res.status(400).json({ message: "Message is required in the request body." });
  } // Assuming message is passed as JSON

  try {
    // Send JSON data to the Python NLP service
    console.log("Sending request to NLP service with type:", type);
    console.log("Message:", text);
    const nlpResponse = await axios.post(
      `http://localhost:5001/nlp/${type}`,
      { text },  // Sending JSON with "message"
      { headers: { 'Content-Type': 'application/json' } }
    );

    res.json(nlpResponse.data);  // Return the NLP service response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "NLP processing failed.", error: error.message });
  }
};
