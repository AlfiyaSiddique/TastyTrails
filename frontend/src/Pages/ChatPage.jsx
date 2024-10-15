import { useEffect, useState } from "react";
import ChatList from "../Components/ChatList";
import ChatWindow from "../Components/ChatWindow";
import { userChats, createChat } from "../api/ChatRequests"; 
import { useLocation } from "react-router-dom";
import SearchBar from "../Components/SearchBar";
import { getAllUser, getAllData } from "../api/UserRequests"; 

const ChatApp = () => {
  const location = useLocation();
  const user = location?.state?.user;
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isNewChat, setIsNewChat] = useState(false);

  useEffect(() => {
    const getChats = async () => {
      try {
        const { data } = await userChats(user._id); 
        setChats(data);
        setFilteredChats(data); 
      } catch (error) {
        console.log("Error fetching chats:", error);
      }
    };

    if (user?._id) {
      getChats();
    }
  }, [user]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const { data } = await getAllUser(); 
        setAllUsers(data.usernames);  
        setFilteredUsers(data.usernames);  
      } catch (error) {
        console.log("Error fetching users:", error);
      }
    };

    if (isNewChat) {
      fetchAllUsers();
    }
  }, [isNewChat]);

  const handleSearch = (searchTerm) => {
    if (isNewChat) {
      setFilteredUsers(allUsers.filter(username => 
        username && username.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    } else {
      setFilteredChats(chats.filter(chat =>
        chat.members.some(member => 
          member && member.username && member.username.toLowerCase().includes(searchTerm.toLowerCase())
        )
      ));
    }
  };

  const handleNewChat = async (username) => {
  try {
    const allUserData = await getAllData();
    const userToChatWith = allUserData.data.users.find((user) => user.username === username);
    
    if (!userToChatWith) {
      console.log("User not found");
      return;
    }

    const userId = userToChatWith._id;

    if (!userId) {
      console.log("Invalid user ID for the selected user.");
      return; // Exit if userId is null
    }

    // Check if there is already an existing chat with this user
    const existingChat = chats.find(chat => chat.members.includes(userId));

    if (existingChat) {
      setSelectedChat(existingChat);
    } else {
      const newChatData = { senderId:user._id,receiverId: userId};
      
      try {
        const { data } = await createChat(newChatData);
        setChats(prev => [...prev, data]); // Add new chat to the list
        setSelectedChat(data); // Select the newly created chat
      } catch (error) {
        console.log("Error creating chat:", error);
      }
    }
  } catch (error) {
    console.log("Error fetching user details:", error);
  }
};



  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/3 border-r bg-white">
        <div className="p-4">
          <SearchBar onSearch={handleSearch} />
          <div className="flex items-center justify-between space-x-4 p-4">
            <h2 className="text-lg font-bold">{isNewChat ? "Available Users" : "Chats"}</h2>
            <button
              onClick={() => setIsNewChat(!isNewChat)}
              className="text-white bg-red-700 hover:bg-red-500 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              {isNewChat ? 'Existing Chats' : 'Start New Chat'}
            </button>
          </div>
        </div>

        {isNewChat ? (
          (filteredUsers || []).map((username, index) => (
            <div key={index} className="p-4">
              <div
                className="flex items-center p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-200"
                onClick={() => handleNewChat(username)}
              >
                <span className="font-medium text-gray-800">{username}</span>
              </div>
            </div>
          ))
        ) : (
          (filteredChats || []).map((chat) => (
            <ChatList
              key={chat._id} 
              setSelectedChat={setSelectedChat}
              data={chat}
              currentUser={user._id}
            />
          ))
        )}
      </div>

      <div className="w-2/3">
        {selectedChat ? (
          <ChatWindow chat={selectedChat} currentUser={user._id} />
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
