export const API_URL = "https://vygi7zn5f2vxe3zf3n6jf2xeem0wywin.lambda-url.us-east-2.on.aws";

/**
 * Sends a POST request to the backend to get a response from the AI.
 * @param {string} question - The question to send to the AI.
 * @returns {Promise<string>} - The response from the AI.
 */
export const getAIResponse = async (question) => {
  try {
    const response = await fetch(`${API_URL}/fast/response`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch response from the server");
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("Error fetching AI response:", error);
    return "An error occurred while processing your request.";
  }
};
