import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import Cards from "../Components/Cards"; // Import Cards component
import { Star } from "lucide-react";
const Dashboard = () => {
  // Routes hooks and passed data
  const navigator = useNavigate();
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const token = JSON.parse(localStorage.getItem("tastytoken"));
  const user = useLocation().state.user;
  const [loading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null); // Track any errors
  const [feedbacks, setFeedbacks] = useState([]);
  const [likedRecipes, setLikedRecipes] = useState([]);
  const [imagePreview, setImagePreview] = useState(
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
  ); // default image to preview
  const ViewState = {
    RECIPE: 'RECIPE',
    LIKED_RECIPE: 'LIKED_RECIPE',
    FEEDBACK: 'FEEDBACK',
  };
  const [viewingState, setViewingState] = useState(ViewState.RECIPE);
  const inputFile = useRef(null); // for redirecting click to open input file
  
  // form to send image change request
  const [form, setForm] = useState({
    id: user._id,
    profile: user.profile,
  });
  
  // Function to fetch all recipes for the user
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

  const fetchFeedbacks = () => {
    setLoading(true);
   
    fetch(`${backendURL}/api/feedback/${user._id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch feedbacks.');
        }
        return response.json();
      })
      .then((data) => {
        setFeedbacks(data.data);
      })
      .catch((error) => {
        console.error("Error fetching feedbacks:", error);
        setError("Failed to fetch feedbacks. Please try again.");
      })
      .finally(() => setLoading(false)); // Set loading to false after fetching
  };
  
  const handleFeedbackDelete = (id)=>{
    const val = confirm("Are you sure you want to delete this feedback?");
    if (val) {
      axios
        .post(
          `${backendURL}/api/feedback/delete`,
          { id: id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          if (res.data.success) {
            toast.success("Feedback Deleted Successfully");
            setFeedbacks((prevFeedbacks) =>
              prevFeedbacks.filter((feedback) => feedback._id !==   id)
            );
          } else {
            toast.error("Failed to delete feedback. Please try again later.");
          }
        })
        .catch((err) => {
          toast.error(`Error deleting the feedback: ${err.message}`);
        });
    }
    
  }
  useEffect(() => {
    if (user._id) {
      fetchRecipes(); // Only fetch recipes if user ID is available
      fetchUserImage(); // fetch user image if ID available
      fetchFeedbacks();
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

  // called by input field, it will set imagePreview and call changeImageBackend
  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    if (file) {
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

  // this convert image into Base64 format and send backend request to update profile field
  const changeImageBackend = (userImgBase64) => {
    form.profile = userImgBase64; //update profile value in form variable above
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

  // this will redirect click to inputFile
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
                viewingState === ViewState.RECIPE ? "border-red-700" : ""
              }`}
              onClick={() => setViewingState(ViewState.RECIPE)}
            >
              My Recipe
            </span>
            <span
              className={`mr-5 hover:text-gray-900 cursor-pointer ${
                viewingState === ViewState.LIKED_RECIPE ? "border-red-700" : ""
              }`}
              onClick={() => {
                setViewingState(ViewState.LIKED_RECIPE);
                fetchLikedRecipes(); // Fetch liked recipes when the tab is clicked
              }}
            >
              Liked Recipe
            </span>
            <span
              className={`mr-5 hover:text-gray-900 cursor-pointer border-b pb-1 ${
                (viewingState == ViewState.FEEDBACK) ? "border-red-700" : ""
              }`}
              onClick={() => setViewingState(ViewState.FEEDBACK)}
            >
              Feedbacks
            </span>
          </nav>
          <section className="text-gray-600 body-font overflow-hidden">
            <div className="container px-4 py-8 mx-auto">
              {loading ? (
                <div>Loading...</div>
              ) : (
                <div className="-my-8 divide-y-2 divide-gray-100">
                  {viewingState === ViewState.LIKED_RECIPE && likedRecipes.map((recipe) => (
                        <Cards key={recipe._id} dish={recipe} />
                        // Ensure recipe._id is unique
                      )) }
                    {viewingState === ViewState.RECIPE && recipes.map((recipe) => (
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
                  {viewingState === ViewState.FEEDBACK &&
                    feedbacks.map((feedback) => (
                      <div
                        key={feedback._id}
                        className="py-4"
                      >
                       <FeedbackCard feedback={feedback} handleFeedbackDelete={handleFeedbackDelete}/>
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
                onClick={uploadImage} // this function will redirect click to input field below
              />
              <input
                type="file"
                accept=".jpg, .png, image/jpeg, image/png"
                ref={inputFile} // set the above inputFile variable's reference
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

const FeedbackCard = ({feedback, handleFeedbackDelete})=>{
  return(
  <div className="rounded-lg mr-5 w-2/3 p-4 flex flex-col justify-between h-full transition-shadow duration-300 transform hover:scale-105 shadow-[0_2px_10px_rgba(0,0,0,0.3)] bg-white">
    <div>
      <div className="flex items-center mb-4">
        <img src={feedback.userId.profile} alt={feedback.userId.firstName} className="w-16 h-16 rounded-full border-2 mr-4 object-cover" />
        <div>
          <h3 className="font-semibold text-lg text-gray-800">{feedback.userId.firstName} {feedback.userId.lastName}</h3>
          <p className="text-sm text-red-600">{feedback.role}</p>
        </div>
        <div className="cursor-pointer absolute top-4 right-4 cursor-pointer" onClick={()=>handleFeedbackDelete(feedback._id)}>

        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="35" height="35" viewBox="0 0 72 72" style={{"fill" :"#FA5252"}}>
<path d="M 32.5 9 C 28.364 9 25 12.364 25 16.5 L 25 18 L 17 18 C 14.791 18 13 19.791 13 22 C 13 24.209 14.791 26 17 26 L 17.232422 26 L 18.671875 51.916016 C 18.923875 56.449016 22.67875 60 27.21875 60 L 44.78125 60 C 49.32125 60 53.076125 56.449016 53.328125 51.916016 L 54.767578 26 L 55 26 C 57.209 26 59 24.209 59 22 C 59 19.791 57.209 18 55 18 L 47 18 L 47 16.5 C 47 12.364 43.636 9 39.5 9 L 32.5 9 z M 32.5 16 L 39.5 16 C 39.775 16 40 16.224 40 16.5 L 40 18 L 32 18 L 32 16.5 C 32 16.224 32.225 16 32.5 16 z M 36 28 C 37.104 28 38 28.896 38 30 L 38 47.923828 C 38 49.028828 37.104 49.923828 36 49.923828 C 34.896 49.923828 34 49.027828 34 47.923828 L 34 30 C 34 28.896 34.896 28 36 28 z M 27.392578 28.001953 C 28.459578 27.979953 29.421937 28.827641 29.460938 29.931641 L 30.085938 47.931641 C 30.123938 49.035641 29.258297 49.959047 28.154297 49.998047 C 28.131297 49.999047 28.108937 50 28.085938 50 C 27.012938 50 26.125891 49.148359 26.087891 48.068359 L 25.462891 30.068359 C 25.424891 28.964359 26.288578 28.040953 27.392578 28.001953 z M 44.607422 28.001953 C 45.711422 28.039953 46.575109 28.964359 46.537109 30.068359 L 45.912109 48.068359 C 45.874109 49.148359 44.986063 50 43.914062 50 C 43.891062 50 43.868703 49.999047 43.845703 49.998047 C 42.741703 49.960047 41.876063 49.035641 41.914062 47.931641 L 42.539062 29.931641 C 42.577062 28.827641 43.518422 27.979953 44.607422 28.001953 z"></path>
</svg>
        </div>
      </div>
      <p className="text-xl font-bold mb-2 text-gray-800">"{feedback.quote}"</p>
      <p className="mb-4 text-gray-600">{feedback.review}</p>
    </div>
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`w-5 h-5 ${i < feedback.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
      ))}
    </div>
  </div>
)}
export default Dashboard;
