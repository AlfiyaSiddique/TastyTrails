/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-key */
import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import Cards from "../Components/Cards"; // Import Cards component
import { Star } from "lucide-react";
import { FaTrash  } from 'react-icons/fa';
import Modal from "react-modal"

const customStyles = {
  overlay: {
    position: 'fixed',
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    WebkitOverflowScrolling: 'touch',
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
  },
};

Modal.setAppElement('#root');


const Dashboard = () => {
  // Routes hooks and passed data
  const navigator = useNavigate();
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const token = JSON.parse(localStorage.getItem("tastytoken"));
  const user = useLocation().state.user;
  const [userData, setUserData] = useState(null)
  const path = useLocation().pathname;
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null); // Track any errors
  const [feedbacks, setFeedbacks] = useState([]);
  const [likedRecipes, setLikedRecipes] = useState([]);
  const [viewingLikedRecipes, setViewingLikedRecipes] = useState(false); // Track if we are viewing liked recipes
  const [userInfo, setUserInfo] = useState({});

  const ViewState = {
    RECIPE: 'RECIPE',
    LIKED_RECIPE: 'LIKED_RECIPE',
    FEEDBACK: 'FEEDBACK',
  };
  const [viewingState, setViewingState] = useState(ViewState.RECIPE);
  const inputFile = useRef(null); // for redirecting click to open input file
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
            setUserData(res.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setUserData(null);
    }
  }, [path]);
  // form to send image change request
  const [form, setForm] = useState({
    id: user._id,
    profile: userInfo.profile,
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

  const fetchUserInfo = () => {
    axios
      .post(`${backendURL}/api/user/fetch`, { id: user._id })
      .then((res) => {
        setUserInfo(res.data);
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
      fetchFeedbacks();
      fetchUserInfo(); // fetch user info(with image) if ID available
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
        setUserInfo({ ...userInfo, profile: reader.result });
      };
      reader.readAsDataURL(file);
      reader.onload = () => {
        changeImageBackend(reader.result);
      };
    }
  };

  // this convert image into Base64 format and send backend request to update profile field
  const changeImageBackend = () => {
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
  const handleAccountDelete = async () => {
    try {
      const response = await axios.delete(`${backendURL}/api/user/${user._id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token if required
        },
      });
      if (response.data.success) {
        logout();
      }
    } catch (error) {
      console.error("error deleting account", error);
      toast.error("Error! Account Deletion Failed")
    }
  };
  
  return (
    <div id="userDashboard" className="border-gray-200 border-t-[1px]">
      <div className="grid md:grid-cols-[70%_30%] grid-cols-1 relative">
        <div className="p-16 h-[100vh] relative overflow-y-scroll max-w-[100%]">
          <h1 className="title-font sm:text-4xl text-2xl mb-4 font-medium text-gray-900 font-[Merriweather]">
            {userInfo.username}
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
                src={userInfo.profile}
                loading="lazy"
              />
              <FontAwesomeIcon
                icon={faPen}
                className="relative bottom-6 right-12 bg-neutral-300 rounded-full h-3.5 p-1.5 cursor-pointer hover:bg-neutral-400 hover:rotate-[-12deg]"
                onClick={() => uploadImage()} // this function will redirect click to input field below
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
                  {userInfo.firstName} {userInfo.lastName}
                </h1>
                {userData && (

                <h1 className="text-black">
                  Followers: {userData.user.followers.length} Following:{" "}
                  {userData.user.following.length}
                </h1>
                )}
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
                <EditProfilePopup userInfo={userInfo} setUserInfo={setUserInfo}/>
                <button className="ml-4 inline-flex text-gray-700 bg-gray-100 py-2 px-3 focus:outline-none hover:bg-gray-200 rounded text-sm border border-red-600 m-2"
                onClick={() => setModalOpen(true)}>
                    Delete Account
                  </button>
                  <ConfirmationModal
        isOpen={isModalOpen}
        username={user.username}
        onClose={() => setModalOpen(false)}
        onConfirm={() => {
          handleAccountDelete();
          setModalOpen(false);
        }}
      />
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

        <FaTrash size={35} color="#FA5252" />
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

const ConfirmationModal = ({ isOpen, onClose, onConfirm, username }) => {
  const [inputValue, setInputValue] = useState("");


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded p-5 shadow-lg">
        <h2 className="text-lg font-semibold">Are you sure?</h2>
        <p className="mt-2">This action will permanently delete your account.</p>
        <p className="mt-2">Type <span className="bg-gray-200 font-bold rounded px-2">{username}</span> to confirm:</p>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 mt-2 w-full"
          placeholder="Enter your username"
        />
        <div className="mt-4 flex justify-between">
          <button onClick={onClose} className="text-gray-600 border border-red-500 px-4 py-2 rounded">Cancel</button>
          <button
            onClick={onConfirm}
            className={`bg-red-500 text-white px-4 py-2 rounded ${inputValue === username ? '' : 'opacity-50 cursor-not-allowed'}`}
            disabled={inputValue !== username} // Disable button if username does not match
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};


// info won't be updated on frontend after clicking 'done' below func will
function EditProfilePopup({userInfo, setUserInfo}) {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const inputFile = useRef(null); // for redirecting click to open input file
  const [profile, setProfile] = useState(userInfo.profile);
  const [uname, setUname] = useState(userInfo.username);
  const [fname, setFname] = useState(userInfo.firstName);
  const [lname, setLname] = useState(userInfo.lastName);
  const [email, setEmail] = useState(userInfo.email);
  const [bio, setBio] = useState(userInfo.bio);
  const uploadImage = async () => {
    inputFile.current.click();
  };
  useEffect(() => { 
    setUname(userInfo.username)
    setProfile(userInfo.profile)
    setFname(userInfo.firstName)
    setLname(userInfo.lastName)
    setEmail(userInfo.email)
    setBio(userInfo.bio)
  }, [userInfo] )

  const [form, setForm] = useState({
    id: userInfo._id,
    profile: profile,
    username: uname,
    firstName: fname,
    lastName: lname,
    email: email,
    bio: bio
  });

  useEffect(() => {
    setForm({
      id: userInfo._id,
      profile: profile,
      username: uname,
      firstName: fname,
      lastName: lname,
      email: email,
      bio: bio
    })
  }, [profile, uname, fname, lname, email, bio])

  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(reader.result);
      };
      reader.readAsDataURL(file);
      reader.onload = () => {
        setForm({...form, profile: profile})
      };
    }
  };

  function changeInfoBackend() {
    axios
      .post(`${backendURL}/api/user/infoUpdate`, form)
      .then((res) => {
        if (res.data.success) {
          toast.success(res.data.message);
          window.location.reload();
        } else {
          toast.error("Some Error occured please try again later.");
        }
      })
      .catch((err) => {
        toast.error("Some Error occured please try again later.");
        // console.log(err);
      });
  }

  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }
  return(
    <div className="flex justify-center">
      <button
        className="ml-4 inline-flex text-white bg-red-700 border-0 py-2 px-6 focus:outline-none hover:bg-red-500 rounded text-md m-2"
        onClick={openModal}
      >
        Edit Profile
      </button>
      <Modal
        isOpen={modalIsOpen}
        // onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div className="w-80 h-[70vh]">
          <h1 className="font-bold text-xl ">Edit Profile</h1>
          <FontAwesomeIcon icon={faTimes} onClick={closeModal} className="w-7 h-7 relative left-[97%] top-[-48px] text-gray-500 hover:cursor-pointer hover:text-black"/>
          <img
            className="w-28 h-28 relative bottom-6 bg-gray-200 object-cover object-center m-auto rounded-[100%]"
            alt="profile"
            src={profile}
            loading="lazy"
          />
          <FontAwesomeIcon
            icon={faPen}
            className="relative bottom-10 left-28 bg-neutral-300 rounded-full h-3.5 p-1 cursor-pointer hover:bg-neutral-400 hover:rotate-[-12deg]"
            onClick={uploadImage} // this function will redirect click to input field below
          />
          <input
            type="file"
            accept=".jpg, .png, image/jpeg, image/png"
            ref={inputFile} // set the above inputFile variable's reference
            className="hidden"
            onChange={handleImageChange}
          ></input>
          <div className="flex flex-col w-[70%] h-[45%] mx-4 my-[-30px]">
              {[
                ['User Name', uname, setUname],
                ['First Name', fname, setFname],
                ['Last Name', lname, setLname],
                ['Email', email, setEmail],
                ['Bio', bio, setBio]
              ].map(([title, value, setValue]) => (
                <div className="grid grid-cols-2 my-2.5">
                  <label className="my-auto text-lg">
                    {title}:
                  </label>
                  <input 
                    type="text"
                    className="w-40 border-2 border-red-600 rounded-md px-2 py-[4px] focus:border-2 focus:border-green-400"
                    defaultValue={value}
                    onChange={(e) => {setValue(e.target.value)}}
                  />
                </div>
              ))}
            <button className="ml-4 w-fit inline-flex relative left-24 text-gray-700 bg-gray-100 py-2 px-3 focus:outline-none hover:bg-gray-200 rounded text-md border border-red-600 m-2"
              onClick={changeInfoBackend}
            >
              Done
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
export default Dashboard;
