import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";
import { isLoggedIn } from "../utils/auth";

function SendMessagePage() {
  const { receiverId } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/api/messages", {
        receiver_id: receiverId,
        content,
      });
      navigate("/photos");
    } catch {
      alert("Message send failed.");
    }
  };

  if (!isLoggedIn()) {
    return <p>You must sign in to send messages.</p>;
  }

  return (
    <div className="form-page">
      <h1>Send Direct Message</h1>

      <form onSubmit={handleSubmit} className="form-box">
        <label>Message</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default SendMessagePage;
