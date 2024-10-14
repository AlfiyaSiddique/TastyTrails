import { useState } from "react";
import SearchBar from "./SearchBar";

const ChatList = ({ setSelectedChat }) => {
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
  ]);

  return (
    <div className="p-4">
      <SearchBar />

      <h2 className="text-lg font-bold mt-4">Chats</h2>
      <ul className="space-y-4 mt-4">
        {users.map((user) => (
          <li
            key={user.id}
            className="p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-200"
            onClick={() => setSelectedChat(user)}
          >
            {user.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;
