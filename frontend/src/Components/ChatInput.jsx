import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip, faSmile, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const ChatInput = ({ onSend }) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() !== "") {
      onSend(message);
      setMessage("");
    }
  };

  return (
    <div className="p-4 bg-white flex items-center border-t">

      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-1 mx-2 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-600"
        placeholder="Type a message..."
      />
      <button
        onClick={handleSend}
        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
      >
        <FontAwesomeIcon icon={faPaperPlane} />
      </button>
    </div>
  );
};

export default ChatInput;
