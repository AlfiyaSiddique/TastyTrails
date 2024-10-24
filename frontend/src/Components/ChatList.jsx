import { useEffect, useState } from "react";
import { getUser } from "../api/UserRequests";

const ChatList = ({ setSelectedChat, data, currentUser }) => {
  const [userData, setUserData] = useState(null);
  const [userCache, setUserCache] = useState({});

  useEffect(() => {
    const userId = data.members.find((id) => id !== currentUser);

    const getUserData = async () => {
      if (userCache[userId]) {
        // Use cached data
        setUserData(userCache[userId]);
      } else {
        try {
          const { data } = await getUser(userId);
          setUserData(data.user);
          setUserCache((prevCache) => ({
            ...prevCache,
            [userId]: data.user, // Cache the user data
          }));
        } catch (error) {
          console.log("Error fetching user data:", error);
        }
      }
    };

    if (userId) {
      getUserData();
    }
  }, [data, currentUser, userCache]); // Add userCache as a dependency

  return (
    <div className="p-3">
      <div>
        {userData && (
          <div
            className="flex items-center p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-200"
            onClick={() => setSelectedChat(data)}
          >
            <img
              src={userData.profile}
              alt="image"
              className="w-12 h-12 rounded-full mr-4"
            />
            <span className="font-medium text-gray-800">{`${userData.firstName} ${userData.lastName}`}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;
