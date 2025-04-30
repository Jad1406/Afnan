import React, { useState } from "react";
const AiChat = () => {
  const [userMessage, setUserMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!userMessage.trim()) return;
    setLoading(true);
    setResponse("");

    const backendUrl =  "http://localhost:3000";

    try {
      const res = await fetch(`${backendUrl}/api/v1/ai/ai-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      console.log(userMessage);
      console.log("Response status:", res.status);
      const data = await res.json();
      setResponse(data.response);
    } catch (err) {
      console.error("Error:", err);
      setResponse("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🌿 AI Plant Care Chatbot</h2>

      <textarea
        rows="3"
        value={userMessage}
        onChange={(e) => setUserMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask me something about your plant..."
        style={styles.textarea}
      />

      <button onClick={sendMessage} style={styles.button} disabled={loading}>
        {loading ? "Thinking..." : "Send"}
      </button>

      {response && (
        <div style={styles.responseBox}>
          <strong>Bot:</strong> {response}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "40px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    textAlign: "center",
    color: "#2c7a41",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "6px",
    marginBottom: "10px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#4caf50",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  responseBox: {
    marginTop: "20px",
    backgroundColor: "#f0fff4",
    padding: "15px",
    borderRadius: "8px",
    border: "1px solid #c8e6c9",
  },
};

export default AiChat;
