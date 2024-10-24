const SearchBar = ({ onSearch }) => {
  const handleInputChange = (e) => {
    onSearch(e.target.value);
  };

  return (
    <input
      type="text"
      placeholder="Search users or chats..."
      className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-600"
      onChange={handleInputChange}  // Trigger search on input change
    />
  );
};

export default SearchBar;
