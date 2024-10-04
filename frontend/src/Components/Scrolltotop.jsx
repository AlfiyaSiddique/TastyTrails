// Components/ScrollToTop.js
import React from 'react';

const ScrollToTop = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Adds smooth scrolling effect
    });
  };

  return (
    <button
      className="fixed bottom-20 right-7 bg-white text-red-700 border-2 border-red-700 rounded-full p-3 shadow-lg hover:bg-red-700 hover:text-white transition duration-200 flex items-center justify-center"
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      <span className="text-xl">↑</span>
    </button>
  );
};

export default ScrollToTop;
