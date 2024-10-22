import React from 'react';

// Add a keyframe animation for a more visible pulse effect
const RecipeCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image skeleton - enhanced animation */}
      <div className="w-full h-0 pb-[56.25%] relative">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-[pulse_1.5s_ease-in-out_infinite]"></div>
      </div>

      <div className="p-6 space-y-4">
        {/* Category tag skeleton */}
        <div className="flex items-start">
          <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-[pulse_1.5s_ease-in-out_infinite] w-24 rounded-md">
          </div>
        </div>

        {/* Title skeleton */}
        <div className="h-7 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-[pulse_1.5s_ease-in-out_infinite] w-1/2 rounded-md">
        </div>

        {/* Description skeleton - 3 lines */}
        <div className="space-y-2">
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-[pulse_1.5s_ease-in-out_infinite] rounded-md w-full"></div>
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-[pulse_1.5s_ease-in-out_infinite] rounded-md w-[95%]"></div>
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-[pulse_1.5s_ease-in-out_infinite] rounded-md w-[60%]"></div>
        </div>

        {/* Footer skeleton */}
        <div className="flex items-center justify-between pt-4 mt-2 border-t border-gray-100">
          {/* Recipe link skeleton */}
          <div className="flex items-center space-x-1">
            <div className="h-5 bg-gradient-to-r from-red-100 via-red-200 to-red-100 animate-[pulse_1.5s_ease-in-out_infinite] w-16 rounded-md"></div>
            <div className="w-4 h-4 bg-gradient-to-r from-red-100 via-red-200 to-red-100 animate-[pulse_1.5s_ease-in-out_infinite] rounded-md"></div>
          </div>

          {/* Like and Share buttons skeleton */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-5 h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-[pulse_1.5s_ease-in-out_infinite] rounded-full"></div>
              <div className="w-3 h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-[pulse_1.5s_ease-in-out_infinite] rounded-sm"></div>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-5 h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-[pulse_1.5s_ease-in-out_infinite] rounded-full"></div>
              <div className="w-3 h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-[pulse_1.5s_ease-in-out_infinite] rounded-sm"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCardSkeleton;