
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

const Dashboard = () => {
    // Routes hooks and passed data
    const navigator = useNavigate();
    const backendURL = import.meta.env.VITE_BACKEND_URL;
    const token = JSON.parse(localStorage.getItem("tastytoken"));
    const user = useLocation().state.user;
    const [loading, setLoading] = useState(true);
    const [recipes, setRecipes] = useState([]);
    const [error, setError] = useState(null); // Track any errors

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

    useEffect(() => {
        if (user._id) {
            fetchRecipes(); // Only fetch recipes if user ID is available
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
                    console.error("Error deleting recipe:", err);
                });
        }
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
                        <span className="mr-5 hover:text-gray-900 cursor-pointer border-b border-red-700 pb-1">
                            My Recipe
                        </span>
                        <span className="mr-5 hover:text-gray-900 cursor-pointer">Liked Recipe</span>
                    </nav>
                    <section className="text-gray-600 body-font overflow-hidden">
                        <div className="container px-4 py-8 mx-auto">
                            {loading ? (
                                <div className="">
                                    {Array.from({ length: 6 }).map((item, i) => {
                                        return (
                                            <div
                                                key={i}
                                                className="h-[230px] sm:h-[280px] bg-gray-200 animate-pulse rounded-sm mb-4"
                                            />
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="-my-8 divide-y-2 divide-gray-100">
                                    {recipes.map((recipe) => {
                                        return (
                                            <div
                                                key={recipe._id}
                                                className="cursor-pointer py-8 flex flex-wrap md:flex-nowrap"
                                            >
                                                <div className="md:w-[7rem] md:mb-0 mb-6 flex-shrink-0 flex flex-col">
                                                    <span className="font-semibold title-font text-gray-700">
                                                        {recipe.type.join(", ")}
                                                    </span>
                                                    <span className="mt-1 text-gray-500 text-sm">
                                                        {new Date(recipe.date).getFullYear()}-
                                                        {new Date(recipe.date).getMonth() + 1}-
                                                        {new Date(recipe.date).getDate()}
                                                    </span>
                                                </div>
                                                <div className="md:flex-grow">
                                                    <h2 className="text-2xl font-medium text-gray-900 title-font mb-2">
                                                        {recipe.name}
                                                    </h2>
                                                    <p className="leading-relaxed">
                                                        {recipe.description.slice(0, 174)}
                                                        {recipe.description.length > 174 ? "..." : null}
                                                    </p>
                                                    <span className="inline-flex items-center mt-4">
                                                        <span
                                                            onClick={() =>
                                                                navigator(`/user/${user._id}/update/recipe`, {
                                                                    state: { recipe, user },
                                                                })
                                                            }
                                                        >
                                                            {" "}
                                                            <FontAwesomeIcon icon={faPen} />
                                                            Update
                                                        </span>
                                                        <span
                                                            onClick={() => handleDelete(recipe._id)}
                                                            className="mx-4 text-red-500"
                                                        >
                                                            {" "}
                                                            <FontAwesomeIcon icon={faTrash} /> Delete
                                                        </span>
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </section>
                </div>
                <div className="border-l-[1px] border-gray-200 hidden md:block">
                    <section className="text-gray-600 body-font">
                        <div className="container mx-auto flex px-5 py-20 items-center justify-center flex-col">
                            <img
                                className="lg:w-2/5 md:w-3/6 w-5/6 mb-10 object-cover object-center rounded-[100%]"
                                alt="profile"
                                src={user.profile}
                                loading="lazy"
                            />
                            <div className="text-center lg:w-2/3 w-full">
                                <h1>
                                    {user.firstName} {user.lastName}
                                </h1>
                                <h1 className="text-black">
                                    Followers: {user.followers.length} Following: {user.following.length}
                                </h1>
                                {/* <p className="mb-8 leading-relaxed">
                  Meggings kinfolk echo park stumptown DIY, kale chips beard
                  jianbing tousled. Chambray dreamcatcher trust fund, kitsch
                  vice godard disrupt ramps
                </p> */}
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
