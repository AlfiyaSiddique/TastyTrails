// eslint-disable-next-line no-unused-vars
import React, { useEffect } from "react";
import Foods from "../assets/Images/ArrayOfFoods.png";
import Search from "../assets/Images/Seach Recipe.png";
import Cooking from "../assets/Images/Cooking.png";
import Cards from "../Components/Cards";
import massa from "../assets/Images/Massaman.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import backendURL from "../../common/backendUrl";

const Landing = () => {
  const navigator = useNavigate();
  useEffect(()=>{
    const token = JSON.parse(localStorage.getItem("tastytoken"));
   if(token){
     axios.post(`${backendURL}/api/token`, {token})
     .then((res)=>{
       if(res.data.success){
        navigator(`/user/${res.data.user._id}`, {state: {user: res.data.user}})
       }
     })
     .catch((err)=>{
      console.log(err)
     })
   }
  }, [])
  
  return (
    <div className="min-h-screen" id="Landing">
      {/* -------------------------- Hero Section ----------------------  */}
      <section id="Hero" className="py-4 my-2">
        <div className="min-h-screen flex justify-center items-center">
          <h1 className=" font-extrabold text-red-700 text-[3rem] text-center md:w-[40%] sm:w-[60%] font-[Roboto]">
            Where Flovour Meets Perfection
          </h1>
        </div>
      </section>

      {/* -------------------------- Features Section ----------------------  */}
      <section id="Fetaure" className="py-4 my-20 mx-8">
        <h1 className="text-center font-semibold text-4xl text-red-700 my-4 font-[Merriweather]">
          Features
        </h1>
        <div className="grid sm:grid-cols-1 md:grid-cols-3">
          <div className="p-4 sm:mb-0 mb-6 text-center">
            <div className="rounded-lg overflow-hidden ">
              <img
                alt="content"
                className="object-center w-[30%] h-[30%] m-auto"
                src={Foods}
              />
            </div>
            <h2 className="text-xl title-font text-gray-900 mt-5 font-semibold">
              Array of Delights
            </h2>
            <p className="text-base leading-relaxed mt-2 text-left">
              Indulge in our diverse array of culinary delights from across the
              globe. Discover a rich assortment of recipes that cater to every
              palate, from comforting classics to innovative flavors, providing
              a delightful journey through the world of gastronomy.
            </p>
          </div>
          <div className="p-4 sm:mb-0 mb-6 text-center">
            <div className="rounded-lg overflow-hidden ">
              <img
                alt="content"
                className="object-center w-[30%] h-[30%] m-auto"
                src={Search}
              />
            </div>
            <h2 className="text-xl title-font text-gray-900 mt-5 font-semibold">
              Customized Recipe Search
            </h2>
            <p className="text-base leading-relaxed mt-2 text-left">
              Explore the art of personalized recipe discovery with our
              intuitive search tools. Tailor your culinary exploration by
              filtering recipes based on ingredients, cuisine types, dietary
              preferences, and more, ensuring a seamless and customized
              recipe-finding experience.
            </p>
          </div>
          <div className="p-4 sm:mb-0 mb-6 text-center">
            <div className="rounded-lg overflow-hidden ">
              <img
                alt="content"
                className="object-center w-[30%] h-[30%] m-auto"
                src={Cooking}
              />
            </div>
            <h2 className="text-xl title-font text-gray-900 mt-5 font-semibold">
              Create Your Own Masterpiece
            </h2>
            <p className="text-base leading-relaxed mt-2 text-left">
              Unleash your inner chef and craft your culinary masterpieces.
              Share your unique recipes, secret ingredients, and personal
              touches with our community, fostering a space where creativity
              thrives, inspiring others to create and innovate in the kitchen.
            </p>
          </div>
        </div>
      </section>

      {/* -------------------------- Best Dishes Section ----------------------  */}
      <section id="Trending" className="py-4 my-20 mx-8">
        <h1 className="text-center font-semibold text-4xl text-red-700 my-4 font-[Merriweather]">
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          Worlds's Best Dishes
        </h1>
        <Cards />
      </section>

      {/* -------------------------- About Section ----------------------  */}
      <section
        className="text-gray-600 body-font overflow-hidden py-4 my-20 mx-8"
        id="About"
      >
        <div className="container">
          <div className=" w-[70vw] mx-auto grid md:grid-cols-2 sm:grid-cols-1">
            <div className="w-full lg:pr-10 lg:py-6 mb-6 lg:mb-0 flex flex-col justify-center items-center">
              <h2 className="text-sm title-font text-gray-500 tracking-widest">
                TastyTrails
              </h2>
              <h1 className="font-bold text-3xl title-font mb-4 font-[Merriweather] text-red-700">
                About Us
              </h1>

              <p className="leading-relaxed mb-4 w-[80%]">
                Fam locavore kickstarter distillery. Mixtape chillwave tumeric
                sriracha taximy chia microdosing tilde DIY. XOXO fam inxigo
                juiceramps cornhole raw denim forage brooklyn. Everyday carry +1
                seitan poutine tumeric. Gastropub blue bottle austin listicle
                pour-over, neutra jean.
              </p>
            </div>
            <img
              alt="ecommerce"
              className="object-cover object-center rounded sm:w-[80%] mx-auto"
              src={massa}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
