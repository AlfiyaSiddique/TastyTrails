import { useEffect, useState } from "react";
import ChatInput from "./ChatInput";
import { getUser } from "../api/UserRequests";
import { getMessages } from "../api/MessageRequests";
import {format} from "timeago.js"
const ChatWindow = ({ chat, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [userData, setUserData] = useState(null);
  const [currentUserData, setCurrentUserData] = useState(null);

useEffect(() => {
    const fetchUserData = async () => {
      const userId = chat?.members?.find((id) => id !== currentUser);
      try {
        const { data } = await getUser(userId);
        setUserData(data.user);
      } catch (error) {
        console.log("Error fetching user data:", error);
      }
    };

    const fetchMessages = async () => {
      try {
        const { data } = await getMessages(chat._id);
        setMessages(data);
      } catch (err) {
        console.log("Error fetching messages:", err);
      }
    };

    const fetchCurrentUserData = async () => {
      try {
        const { data } = await getUser(currentUser);
        setCurrentUserData(data.user);
      } catch (error) {
        console.log("Error fetching current user data:", error);
      }
    };

    if (chat) {
      fetchUserData();
      fetchMessages();
      fetchCurrentUserData();
    }
  }, [chat, currentUser]);


  // Send message logic
  const handleSendMessage = (message) => {
    const newMessage = { text: message, senderId: currentUser }; // Include senderId for identification
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    // Add additional logic for sending the message to the backend
  };

  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      <div className="p-4 bg-gray-800 text-white font-bold">
        Chat with {userData ? `${userData.firstName} ${userData.lastName}` : "Loading..."}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-4 flex items-start ${msg.senderId === currentUser ? "justify-end" : "justify-start"}`}>
            {/* Show sender's profile picture for received messages */}
            {msg.senderId !== currentUser && userData && (
              <img
                src={userData.profile} // Fetching from the database
                alt="Profile"
                className="w-8 h-8 rounded-full mr-2"
              />
            )}

         <div className={`p-2 rounded-lg ${msg.senderId === currentUser ? "bg-blue-200 text-right" : "bg-gray-200"}`}>
     <div className="flex items-center">
    {msg.text}
    <span className="text-xs text-gray-500 ml-2">{format(msg.createdAt)}</span>
  </div>
</div>




            {/* Show current user's profile picture for sent messages */}
        {msg.senderId === currentUser && currentUserData && (
        <img
          src={currentUserData.profile}
          alt="Your Profile"
          className="w-8 h-8 rounded-full ml-2"
        />
      )}

          </div>
        ))}
      </div>

      {/* Chat Input Section */}
      <ChatInput onSend={handleSendMessage} />
    </div>
  );
};

export default ChatWindow;
