import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import Cards from "../Components/Cards"; // Import Cards component

const Dashboard = () => {
  // Routes hooks and passed data
  const navigator = useNavigate();
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const token = JSON.parse(localStorage.getItem("tastytoken"));
  const user = useLocation().state.user;
  const [loading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null); // Track any errors
  const [likedRecipes, setLikedRecipes] = useState([]);
  const [viewingLikedRecipes, setViewingLikedRecipes] = useState(false); // Track if we are viewing liked recipes
  const [imagePreview, setImagePreview] = useState(
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
  );
  const inputFile = useRef(null);
  // Function to fetch all recipes for the user
  const [form, setForm] = useState({
    id: user._id,
    profile: user.profile,
  });
  const fetchRecipes = () => {
    setLoading(true);
    setError(null); // Reset any previous errors
    axios
      .post(
        `${backendURL}/api/recipe/readall`,
        { id: user._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setRecipes(res.data.recipes);
      })
      .catch((err) => {
        console.error("Error fetching recipes:", err);
        setError("Failed to fetch recipes. Please try again.");
      })
      .finally(() => setLoading(false));
  };
  const fetchLikedRecipes = () => {
    axios
      .post(
        `${backendURL}/api/recipe/liked_recipes`,
        { userId: user._id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        setLikedRecipes(res.data.likedRecipes);
      })
      .catch((err) => {
        console.error("Error fetching liked recipes:", err);
        setError("Failed to fetch liked recipes. Please try again.");
      });
  };
  const fetchUserImage = () => {
    axios
      .post(`${backendURL}/api/user/fetch`, { id: user._id })
      .then((res) => {
        setImagePreview(res.data.profile);
      })
      .catch((err) => {
        console.error("Error fetching user data", err);
      });
  };
  useEffect(() => {
    if (user._id) {
      fetchRecipes(); // Only fetch recipes if user ID is available
      fetchUserImage();
    } else {
      console.error("User ID is missing!");
      setError("User data is not available.");
    }
  }, [user._id]);

  const handleDelete = (id) => {
    const val = confirm("Are you sure you want to delete this recipe?");
    if (val) {
      axios
        .post(
          `${backendURL}/api/recipe/delete`,
          { id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          if (res.data.success) {
            toast.success("Recipe Deleted Successfully");
            setRecipes((prevRecipes) =>
              prevRecipes.filter((recipe) => recipe._id !== id)
            );
          } else {
            toast.error("Failed to delete. Please try again later.");
          }
        })
        .catch((err) => {
          toast.error(`Error deleting the recipe: ${err.message}`);
        });
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    if (file) {
      // setUserImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      reader.onload = () => {
        changeImageBackend(reader.result);
      };
    }
  };

  const changeImageBackend = (userImgBase64) => {
    form.profile = userImgBase64;
    axios
      .post(`${backendURL}/api/user/imageUpdate`, form)
      .then((res) => {
        if (res.data.success) {
          toast.success(res.data.message);
        } else {
          toast.error("Some Error occured please try again later.");
        }
      })
      .catch((err) => {
        toast.error("Some Error occured please try again later.");
        // console.log(err);
      });
  };

  const uploadImage = async () => {
    inputFile.current.click();
  };

  // Function to Logout
  const logout = () => {
    localStorage.removeItem("tastytoken");
    navigator("/");
  };

  return (
    <div id="userDashboard" className="border-gray-200 border-t-[1px]">
      <div className="grid md:grid-cols-[70%_30%] grid-cols-1 relative">
        <div className="p-16 h-[100vh] relative overflow-y-scroll max-w-[100%]">
          <h1 className="title-font sm:text-4xl text-2xl mb-4 font-medium text-gray-900 font-[Merriweather]">
            {user.username}
          </h1>
          <nav className="md:ml-auto md:mr-auto flex flex-wrap items-start text-base justify-star border-b border-gray-200">
            <span
              className={`mr-5 hover:text-gray-900 cursor-pointer border-b pb-1 ${
                !viewingLikedRecipes ? "border-red-700" : ""
              }`}
              onClick={() => setViewingLikedRecipes(false)}
            >
              My Recipe
            </span>
            <span
              className={`mr-5 hover:text-gray-900 cursor-pointer ${
                viewingLikedRecipes ? "border-red-700" : ""
              }`}
              onClick={() => {
                setViewingLikedRecipes(true);
                fetchLikedRecipes(); // Fetch liked recipes when the tab is clicked
              }}
            >
              Liked Recipe
            </span>
          </nav>
          <section className="text-gray-600 body-font overflow-hidden">
            <div className="container px-4 py-8 mx-auto">
              {loading ? (
                <div>Loading...</div>
              ) : (
                <div className="-my-8 divide-y-2 divide-gray-100">
                  {viewingLikedRecipes
                    ? likedRecipes.map((recipe) => (
                        <Cards key={recipe._id} dish={recipe} />
                        // Ensure recipe._id is unique
                      ))
                    : recipes.map((recipe) => (
                        <div
                          key={recipe._id}
                          className="cursor-pointer py-8 flex flex-wrap md:flex-nowrap"
                        >
                          <div className="md:w-[7rem] md:mb-0 mb-6 flex-shrink-0 flex flex-col">
                            <span className="font-semibold title-font text-gray-700">
                              {recipe.type.join(", ")}
                            </span>
                            <span className="mt-1 text-gray-500 text-sm">
                              {new Date(recipe.date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="md:flex-grow">
                            <h2 className="text-2xl font-medium text-gray-900 title-font mb-2">
                              {recipe.name}
                            </h2>
                            <p className="leading-relaxed">
                              {recipe.description.slice(0, 174)}
                              {recipe.description.length > 174 ? "..." : ""}
                            </p>
                            <span className="inline-flex items-center mt-4">
                              <span
                                onClick={() =>
                                  navigator(`/user/${user._id}/update/recipe`, {
                                    state: { recipe, user },
                                  })
                                }
                              >
                                <FontAwesomeIcon icon={faPen} />
                                Update
                              </span>
                              <span
                                onClick={() => handleDelete(recipe._id)}
                                className="mx-4 text-red-500"
                              >
                                <FontAwesomeIcon icon={faTrash} />
                                Delete
                              </span>
                            </span>
                          </div>
                        </div>
                      ))}
                </div>
              )}
            </div>
          </section>
        </div>
        <div className="border-l-[1px] border-gray-200 hidden md:block">
          <section className="text-gray-600 body-font">
            <div className="container mx-auto flex px-5 py-20 items-center justify-center flex-col">
              <img
                className="w-40 h-40 bg-gray-200 object-cover object-center rounded-[100%]"
                alt="profile"
                src={imagePreview}
                loading="lazy"
              />
              <FontAwesomeIcon
                icon={faPen}
                className="relative bottom-6 right-12 bg-neutral-300 rounded-full h-3.5 p-1.5 cursor-pointer hover:bg-neutral-400 hover:rotate-[-12deg]"
                onClick={uploadImage}
              />
              <input
                type="file"
                accept=".jpg, .png, image/jpeg, image/png"
                ref={inputFile}
                className="hidden"
                onChange={handleImageChange}
              ></input>
              <div className="text-center lg:w-2/3 w-full">
                <h1>
                  {user.firstName} {user.lastName}
                </h1>
                <h1 className="text-black">
                  Followers: {user.followers.length} Following:{" "}
                  {user.following.length}
                </h1>
                {/* 
                      <p className="mb-8 leading-relaxed">
                        Meggings kinfolk echo park stumptown DIY, kale chips beard
                        jianbing tousled. Chambray dreamcatcher trust fund, kitsch
                        vice godard disrupt ramps
                      </p>
                      */}
                <div className="flex justify-center">
                  <button
                    className="inline-flex text-white bg-red-700 border-0 py-2 px-3 focus:outline-none hover:bg-red-500 rounded text-md m-2"
                    onClick={logout}
                  >
                    Log Out
                  </button>
                  <button className="ml-4 inline-flex text-gray-700 bg-gray-100 py-2 px-3 focus:outline-none hover:bg-gray-200 rounded text-md border border-red-600 m-2">
                    Follow
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
