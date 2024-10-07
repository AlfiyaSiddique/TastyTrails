
import { useState } from "react";
import validate from "../../common/validation.js";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";

const UpdateRecipe = () => {
    // Route Hooks
  const recipe = useLocation().state.recipe;
  const user = useLocation().state.user;
  const navigator = useNavigate();
  const backendURL = import.meta.env.VITE_BACKEND_URL;

//   States
  const [selectedImage, setSelectedImage] = useState(recipe.image);
  const [imagePreview, setImagePreview] = useState(recipe.image);
  const [ingredient, setIngredient] = useState("");
  const [steps, setSteps] = useState("");
  const [arrUpdate, setArrUpdate] = useState(false);
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
    id: recipe._id
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
            toast.error("Some Error occured please try again later.");
          }
        })
        .catch((err) => {
          toast.success("Some Error occured please try again later.");
          console.log(err);
        });
    } else {
      toast.error("Fill all fields with valid values");
    }
  };

  return (
    <div className="w-[80vw] m-auto my-12">
      <h1 className="text-3xl font-extrabold text-red-700 my-8 text-center">
        Update Recipe
      </h1>
      <form>
        <div className="grid grid-cols-[50%_50%] space-x-4">
          {!selectedImage ? (
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className="h-[70vh] flex flex-col items-center justify-center w-full border-2 border-red-700 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
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
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">
                      Click to upload Recipe Image
                    </span>{" "}
                    or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG and JPEG(MAX. 800x400px)
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
              className="bg-gray-50 mb-4 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
              className="w-full h-40 bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-200 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out mb-4"
              value={form.description}
              onChange={(e) => {
                handleChange(e, "string");
                handleError(e);
              }}
            ></textarea>
            {error.description && (
              <p className="text-red-500 text-sm">{error.descriptionError}</p>
            )}
            <div>
              <label
                htmlFor="type"
                className="text-red-700 font-semibold text-lg text-center"
              >
                Choose Categories:
              </label>
              <div className="flex justify-between">
                <div className="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700">
                  <input
                    id="type1"
                    type="checkbox"
                    value="Main-meal"
                    name="type"
                    className="w-4 h-4 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    onChange={handleCheckbox}
                    checked={form.type.includes("Main-meal")}
                  />
                  <label
                    htmlFor="type1"
                    className="w-full py-2 ms-2 text-sm font-bold text-gray-900 dark:text-gray-300"
                  >
                    Main Meal
                  </label>
                </div>
                <div className="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700">
                  <input
                    id="type2"
                    type="checkbox"
                    value="Small-bite"
                    name="type"
                    className="w-4 h-4 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    onChange={handleCheckbox}
                    checked={form.type.includes("Small-bite")}
                  />
                  <label
                    htmlFor="type2"
                    className="w-full py-2 ms-2 text-sm font-bold text-gray-900 dark:text-gray-300"
                  >
                    Small Bite
                  </label>
                </div>
                <div className="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700">
                  <input
                    id="type3"
                    type="checkbox"
                    value="Healthy"
                    name="type"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    onChange={handleCheckbox}
                    checked={form.type.includes("Healthy")}

                  />
                  <label
                    htmlFor="type3"
                    className="w-full py-2 ms-2 text-sm font-bold text-gray-900 dark:text-gray-300"
                  >
                    Healthy
                  </label>
                </div>
              </div>
              {error.type && (
                <p className="text-red-500 text-sm">{error.typeError}</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[40%_60%] my-16">
          <div className="px-4 border-e border-gray-200">
            <label
              htmlFor="ingredients"
              className="text-red-700 font-semibold text-lg"
            >
              List of Ingredients
            </label>
            <ul className="list-disc list-inside">
              {form.ingredients.map((item, index) => {
                return (
                  <li
                    className="py-1 flex justify-between items-center"
                    key={index}
                  >
                    <span>{item}</span>
                    <span className="inline-flex items-center mt-4">
                      <FontAwesomeIcon
                        icon={faPen}
                        onClick={() => {
                          setIngredient(item);
                          setArrUpdate(index);
                        }}
                      />
                      <FontAwesomeIcon
                        className="mx-4 text-red-500"
                        icon={faTrash}
                        onClick={() =>
                          setForm((prev) => {
                            let arr = [...form.ingredients];
                            arr.splice(index, 1);
                            return { ...prev, ingredients: arr };
                          })
                        }
                      />
                    </span>
                  </li>
                );
              })}
            </ul>
            {error.ingredients && (
              <p className="text-red-500 text-sm">{error.ingredientsError}</p>
            )}

            <input
              type="text"
              name={"ingredients"}
              id="ingredients"
              className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out my-4"
              onChange={(e) => setIngredient(e.target.value)}
              value={ingredient}
            />
            <button
              type="button"
              className="inline-flex items-center bg-red-700 border-0 py-1 px-3 focus:outline-none hover:bg-red-500 rounded text-white mt-4 md:mt-0 transition-all"
              onClick={() => {
                if (typeof arrUpdate === "number") {
                  setForm((prev) => {
                    let arr = form.ingredients;
                    arr[arrUpdate] = ingredient;
                    return { ...prev, ingredients: arr };
                  });
                  setArrUpdate(false);
                } else {
                  setForm((prev) => {
                    return {
                      ...prev,
                      ingredients: [...prev.ingredients, ingredient],
                    };
                  });
                }
                handleError({
                  target: { name: "ingredients", value: ingredient },
                });
                setIngredient("");
              }}
            >
              {typeof arrUpdate === "number" && ingredient !== ""? "Update" : "Add"}
            </button>
          </div>
          <div className="px-4">
            <label
              htmlFor="steps"
              className="text-red-700 font-semibold text-lg"
            >
              Steps
            </label>
            <ol className="list-inside list-decimal">
              {form.steps.map((item, index) => {
                return (
                  <li
                    className="py-1 flex justify-between items-center"
                    key={index}
                  >
                    <span>{item}</span>
                    <span className="inline-flex items-center mt-4">
                      <FontAwesomeIcon
                        icon={faPen}
                        onClick={() => {
                          setSteps(item);
                          setArrUpdate(index);
                        }}
                      />
                      <FontAwesomeIcon
                        className="mx-4 text-red-500 cursor-pointer"
                        icon={faTrash}
                        onClick={() =>
                          setForm((prev) => {
                            let arr = [...form.steps];
                            arr.splice(index, 1);
                            return { ...prev, steps: arr };
                          })
                        }
                      />
                    </span>
                  </li>
                );
              })}
            </ol>
            {error.steps && (
              <p className="text-red-500 text-sm">{error.stepsError}</p>
            )}
            <input
              type="text"
              name="steps"
              id="steps"
              className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out my-4"
              onChange={(e) => {
                setSteps(e.target.value);
              }}
              value={steps}
            />
            <button
              className="inline-flex items-center bg-red-700 border-0 py-1 px-3 focus:outline-none hover:bg-red-500 rounded text-white mt-4 md:mt-0 transition-all"
              type="button"
              onClick={() => {
                if (typeof arrUpdate === "number") {
                  setForm((prev) => {
                    let arr = form.steps;
                    arr[arrUpdate] = steps;
                    return { ...prev, ingredients: arr };
                  });
                  setArrUpdate(false);
                } else {
                  setForm((prev) => {
                    return { ...prev, steps: [...prev.steps, steps] };
                  });
                }

                handleError({ target: { name: "steps", value: steps } });
                setSteps("");
              }}
            >
              {typeof arrUpdate === "number" && steps!== ""? "Update Steps": "Add Steps"} 
            </button>
          </div>
        </div>
      </form>
      <div onClick={handleSubmit} className="flex justify-center items-center">
        <button
          type="submit"
          className="bg-red-700 border-0 py-1 px-32 focus:outline-none hover:bg-red-500 rounded text-white mt-4 md:mt-0 transition-all"
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default UpdateRecipe;
