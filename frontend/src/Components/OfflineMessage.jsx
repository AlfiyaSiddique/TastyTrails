import React, { useEffect } from 'react';

const OfflineMessage = () => {
  useEffect(() => {
    const handleOnline = () => {
      // Reload the page when the user comes back online
      window.location.reload();
    };

    // Add event listener for when the network status changes to online
    window.addEventListener('online', handleOnline);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a1f44]">
      <h2 className="text-white text-2xl">
        <span>Please go online to check the latest recipes.</span>
      </h2>
    </div>
  );
};

export default OfflineMessage;
