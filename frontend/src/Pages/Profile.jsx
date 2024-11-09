import { useState, useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'

import axios from 'axios'

export default function UserProfile() {
  const { id } = useParams() // Get the user ID from the URL params
  const backendURL = import.meta.env.VITE_BACKEND_URL
  const token = JSON.parse(localStorage.getItem("tastytoken")) // Token still comes from local storage for authentication

  const [user, setUser] = useState(null)

  const [username, setUsername] = useState("ChefJulia")
  const [bio, setBio] = useState("Passionate about creating delicious, healthy recipes that anyone can make!")
  const [imagePreview, setImagePreview] = useState("/placeholder.svg?height=128&width=128")
  const [recipes, setRecipes] = useState([])
  const [likedRecipes, setLikedRecipes] = useState([])  // Added state for liked recipes
  const [following, setFollowing] = useState(false)
  const [followingCount, setFollowingCount] = useState(false)
  const [followers, setFollowers] = useState(0)
  const [activeTab, setActiveTab] = useState('recipes')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const path = useLocation().pathname;
  useEffect(() => {
    let token = localStorage.getItem("tastytoken");
    if (token) {
      token = JSON.parse(token);
      axios
        .get(`${backendURL}/api/token`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res.data.success) {
            setUser(res.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setUser(null);
    }
  }, [path]);


  useEffect(() => {
    // Fetch user information
    const fetchUserImage = () => {
      axios
        .post(`${backendURL}/api/user/fetch`, { id }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setUsername(res.data.username)
          setBio(res.data.bio)
          setImagePreview(res.data.profile)
          setFollowingCount(res.data.following.length)
          setFollowers(res.data.followers.length)

          setFollowing(res.data.followers.includes(user.user._id))

        })
        .catch((err) => {
          console.error("Error fetching user data", err)
        })
    }

    // Fetch recipes
    const fetchRecipes = () => {
      setLoading(true)
      setError(null)
      axios
        .post(`${backendURL}/api/recipe/readall`, { id: id }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setRecipes(res.data.recipes)
        })
        .catch((err) => {
          console.error("Error fetching recipes:", err)
          setError("Failed to fetch recipes. Please try again.")
        })
        .finally(() => setLoading(false))
    }

    // Fetch liked recipes
    const fetchLikedRecipes = () => {
      axios
        .post(
          `${backendURL}/api/recipe/liked_recipes`,
          { userId: id },  // Use the user ID from URL params
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((res) => {
          setLikedRecipes(res.data.likedRecipes)
        })
        .catch((err) => {
          console.error("Error fetching liked recipes:", err)
          setError("Failed to fetch liked recipes. Please try again.")
        })
    }

    fetchUserImage()
    fetchRecipes()
    fetchLikedRecipes()  // Call the fetchLikedRecipes function to get liked recipes

  }, [id, backendURL, token, user])  // Use id, backendURL, and token in dependencies

  const handleFollow = async () => {
    try {
      await axios.post(`${backendURL}/api/follow`, 
        { username: JSON.parse(localStorage.getItem("username")), userId: id },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setFollowing(!following);
      setFollowers(followers + (following ? -1 : 1));
    } catch (err) {
      console.error("Error updating follow status", err);
    }
  };


  return (
    <div className="bg-white min-h-screen">
      {/* Banner and Profile Picture */}

      <div className="relative h-48 bg-gradient-to-r from-red-500 to-red-600 bg-cover bg-center" style={{ backgroundImage: 'url(https://cdn.pixabay.com/photo/2022/04/30/19/12/cooking-banner-7166200_1280.jpg)' }}>




        <div className="absolute -bottom-16 left-8">
          <img 
            src={imagePreview} 
            alt={username} 
            className="w-32 h-32 rounded-full border-4 border-white"
          />
        </div>
      </div>

      {/* User Info */}
      <div className="pt-20 px-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{username}</h1>
            <p className="text-gray-600 mt-1">{bio}</p>
          </div>
          <button 
            className={`px-4 py-2 rounded-full ${
              following 
                ? 'bg-white text-red-700 border border-red-700 hover:bg-red-50' 
                : 'bg-red-700 text-white hover:bg-red-800'
            }`}
            onClick={handleFollow}
          >
            {following ? 'Following' : 'Follow'}
          </button>
        </div>

        {/* User Stats */}
        <div className="flex gap-4 mt-4 text-sm">
          <span><strong>{recipes.length}</strong> Recipes</span>
          <span><strong>{followers}</strong> Followers</span>
          <span><strong>{followingCount}</strong> Following</span>
        </div>
      </div>

      {/* Tabs for Recipes and Liked Recipes */}
      <div className="mt-8">
        <div className="flex border-b border-gray-200">
          <button 
            className={`px-4 py-2 ${activeTab === 'recipes' ? 'border-b-2 border-red-700 text-red-700' : 'text-gray-500'}`}
            onClick={() => setActiveTab('recipes')}
          >
            Recipes
          </button>
          <button 
            className={`px-4 py-2 ${activeTab === 'liked' ? 'border-b-2 border-red-700 text-red-700' : 'text-gray-500'}`}
            onClick={() => setActiveTab('liked')}
          >
            Liked Recipes
          </button>
        </div>

        {activeTab === 'recipes' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {loading ? (
              <p>Loading recipes...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : recipes.length > 0 ? (
              recipes.map((recipe) => (
                <div key={recipe.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img 
                    src={recipe.image || "/placeholder.svg?height=200&width=300"} 
                    alt={recipe.name} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">{recipe.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{recipe.description}</p>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>⭐ {recipe.rating}</span>
                      <span>👍 {recipe.likes}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No recipes posted</p>
            )}
          </div>
        )}

        {activeTab === 'liked' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {loading ? (
              <p>Loading liked recipes...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : likedRecipes.length > 0 ? (
              likedRecipes.map((recipe) => (
                <div key={recipe.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img 
                    src={recipe.image || "/placeholder.svg?height=200&width=300"} 
                    alt={recipe.name} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">{recipe.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{recipe.description}</p>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>⭐ {recipe.rating}</span>
                      <span>👍 {recipe.likes}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No liked recipes</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
