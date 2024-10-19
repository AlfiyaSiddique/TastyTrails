
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import useGoogleAuth from "../../common/useGoogleAuth";
import image from '../../public/TastyTrail.webP'
const Login = () => {
  const navigate = useNavigate(); 
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [show, setShow] = useState(false); //Eye EyeSlash Toggle
  const [form, setForm] = useState({
    searchTerm: "",
    password: "",
  });

  // Handling Login Form
  const handleChange = async (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      return { ...prev, [name]: value };
    });
  };
  

  // Handle Login Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${backendURL}/api/login`, form)
      .then((res) => {
        if (res.data.success) {
          toast.success("Login Successful");
          localStorage.setItem("tastytoken", JSON.stringify(res.data.token));
          // creating a token named "username" for storing logged in user's name for comment purposes
          localStorage.setItem("username", JSON.stringify(res.data.user.username));
          navigate(`/user/${res.data.user._id}`, {
            state: { user: res.data.user },
          });
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message);
        
      });
  };

  
  // Reusable function
  const handleLogin = (formData) => {
    axios
      .post(`${backendURL}/api/login`, formData)
      .then((res) => {
        if (res.data.success) {
          toast.success("Login Successful");
          localStorage.setItem("tastytoken", JSON.stringify(res.data.token));
          navigate(`/user/${res.data.user._id}`, {
            state: { user: res.data.user },
          });
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      
      });
  };
  // Using custom Google Auth hook
  const googleLogin = useGoogleAuth(handleLogin);

  return (
 <div className="w-[100vw] h-[75vh]  flex justify-center items-center  ">
     <div className="content w-[75vw] h-[56vh]  rounded-md   flex justify-evenly items-center">
      <div className="illustrations w-[40vw] h-[45vh] ">
        <h1 className="font-extrabold text-4xl ">Explore  Dishes Accross the globe like <span className="text-red-400">never before...</span></h1>
       <div className="content flex ">
       <div className="img h-[30vh] w-[25vw] item-center">
          <img className="h-[30vh] w-[25vw]" src={image} alt="" />
        </div>
        <div className="innerContent">
          <ul className="mt-12 font-bold text-2xl ml-6 px-5">
            <li className="text-yellow-400 py-1">Review</li>
            <li className="text-red-500 py-1">Share</li>
            <li className="py-1">Comments</li>
            
          </ul>
        </div>
        </div> 
      </div>
      <div className="loginForm w-[23vw] h-[55vh]  flex justify-evenly items-center">
    <div className="innerdiv w-[22vw] h-[55vh] rounded-xl shadow-md py-3 px-8 bg-[#343a40] border-white border-solid border-2 ">
     <h2 className="text-white font-semibold px-3 text-center">Login </h2>
    <form onSubmit={handleSubmit} className="space-y-2">
       <label htmlFor="email" className="text-white  text-sm pt-2">Email</label>
        <input
          type="text"
          name="searchTerm"
          id="searchTerm"
          placeholder="name@company.com"
                    required={true}
                    value={form.searchTerm}
                    onChange={handleChange}
          className="w-[18vw] h-[6vh] pl-3 rounded-md bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
         <label htmlFor="password" className="text-white  text-sm py-2">Password </label>
     <div className="relative ">  <input
           type={show ? "text" : "password"}
           name="password"
           id="password"
           placeholder="••••••••"
          className="w-[18vw] h-[6vh] pl-3 rounded-md bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          required={true}
          value={form.password}
          onChange={handleChange}
       />
        <FontAwesomeIcon
                      icon={show ? faEye : faEyeSlash}
                      onClick={() => setShow(!show)}
                      className="absolute top-0 right-0 m-3 cursor-pointer"
                    />
                    <p className="text-white text-[12px] mt-2 cursor-pointer ">Forget Password</p>
       </div>
        
        <button
          type="submit"
          className="w-[18vw] p-3 hover:border-white hover:border-solid hover:border-2  bg-orange-500 text-white rounded-md hover:bg-orange-600 transition"
        >
          Sign in
        </button>
        <p className="text-white text-center">or continue with</p>
        <button
          type="submit"
          onClick={() => googleLogin()}
          className="w-[18vw] p-3  hover:border-white hover:border-solid hover:border-2  bg-orange-500 text-white rounded-md hover:bg-orange-600 transition"
        >
          Sign in With Google
        </button>
        <p className="text-white  text-[12px] text-center">New To TastyTrails ? <Link
                    to="/signup"
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500 hover:text-red-700"
                  >
                    Register for free
                  </Link></p>
      </form></div>  
      </div>
     </div>
    </div>
  );
};

export default Login;