import { useState } from "react";
import ChatInput from "./ChatInput";
import EmojiPicker from "./EmojiPicker";

const ChatWindow = ({ chat }) => {
  const [messages, setMessages] = useState([]);

  const handleSendMessage = (message) => {
    setMessages([...messages, { text: message, sender: "You" }]);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      <div className="p-4 bg-gray-800 text-white font-bold">
        Chat with {chat.name}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
        {messages.map((msg, index) => (
          <div key={index} className="mb-4">
            <div className={`p-2 rounded-lg ${msg.sender === "You" ? "bg-blue-200 text-right" : "bg-gray-200"}`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Chat Input Section */}
      <ChatInput onSend={handleSendMessage} />
    </div>
  );
};

export default ChatWindow;
