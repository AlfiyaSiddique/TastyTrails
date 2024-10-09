import { useState, useEffect } from "react";
import validate from "../../common/validation.js";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";

const UpdateRecipe = ({ darkMode }) => {
  // Route Hooks
  const recipe = useLocation().state.recipe;
  const user = useLocation().state.user;
  const navigator = useNavigate();
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  // States
  const [selectedImage, setSelectedImage] = useState(recipe.image);
  const [imagePreview, setImagePreview] = useState(recipe.image);
  const [ingredient, setIngredient] = useState("");
  const [steps, setSteps] = useState("");
  const [arrUpdate, setArrUpdate] = useState({ type: "", index: null });
  const [error, setError] = useState({
    name: false,
    nameError: false,
    description: false,
    descriptionError: false,
    type: false,
    typeError: false,
    ingredients: false,
    ingredientsError: false,
    steps: false,
    stepsError: false,
  });

  const [form, setForm] = useState({
    name: recipe.name,
    description: recipe.description,
    type: recipe.type,
    ingredients: recipe.ingredients,
    steps: recipe.steps,
    image: recipe.image,
    imagename: "",
    user: user._id,
    author: `${user.firstName} ${user.lastName}`,
    id: recipe._id,
  });

  // Token
  const token = JSON.parse(localStorage.getItem("tastytoken"));

  // Function to handle Image Change
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    form.imagename = file.name;

    if (file) {
      setSelectedImage(file);

      const readDataURL = new FileReader();
      readDataURL.onloadend = () => {
        setImagePreview(readDataURL.result);
        form.image = readDataURL.result;
      };
      readDataURL.readAsDataURL(file);
    }
  };

  // Function to handle Fields Change
  const handleChange = (e, type) => {
    const { name, value } = e.target;
    if (type === "string") {
      setForm((prev) => ({ ...prev, [name]: value }));
    } else {
      setForm((prev) => ({ ...prev, [name]: [...prev[name], value] }));
    }
  };

  // Function to handle when a type checkbox is unchecked
  const removeType = (val) => {
    const filter = form.type.filter((elem) => elem !== val);
    setForm((prev) => ({ ...prev, type: filter }));
  };

  // Function to handle when a type checkbox is checked
  const handleCheckbox = (e) => {
    if (e.target.checked) {
      handleChange(e, "array");
    } else {
      removeType(e.target.value);
    }

    handleError(e);
  };

  // Function to handle inline validation error
  const handleError = (e) => {
    const { name, value } = e.target;
    const minLen = name === "type" ? 1 : 3;
    const message = {
      type: "Select Min. 1 Category",
      ingredients: "Min. 3 Ingredients are required",
      steps: "Min. 3 Steps are required",
    };
    let error = null;
    if (name === "name" || name === "description") {
      error = validate[name](value);
    } else {
      error = validate.arr(minLen, form[name].length + 1, name, message[name]);
    }
    setError((prev) => ({ ...prev, ...error }));
  };

  // Function to handle Submission of form
  const handleSubmit = () => {
    let submitable = true;
    Object.values(error).forEach((val) => {
      if (val) {
        submitable = false;
        return;
      }
    });

    if (selectedImage === null) {
      submitable = false;
    }

    if (submitable) {
      axios
        .post(`${backendURL}/api/recipe/update`, form, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res.data.success) {
            toast.success(res.data.message);
            navigator(`/user/${user.id}`, { state: { user } });
          } else {
            toast.error("Some Error occurred please try again later.");
          }
        })
        .catch((err) => {
          toast.error("Some Error occurred please try again later.");
          console.log(err);
        });
    } else {
      toast.error("Fill all fields with valid values");
    }
  };

  return (
    <div className={`w-[80vw] m-auto my-12 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <h1 className="text-3xl font-extrabold text-red-700 my-8 text-center">Update Recipe</h1>
      <form>
        <div className="grid grid-cols-[50%_50%] space-x-4">
          {!selectedImage ? (
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className={`h-[70vh] flex flex-col items-center justify-center w-full border-2 border-red-700 border-dashed rounded-lg cursor-pointer 
                  ${darkMode ? 'bg-gray-800 hover:bg-gray-700 border-gray-600' : 'bg-gray-50 hover:bg-gray-100'}`}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FontAwesomeIcon
                    icon={faPen}
                    className={`w-8 h-8 mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                  />
                  <p className={`mb-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <span className="font-semibold">Click to upload Recipe Image</span> or drag and drop
                  </p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    PNG, JPG and JPEG(MAX. 800x400px)
                  </p>
                </div>
              </label>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                accept="image/png, image/jpeg, image/jpg"
                onChange={handleImageChange}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center w-full h-[70vh]">
              <img src={imagePreview} alt="Selected" className="h-full rounded-lg" />
              <button
                type="button"
                className={`flex items-center justify-center w-10 h-10 rounded-full bg-red-700 hover:bg-red-800 text-white absolute right-2 top-2 ${darkMode ? 'bg-red-600 hover:bg-red-700' : ''}`}
                onClick={() => setSelectedImage(null)}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          )}

          <div className={`flex flex-col ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} p-4 rounded-lg`}>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={(e) => handleChange(e, "string")}
              onBlur={handleError}
              placeholder="Recipe Name"
              className={`p-3 border border-red-300 rounded-lg ${darkMode ? 'bg-gray-700 placeholder-gray-400 text-white' : ''}`}
            />
            {error.nameError && <p className="text-red-500">{error.nameError}</p>}
            
            <textarea
              name="description"
              value={form.description}
              onChange={(e) => handleChange(e, "string")}
              onBlur={handleError}
              placeholder="Recipe Description"
              className={`mt-4 p-3 border border-red-300 rounded-lg h-24 ${darkMode ? 'bg-gray-700 placeholder-gray-400 text-white' : ''}`}
            />
            {error.descriptionError && <p className="text-red-500">{error.descriptionError}</p>}
          </div>
        </div>

        {/* Add your additional fields for type, ingredients, steps here with darkMode styles */}
        
        <button
          type="button"
          onClick={handleSubmit}
          className={`mt-6 px-4 py-2 rounded-lg text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 ${darkMode ? 'bg-red-600 hover:bg-red-700' : ''}`}
        >
          Update Recipe
        </button>
      </form>
    </div>
  );
};

UpdateRecipe.propTypes = {
  darkMode: PropTypes.bool.isRequired,
};

export default UpdateRecipe;
