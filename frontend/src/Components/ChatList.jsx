import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import { getUser } from "../api/UserRequests";

const ChatList = ({ setSelectedChat, data, currentUser }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const userId = data.members.find((id) => id !== currentUser);
    const getUserData = async () => {
      try {
        const { data } = await getUser(userId);
        setUserData(data.user);
      } catch (error) {
        console.log("Error fetching user data:", error);
      }
    };

    if (userId) {
      getUserData();
    }
  }, [data, currentUser]); // Add dependencies to the useEffect

  return (
    <div className="p-4">
      <SearchBar />

      <h2 className="text-lg font-bold mt-4">Chats</h2>
      <div className="mt-4 space-y-4">
        {userData && (
          <div
            className="flex items-center p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-200"
            onClick={() => setSelectedChat(data)} // Pass the chat data
          >
            <img
              src={userData.profile}
              alt="image"
              className="w-12 h-12 rounded-full mr-4" // Adjust size and margin
            />
            <span className="font-medium text-gray-800">{`${userData.firstName} ${userData.lastName}`}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;
