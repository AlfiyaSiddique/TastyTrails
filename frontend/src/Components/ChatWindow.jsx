import { useEffect, useState, useRef } from "react";
import ChatInput from "./ChatInput";
import { getUser } from "../api/UserRequests";
import { addMessage, getMessages } from "../api/MessageRequests";
import { format } from "timeago.js";
import { io } from "socket.io-client";

const ChatWindow = ({ chat, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [userData, setUserData] = useState(null);
  const [currentUserData, setCurrentUserData] = useState(null);
  const socket = useRef();

  // Connect to the socket server
  useEffect(() => {
    socket.current = io("http://localhost:8800");

    // Listen for incoming messages from the server
    socket.current.on("receive-message", (newMessage) => {
      if (newMessage.chatId === chat._id) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    });

    return () => {
      socket.current.disconnect();
    };
  }, [chat._id]);

  const cachedUserData = useRef({}); // Cache for user data

  // Fetch messages and user data when the chat is selected
useEffect(() => {
  const fetchUserData = async () => {
  const userId = chat?.members?.find((id) => id !== currentUser);

  if (!userId || cachedUserData.current[userId]) {
    setUserData(cachedUserData.current[userId]);
      console.log("No valid userId found for chat members.");
      return; // Early exit if userId is invalid
    }

    try {
      const { data } = await getUser(userId);
      if (data.user) {
        cachedUserData.current[userId] = data.user; // Cache user data
        setUserData(data.user);
      } else {
        console.log("User not found");
      }
    } catch (error) {
      console.log("Error fetching user data:", error);
    }
  };

    const fetchMessages = async () => {
      try {
        const { data } = await getMessages(chat._id);
        if (data) {
          setMessages(data);
        } else {
          console.log("No messages found for this chat.");
        }
      } catch (err) {
        console.log("Error fetching messages:", err);
      }
    };

    const fetchCurrentUserData = async () => {
      try {
        const { data } = await getUser(currentUser);
        if (data.user) {
          setCurrentUserData(data.user);
        } else {
          console.log("Current user not found.");
        }
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
  const handleSendMessage = async (message) => {
    const newMessage = { text: message, senderId: currentUser, chatId: chat._id };
    try {
      const { data } = await addMessage(newMessage);
      if (data) {
        setMessages((prevMessages) => [...prevMessages, data]);

        const receiverId = chat.members.find((id) => id !== currentUser);
        socket.current.emit("send-message", { ...newMessage, receiverId });
      } else {
        console.log("Message could not be sent.");
      }
    } catch (error) {
      console.log("Error sending message:", error);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 bg-gray-800 text-white font-bold">
        Chat with {userData ? `${userData.firstName} ${userData.lastName}` : "Loading..."}
      </div>

      <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-4 flex items-start ${msg.senderId === currentUser ? "justify-end" : "justify-start"}`}>
            {msg.senderId !== currentUser && userData && (
              <img
                src={userData.profile}
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

      <ChatInput onSend={handleSendMessage} />
    </div>
  );
};

export default ChatWindow;
