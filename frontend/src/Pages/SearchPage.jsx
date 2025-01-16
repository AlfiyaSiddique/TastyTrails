import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

export default function UserSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [followingStatus, setFollowingStatus] = useState({});
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [user, setUser] = useState(null);
  const path = useLocation().pathname;

  useEffect(() => {
    // Fetch logged-in user details
    let token = localStorage.getItem('tastytoken');
    if (token) {
      token = JSON.parse(token);
      axios.get(`${backendURL}/api/token`, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => {
          if (res.data.success) {
            setUser(res.data.user);
          }
        })
        .catch((err) => {
          console.log(err);
          setUser(null);
        });
    } else {
      setUser(null);
    }
  }, [path]);

  useEffect(() => {
    // Check follow status for users in search results
    if (searchResults.length > 0 && user) {
      const userFollowStatus = {};
      searchResults.forEach((u) => {
        userFollowStatus[u._id] = u.followers.includes(user._id);
      });
      setFollowingStatus(userFollowStatus);
    }
  }, [searchResults, user]);

  useEffect(() => {
    // Debounce search term input
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        searchUsers(searchTerm);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const searchUsers = async (usernameSubstring) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${backendURL}/api/users?search=${usernameSubstring}`);
      if (response.data.success) {
        setSearchResults(response.data.users);
      } else {
        setError('No users found.');
      }
    } catch (err) {
      setError('Failed to fetch users. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollow = async (id) => {
    const token = localStorage.getItem('tastytoken');
    try {
      const username = JSON.parse(localStorage.getItem('username'));
      await axios.post(`${backendURL}/api/follow`, { username, userId: id }, { headers: { Authorization: `Bearer ${token}` } });

      // Update following status in the UI
      setFollowingStatus((prevState) => ({
        ...prevState,
        [id]: !prevState[id],
      }));
    } catch (err) {
      console.error('Error updating follow status', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      <header className="bg-red-700 text-white py-4 px-6 shadow-lg">
        <h1 className="text-3xl font-bold">FoodieConnect</h1>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-red-700 mb-4">Discover Culinary Creators</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search for chefs, bakers, and food enthusiasts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-4 pr-12 border-2 border-red-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>

        {isLoading && <div className="flex justify-center items-center py-8"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-700"></div></div>}
        {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8" role="alert"><p>{error}</p></div>}
        {!isLoading && !error && searchResults.length === 0 && searchTerm && <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-8" role="alert"><p>No users found. Try a different search term!</p></div>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResults.map((user) => (
            <div key={user._id} className="block">
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1">
                <Link to={`/profile/${user._id}`} className="p-6">
                  <div className="flex items-center mb-1 ml-2">
                    <img src={user.profile} alt={user.username} className="w-16 h-16 rounded-full border-2 border-red-500" />
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold text-red-700">{user.username}</h3>
                      <p className="text-gray-600">{user.recipeCount} Recipes</p>
                    </div>
                  </div>
                </Link>
                <div className="bg-red-50 px-6 py-4 flex justify-between items-center">
                  <span className="text-sm text-gray-500">{user.followers.length} Followers</span>
                  <button
                    className={`px-4 py-2 rounded-full transition duration-300 ease-in-out ${followingStatus[user._id] ? 'bg-gray-500' : 'bg-red-600 text-white hover:bg-red-700'}`}
                    onClick={() => handleFollow(user._id)}
                  >
                    {followingStatus[user._id] ? 'Following' : 'Follow'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
