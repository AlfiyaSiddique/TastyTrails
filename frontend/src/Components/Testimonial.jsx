import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useMediaQuery } from 'react-responsive';
import { Link } from 'react-router-dom';
const ReviewCard = ({ review }) => (
  <div className="rounded-lg hover:shadow-xl p-4 flex flex-col justify-between h-full transition-shadow duration-300 transform hover:scale-105 shadow-[0_2px_10px_rgba(0,0,0,0.3)] bg-white">
    <div>{console.log(review)}
      <div className="flex items-center mb-4">
        <img src={review.userId.profile} alt={review.userId.firstName} className="w-16 h-16 rounded-full border-2 mr-4 object-cover" />
        <div>
          <Link to={`/profile/${review.userId._id}`}>
          <h3 className="font-semibold text-lg text-gray-800">{review.userId.firstName} {review.userId.lastName}</h3>
          </Link>
          <p className="text-sm text-red-600">{review.role}</p>
        </div>
      </div>
      <p className="text-xl font-bold mb-2 text-gray-800">"{review.quote}"</p>
      <p className="mb-4 text-gray-600">{review.review}</p>
    </div>
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
      ))}
    </div>
  </div>
);

const Testimonial = ({infiniteReviews}) => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const isSmallScreen = useMediaQuery({ query: '(max-width: 640px)' });
  const isLargeScreen = useMediaQuery({ query: '(min-width: 641px)' });
  const reviewWidth = isSmallScreen ? 100 : 100 / 3;
  
  if (infiniteReviews.length < 4) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-red-600">What Our Community Says</h2>
          <div className="flex flex-wrap justify-center">
            {infiniteReviews.map((review, index) => (
              <div key={index} className={`w-full ${isSmallScreen ? 'flex-shrink-0' : 'sm:w-1/3 flex-shrink-0'} px-2`}>
                <ReviewCard review={review} />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  

  const nextReview = useCallback(() => {
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % infiniteReviews.length);
  }, [infiniteReviews.length]);

  const prevReview = useCallback(() => {
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + infiniteReviews.length) % infiniteReviews.length);
  }, [infiniteReviews.length]);

  useEffect(() => {
    if (currentIndex === infiniteReviews.length-2) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(1);
      }, 4000);
    } else if (currentIndex === 0) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(infiniteReviews.length - 2);
      }, 500);
    }
  }, [currentIndex, infiniteReviews.length]);

  useEffect(() => {
    const timer = setInterval(nextReview, 4000);
    return () => clearInterval(timer);
  }, [nextReview]);

  return (
    <section className="py-16 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-red-600">What Our Community Says</h2>
        <div className="relative">
          <div className="overflow-visible">
            <div
              className={`flex transition-transform duration-500 ease-in-out ${!isTransitioning ? 'transition-none' : ''}`}
              style={{
                transform: `translateX(-${(currentIndex - 1) * reviewWidth}%)`,
              }}
            >
              {infiniteReviews.map((review, index) => (
                <div key={index} className={`w-full ${isSmallScreen ? 'flex-shrink-0' : 'sm:w-1/3 flex-shrink-0'} px-2`}>
                  <ReviewCard review={review} />
                </div>
              ))}
            </div>
          </div>
          {currentIndex > 1 &&(

          <button
            onClick={prevReview}
            className="absolute top-1/2 -left-4 transform -translate-y-1/2 rounded-full p-2 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 hover:shadow-lg ml-1 bg-white hover:bg-gray-100"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          )
        }
        {currentIndex < infiniteReviews.length-2 &&(

          <button
            onClick={nextReview}
            className="absolute top-1/2 -right-4 transform -translate-y-1/2 rounded-full p-2 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 hover:shadow-lg mr-1 bg-white hover:bg-gray-100"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>
        )}
        </div>
        <div className="flex justify-center mt-8">
          {infiniteReviews
            .slice(1, isLargeScreen ? infiniteReviews.length-1 : infiniteReviews.length - 1)
            .map((_, index) => (
              <div
                key={index}
                onClick={() => setCurrentIndex(index + 1)}
                className={`w-2 h-2 mx-1 rounded-full cursor-pointer transition-colors duration-200 ${index + 1 === currentIndex ? 'bg-red-600' : 'bg-gray-300'}`}
              />
            ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
