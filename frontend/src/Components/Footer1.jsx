import React from 'react';
import { Link } from 'react-router-dom';

const Footer1 = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mb-0">
    <div className="container mx-auto w-full px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {/* About Section */}
      <div className="col-span-1">
        <h2 className="text-lg font-semibold mb-4">About Foodies</h2>
        <p className="text-sm">
          Welcome to Foodies, your go-to place for discovering new recipes, restaurants, and everything food-related. We bring the joy of cooking and eating straight to your home.
        </p>
      </div>

      {/* Quick Links Section */}
      <div className="col-span-1">
        <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
        <ul className="space-y-2">
          <li>
            <Link to="/" className="hover:text-gray-400">Home</Link>
          </li>
          <li>
            <Link to="/" className="hover:text-gray-400">About Us</Link>
          </li>
          <li>
            <Link to="/recipes" className="hover:text-gray-400">Recipes</Link>
          </li>
          <li>
            <Link to="#" className="hover:text-gray-400">Blog</Link>
          </li>
          <li>
            <Link href="#" className="hover:text-gray-400">Contact</Link>
          </li>
        </ul>
      </div>

      {/* Newsletter Section */}
      <div className="col-span-1">
        <h2 className="text-lg font-semibold mb-4">Subscribe to our Newsletter</h2>
        <form>
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="w-full p-2 mb-4 text-gray-900 rounded-md"
          />
          <button className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md w-full">
            Subscribe
          </button>
        </form>
      </div>

      {/* Social Links Section */}
      <div className="col-span-1">
        <h2 className="text-lg font-semibold mb-4">Follow Us</h2>
        <div className="flex space-x-4">
          <Link to="#" className="hover:text-gray-400">
            <i className="fab fa-facebook-f"></i> Facebook
          </Link>
          <Link to="#" className="hover:text-gray-400">
            <i className="fab fa-twitter"></i> Twitter
          </Link>
          <Link to="#" className="hover:text-gray-400">
            <i className="fab fa-instagram"></i> Instagram
          </Link>
        </div>
      </div>
    </div>

    {/* Bottom Section */}
    <div className="border-t border-gray-700 mt-8 pt-4 text-center">
      <p className="text-sm">&copy; {new Date().getFullYear()} Foodies. All rights reserved.</p>
    </div>
  </footer>
  );
};

export default Footer1;
