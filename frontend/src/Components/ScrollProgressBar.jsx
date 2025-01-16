import React, { useEffect, useState } from "react";

const ScrollProgressBar = () => {
  const [scrollPercentage, setScrollPercentage] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY; // How much user has scrolled
      const windowHeight = window.innerHeight; // Height of the viewport
      const docHeight = document.documentElement.scrollHeight; // Height of the document

      const totalDocScrollLength = docHeight - windowHeight;
      const scrollPosition = (scrollTop / totalDocScrollLength) * 100;

      setScrollPercentage(scrollPosition);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: `${scrollPercentage}%`,
        height: "5px",
        color:red,
        backgroundColor: "#ff4500",
        zIndex: 1000,
        transition: "width 0.25s ease-out",
      }}
    />
  );
};

export default ScrollProgressBar;
