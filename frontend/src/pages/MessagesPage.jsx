import { useEffect, useState } from "react";
import api from "../api/api";
import MessageItem from "../components/MessageItem";
import { isLoggedIn } from "../utils/auth";

function MessagesPage() {
  const [messages, setMessages] = useState([]);

  const loadMessages = () => {
    api
      .get("/api/messages")
      .then((res) => setMessages(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (isLoggedIn()) {
      loadMessages();
    }
  }, []);

  const handleDelete = async (messageId) => {
    try {
      await api.delete(`/api/messages/${messageId}`);
      loadMessages();
    } catch {
      alert("Message delete failed.");
    }
  };

  if (!isLoggedIn()) {
    return <p>You must sign in to view messages.</p>;
  }

  return (
    <div>
      <h1>Received Messages</h1>

      {messages.length === 0 ? (
        <p>No messages received.</p>
      ) : (
        messages.map((message) => (
          <MessageItem
            key={message.id}
            message={message}
            onDelete={handleDelete}
          />
        ))
      )}
    </div>
  );
}

export default MessagesPage;
