const EmojiPicker = ({ onSelect }) => {
  const emojis = ["😊", "😂", "😍", "❤️", "👍", "🔥"];

  return (
    <div className="absolute bg-white border rounded-lg shadow-lg p-2 mt-2">
      {emojis.map((emoji) => (
        <button
          key={emoji}
          onClick={() => onSelect(emoji)}
          className="text-lg mx-1"
        >
          {emoji}
        </button>
      ))}
    </div>
  );
};

export default EmojiPicker;
