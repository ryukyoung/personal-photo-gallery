import { Link } from "react-router-dom";

function MessageItem({ message, onDelete }) {
  return (
    <div className="message-item">
      <p>
        <strong>From:</strong> {message.sender_username}
      </p>
      <p>{message.content}</p>

      <div className="message-actions">
        <Link to={`/messages/send/${message.sender_id}`}>Reply</Link>

        <button onClick={() => onDelete(message.id)}>Delete</button>
      </div>
    </div>
  );
}

export default MessageItem;
