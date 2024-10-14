import { useEffect, useState } from "react";
import ChatList from "../Components/ChatList";
import ChatWindow from "../Components/ChatWindow";
import { userChats } from "../api/ChatRequests"; // Ensure this request is handled properly
import { useLocation } from "react-router-dom";

const ChatApp = () => {
  const location = useLocation();
  const user = location?.state?.user;

  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const getChats = async () => {
      try {
        const { data } = await userChats(user._id); // Assuming user._id is the current user
        setChats(data);
      } catch (error) {
        console.log("Error fetching chats:", error);
      }
    };

    if (user) {
      getChats();
    }
  }, [user]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Chat List Section */}
      <div className="w-1/3 border-r bg-white">
        {chats.map((chat) => (
          <div key={chat._id}>
            <ChatList setSelectedChat={setSelectedChat} data={chat} currentUser={user._id} />
          </div>
        ))}
      </div>

      {/* Chat Window Section */}
      <div className="w-2/3">
        {selectedChat ? (
          <ChatWindow chat={selectedChat} currentUser={user._id}/>
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
