import React, { useState } from "react";
import validate from "../../common/validation.js";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const AddRecipe = ({ darkMode }) => {
  // Route hooks
  const user = useLocation().state.user;
  const navigator = useNavigate();
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  // States
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [ingredient, setIngredient] = useState("");
  const [steps, setSteps] = useState("");
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
    name: "",
    description: "",
    type: [],
    ingredients: [],
    steps: [],
    image: "",
    imagename: "",
    user: user._id,
    author: `${user.firstName} ${user.lastName}`,
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
      setForm((prev) => {
        return { ...prev, [name]: value };
      });
    } else {
      setForm((prev) => {
        return { ...prev, [name]: [...prev[name], value] };
      });
    }
  };

  // Function to handle when a type checkbox is unchecked
  const removeType = (val) => {
    const filter = form.type.filter((elem) => {
      return elem !== val;
    });
    setForm((prev) => {
      return { ...prev, type: filter };
    });
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
    setError((prev) => {
      return { ...prev, ...error };
    });
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
        .post(`${backendURL}/api/recipe/add`, form, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res.data.success) {
            toast.success(res.data.message);
            navigator(`/user/${user._id}`, { state: { user } });
          } else {
            toast.error("Some error occurred. Please try again later.");
          }
        })
        .catch((err) => {
          toast.error("Some error occurred. Please try again later.");
          console.log(err);
        });
    } else {
      toast.error("Fill all fields with valid values.");
    }
  };

  return (
    <div className={`w-[80vw] m-auto my-12 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
      <h1 className="text-3xl font-extrabold text-red-700 my-8 text-center">
        New Recipe
      </h1>
      <form>
        <div className="md:grid md:grid-cols-[50%_50%] md:space-x-4">
          {!selectedImage ? (
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className={`h-[70vh] flex flex-col items-center justify-center w-full border-2 ${darkMode ? "border-red-600" : "border-red-700"} border-dashed rounded-lg cursor-pointer ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-50 hover:bg-gray-100"}`}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm">
                    <span className="font-semibold">
                      Click to upload Recipe Image
                    </span>{" "}
                    or drag and drop
                  </p>
                  <p className="text-xs">
                    PNG, JPG and JPEG (MAX. 800x400px)
                  </p>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  accept=".jpg, .png, image/jpeg, image/png"
                  onChange={handleImageChange}
                  required={true}
                />
              </label>
            </div>
          ) : (
            <div>
              <img
                src={imagePreview}
                className="h-[70vh] border border-red-700 rounded-md w-full object-cover object-center"
              />
            </div>
          )}

          <div className="relative">
            <label
              htmlFor="name"
              className="text-red-700 font-semibold text-lg text-center"
            >
              Recipe Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={form.name}
              placeholder="Recipe Name"
              className={`bg-gray-50 mb-4 border border-gray-300 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 ${darkMode ? "dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" : "dark:bg-white dark:border-gray-300 dark:placeholder-gray-600 dark:text-gray-800 dark:focus:ring-blue-500 dark:focus:border-blue-500"}`}
              required={true}
              onChange={(e) => {
                handleChange(e, "string");
                handleError(e);
              }}
            />
            {error.name && (
              <p className="text-red-500 text-sm">{error.nameError}</p>
            )}
            <label
              htmlFor="description"
              className="text-red-700 font-semibold text-lg text-center"
            >
              About the Recipe
            </label>

            <textarea
              id="description"
              name="description"
              className={`w-full mb-4 border border-gray-300 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-2.5 ${darkMode ? "dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" : "dark:bg-white dark:border-gray-300 dark:placeholder-gray-600 dark:text-gray-800 dark:focus:ring-blue-500 dark:focus:border-blue-500"}`}
              placeholder="Description"
              value={form.description}
              onChange={(e) => {
                handleChange(e, "string");
                handleError(e);
              }}
              required={true}
            />
            {error.description && (
              <p className="text-red-500 text-sm">{error.descriptionError}</p>
            )}

            <label className="text-red-700 font-semibold text-lg text-center mb-2">Select Categories</label>
            <div className="flex space-x-2 mb-4">
              <label>
                <input type="checkbox" value="Breakfast" onChange={handleCheckbox} />
                Breakfast
              </label>
              <label>
                <input type="checkbox" value="Lunch" onChange={handleCheckbox} />
                Lunch
              </label>
              <label>
                <input type="checkbox" value="Dinner" onChange={handleCheckbox} />
                Dinner
              </label>
              <label>
                <input type="checkbox" value="Dessert" onChange={handleCheckbox} />
                Dessert
              </label>
            </div>
            {error.type && (
              <p className="text-red-500 text-sm">{error.typeError}</p>
            )}

            <label
              htmlFor="ingredients"
              className="text-red-700 font-semibold text-lg text-center"
            >
              Ingredients
            </label>
            <input
              type="text"
              name="ingredients"
              id="ingredients"
              value={ingredient}
              placeholder="Add Ingredient"
              className={`bg-gray-50 mb-4 border border-gray-300 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 ${darkMode ? "dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" : "dark:bg-white dark:border-gray-300 dark:placeholder-gray-600 dark:text-gray-800 dark:focus:ring-blue-500 dark:focus:border-blue-500"}`}
              onChange={(e) => setIngredient(e.target.value)}
            />
            <button
              type="button"
              onClick={() => {
                if (ingredient.trim() !== "") {
                  handleChange({ target: { name: "ingredients", value: ingredient } }, "array");
                  setIngredient("");
                }
              }}
              className="text-white bg-red-700 hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
            >
              Add Ingredient
            </button>
            <ul className="list-disc pl-5 mb-4">
              {form.ingredients.map((ing, index) => (
                <li key={index}>{ing}</li>
              ))}
            </ul>
            {error.ingredients && (
              <p className="text-red-500 text-sm">{error.ingredientsError}</p>
            )}

            <label
              htmlFor="steps"
              className="text-red-700 font-semibold text-lg text-center"
            >
              Steps
            </label>
            <textarea
              id="steps"
              name="steps"
              className={`w-full mb-4 border border-gray-300 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-2.5 ${darkMode ? "dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" : "dark:bg-white dark:border-gray-300 dark:placeholder-gray-600 dark:text-gray-800 dark:focus:ring-blue-500 dark:focus:border-blue-500"}`}
              placeholder="Add Step"
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
            />
            <button
              type="button"
              onClick={() => {
                if (steps.trim() !== "") {
                  handleChange({ target: { name: "steps", value: steps } }, "array");
                  setSteps("");
                }
              }}
              className="text-white bg-red-700 hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
            >
              Add Step
            </button>
            <ul className="list-disc pl-5 mb-4">
              {form.steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
            {error.steps && (
              <p className="text-red-500 text-sm">{error.stepsError}</p>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              className="w-full text-white bg-red-700 hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5"
            >
              Submit Recipe
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddRecipe;
