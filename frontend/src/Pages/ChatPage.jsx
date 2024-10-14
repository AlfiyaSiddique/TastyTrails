import { useState } from "react";
import ChatList from "../Components/ChatList";
import ChatWindow from "../Components/ChatWindow";

const ChatApp = () => {
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Chat List Section */}
      <div className="w-1/3 border-r bg-white">
        <ChatList setSelectedChat={setSelectedChat} />
      </div>

      {/* Chat Window Section */}
      <div className="w-2/3">
        {selectedChat ? (
          <ChatWindow chat={selectedChat} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatApp;
