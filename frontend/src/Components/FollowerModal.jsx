// FollowModal.js
import React from 'react';

export default function FollowModal({ isOpen, onClose, followers, following, activeTab, setActiveTab }) {
  console.log(following)
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-4">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-semibold">Followers & Following</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500">&times;</button>
        </div>
        
        {/* Tab Header */}
        <div className="flex border-b border-gray-200 mb-4">
          <button
            className={`w-1/2 py-2 text-center ${activeTab === 'followers' ? 'border-b-2 border-red-700 text-red-700' : 'text-gray-500'}`}
            onClick={() => setActiveTab('followers')}
          >
            Followers
          </button>
          <button
            className={`w-1/2 py-2 text-center ${activeTab === 'following' ? 'border-b-2 border-red-700 text-red-700' : 'text-gray-500'}`}
            onClick={() => setActiveTab('following')}
          >
            Following
          </button>
        </div>

        {/* Tab Content */}
        <div className="h-64 overflow-y-auto">
          {activeTab === 'followers' ? (
            followers.length > 0 ? (
              followers.map((follower) => (
                <div key={follower._id} className="flex items-center mb-2">
                  <img src={follower.profile || "/placeholder.svg"} alt={follower.username} className="w-10 h-10 rounded-full mr-3" />
                  <div>
  <span class="block text-red-700">@{follower.username}</span>
  <span class="block text-sm">{follower.firstName} {follower.lastName}</span>
</div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No followers found.</p>
            )
          ) : (
            following.length > 0 ? (
              following.map((followedUser) => (
                <div key={followedUser._id} className="flex items-center mb-2">
                  <img src={followedUser.profile || "/placeholder.svg"} alt={followedUser.username} className="w-10 h-10 rounded-full mr-3" />
                  <div>
  <span class="block text-red-700">@{followedUser.username}</span>
  <span class="block text-sm">{followedUser.firstName} {followedUser.lastName}</span>
</div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No following users found.</p>
            )
          )}
        </div>
      </div>
    </div>
  );
}
