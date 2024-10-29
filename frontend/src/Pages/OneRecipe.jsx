// eslint-disable-next-line no-unused-vars
import { useEffect } from "react";
import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import { MdDelete } from "react-icons/md";


// Displays single Recipe
const OneRecipe = () => {

  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const token = JSON.parse(localStorage.getItem("tastytoken"));
  const recipeId = useParams().id
  const [loading, setLoading] = useState(true)
  const [recipe, setRecipe] = useState({});
  const location = useLocation();
  const navigate = useNavigate()
  const [date, newDate] = useState('')
  useEffect(() => {
    // Moved to top level
    // Check if the recipe exists in the state passed via useLocation
    if (location.state && location.state.dish) {
      setRecipe(location.state.dish);
      setLoading(false);
    }
    else {
      axios.get(`${backendURL}/api/recipe/${recipeId}`)
        .then((res) => {
          if (res.status === 200) {
            // console.log(res.data.dish)
            setRecipe(res.data.dish)
            setLoading(false)
          }
          else {
            toast.info(res.message || "Something went wrong")
            navigate('*')
          }
        })
        .catch((err) => {
          console.log(err)
          toast.info("Internal server error")
          navigate('*')
        })
    }

  }, [])


  // States for handling comments and input
  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState([]);

  // To fetch earlier posted comments from database

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`${backendURL}/api/recipe/getcomments/${recipe._id}`);
        setComments(response.data.comments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    newDate(new Date(recipe.date))
    fetchComments();
  }, [recipe]);


  // Function to handle posting a comment
  const handlePostComment = async () => {
    // getting username from token named "username" created during login
    const username = JSON.parse(localStorage.getItem("username"));
    if (commentInput.trim()) {
      try {
        await axios.post(`${backendURL}/api/recipe/addcomment`, {
          recipeId: recipe._id,
          username: username,  // Assuming the user is already logged in
          content: commentInput,
        },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setComments([...comments, { username: username, content: commentInput, date: new Date() }]);
        setCommentInput("");
      } catch (error) {
        console.error("Error posting comment:", error);
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      // Send a DELETE request to the backend to remove the comment by ID

      const response = await axios.delete(
        `${backendURL}/api/recipe/deletecomment/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Use token for authentication
          },
        }
      );
      setComments(comments.filter((comment) => comment._id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error.message);
    }
  };

  if (loading || (!recipe)) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <div className="rounded-full w-16 h-16 border-4 border-t-transparent border-white animate-spin"></div>
      </div>
    )
  }
  return (
    <div className="w-[80vw] m-auto  my-12 ">
      <h1 className="text-3xl font-extrabold text-red-700 my-8 text-center">{recipe.name}</h1>
      <form>
        <div className="md:grid md:grid-cols-[50%_50%] space-x-4 image">
          <input
            type="image"
            src={recipe.image}
            className="h-[60vh] border border-red-700 rounded-md 
         w-full object-cover object-center"
          />
          <div className="relative">
            <h2
              className="text-red-700 font-semibold text-lg text-center"
            >
              About the Dish
            </h2>
            <div
              className="w-full h-40 bg-red-100 bg-opacity-50 rounded border border-gray-300 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-200 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out my-2"
            >{recipe.description}</div>
            <div className="flex md:justify-start md:items-center flex-col items-start">
              <div
                className="font-bold text-md text-center mx-4"
              >
                <span className="text-red-700 ">Category:</span> {recipe.type.join(", ")}
              </div>
              <div
                className="flex md:justify-between text-md font-bold text-center mx-4"
              >
                <span className="text-red-700 mx-2">Date:</span>{`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`}
              </div>
            </div>
            {recipe.author && <span className=" mx-4 text-md font-bold"><span className="text-red-700">Author:</span>{recipe.author}</span>}
          </div>
        </div>

        <div className="md:grid md:grid-cols-[40%_60%] my-16 ">
          <div className="px-4 border-e border-gray-200">
            <div
              className="text-red-700 font-semibold text-lg"
            >
              List of Ingredients
            </div>
            <ul className="list-disc list-inside">

              {recipe.ingredients.map((item, index) => {
                return <li className="py-1" key={index}>{item}</li>
              })}
            </ul>
          </div>
          <div className="px-4 mt-5 md:mt-0">
            <div
              className="text-red-700 font-semibold text-lg"
            >
              Steps
            </div>
            <ol className="list-inside list-decimal">
              {recipe.steps.map((item, index) => {
                return <li className="py-1" key={index}>{item}</li>
              })}
            </ol>
          </div>
        </div>
      </form>

      {/* Comment Section */}
      <div className="my-8">
        <h2 className="text-xl font-bold text-red-700">Comments</h2>
        <div className="my-4">
          <textarea
            className="w-full border border-gray-300 p-2 rounded-md"
            placeholder="Write a comment..."
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
          />
          <button
            className="bg-red-700 text-white px-4 py-2 mt-2 rounded-md"
            onClick={handlePostComment}
            type="button"
          >
            Post
          </button>
        </div>

        {/* Displaying Comments */}
        <div className="mt-4">
          {comments && comments.length > 0 ? (
            comments.map((comment, index) => (
              <div
              key={index}
              className="border border-gray-300 p-4 rounded-md mb-2 flex justify-between  items-start"
            >
              <div>
                <h3 className="font-semibold">{comment?.username}</h3>
                <p>{comment?.content}</p>
                <small className="text-gray-500">
                  {new Date(comment?.date).getFullYear()}-
                  {new Date(comment?.date).getMonth() + 1}-
                  {new Date(comment?.date).getDate()}
                </small>
              </div>
              <div
                className="cursor-pointer"
                onClick={() => handleDeleteComment(comment?._id)}
              >
                <span className=" p-2 text-red-500 ">
                  <MdDelete />
                </span>
              </div>
            </div>
            ))
          ) : (
            <p className="text-gray-500">No comments yet.</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default OneRecipe;