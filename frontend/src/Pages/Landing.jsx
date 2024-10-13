
import { useEffect, useState } from "react";
import Foods from "../assets/Images/ArrayOfFoods.png";
import Search from "../assets/Images/Seach Recipe.png";
import Cooking from "../assets/Images/Cooking.png";
import Cards from "../Components/Cards.jsx";
import massa from "../assets/Images/Massaman.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { darkMode } from "../store/atom.js";


const Landing = () => {
  const mode = useRecoilValue(darkMode);
  const navigator = useNavigate();
  const [best, setBest] = useState([])
  const [loading, setLoading] = useState(true);
  const backendURL = import.meta.env.VITE_BACKEND_URL;


  useEffect(() => {
    let token = localStorage.getItem("tastytoken");
    if (token) {
      token = JSON.parse(token)
      axios.get(`${backendURL}/api/token`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (res.data.success && window.location.pathname != '/') {
            navigator(`/user/${res.data.user._id}`, { state: { user: res.data.user } })
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [])


  useEffect(() => {
    setLoading(true);

    axios.get(`${backendURL}/api/recipes`)
      .then((res) => {

        setBest(res.data.recipes.slice(0, 3));
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [setBest]);

  return (
    <div className={`min-h-screen ${mode === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`} id="Landing">
      {/* -------------------------- Hero Section ----------------------  */}
      <section id="Hero" className="py-4 my-2">
        <div className="min-h-screen flex justify-center items-start">
          <h1
            className={`font-extrabold ${mode === 'dark' ? 'text-yellow-400' : 'text-red-700'} text-[4rem] text-center lg:mt-[5rem] md:w-[40%] sm:w-[60%] font-[Roboto] transition-transform duration-300`}
            style={{
              transition: 'transform 0.3s ease',
              textShadow: mode === 'dark'
                ? '0 1px 0 rgba(255,255,255,0.1), 0 2px 0 rgba(255,255,255,0.1), 0 3px 0 rgba(255,255,255,0.1), 0 4px 0 rgba(255,255,255,0.1)'
                : '0 1px 0 rgba(0,0,0,0.1), 0 2px 0 rgba(0,0,0,0.1), 0 3px 0 rgba(0,0,0,0.1), 0 4px 0 rgba(0,0,0,0.1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.textShadow = mode === 'dark'
                ? '0 5px 15px rgba(255, 255, 255, 0.3)'
                : '0 5px 15px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = '';
              e.currentTarget.style.textShadow = '';
            }}
          >
            Where Flavour Meets Perfection
          </h1>
        </div>
      </section>

      {/* -------------------------- Features Section ----------------------  */}
      <section id="Feature" className="sm:py-4 mt-[-36vh] sm:my-20 mx-8">
        <h1 className={`text-center font-semibold text-4xl ${mode === 'dark' ? 'text-yellow-400' : 'text-red-700'} sm:my-4 font-[Merriweather]`}>
          Features
        </h1>
        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6">
          {/** Feature Card */}
          {[
            {
              imgSrc: Foods,
              title: "Array of Delights",
              description: "Indulge in our diverse array of culinary delights from across the globe...",
            },
            {
              imgSrc: Search,
              title: "Customized Recipe Search",
              description: "Explore the art of personalized recipe discovery with our intuitive search tools...",
            },
            {
              imgSrc: Cooking,
              title: "Create Your Own Masterpiece",
              description: "Unleash your inner chef and craft your culinary masterpieces...",
            }
          ].map(({ imgSrc, title, description }) => (
            <div key={title} className="p-4 text-center rounded-lg shadow-md transition-transform duration-300 hover:scale-105">
              <div className="rounded-lg overflow-hidden">
                <img alt="content" className="object-center w-[30%] h-[30%] m-auto" src={imgSrc} loading="lazy" />
              </div>
              <h2 className={`text-xl title-font ${mode === 'dark' ? 'text-white' : 'text-gray-900'} mt-5 font-semibold`}>
                {title}
              </h2>
              <p className={`text-base leading-relaxed mt-2 text-left ${mode === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* -------------------------- Best Dishes Section ----------------------  */}
      <section id="Trending" className="py-4 my-20 mx-8">
        <h1 className={`text-center font-semibold text-4xl ${mode === 'dark' ? 'text-yellow-400' : 'text-red-700'} my-4 font-[Merriweather]`}>
          World&apos;s Best Dishes
        </h1>
        {loading ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 py-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={`h-[230px] sm:h-[280px] ${mode === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse rounded-sm`} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {best.map((food) => (
              <Cards dish={food} key={food._id} />
            ))}
          </div>
        )}
      </section>

      {/* -------------------------- About Section ----------------------  */}
      <section className={`text-gray-600 body-font overflow-hidden py-4 my-20 mx-8 ${mode === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'}`} id="About">
        <div className="container m-auto">
          <div className="w-[80vw] mx-auto grid md:grid-cols-2 sm:grid-cols-1">
            <div className="w-full lg:pr-10 lg:py-6 mb-6 lg:mb-0 flex flex-col justify-center items-center">
              <h2 className={`text-sm title-font ${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'} tracking-widest`}>
                TastyTrails
              </h2>
              <h1 className={`font-bold text-3xl title-font mb-4 font-[Merriweather] ${mode === 'dark' ? 'text-yellow-400' : 'text-red-700'}`}>
                About Us
              </h1>
              <p className={`leading-relaxed mb-4 ${mode === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                Welcome to TastyTrails, your passport to a world of delectable flavors and culinary adventures...
              </p>
            </div>
            <img alt="ecommerce" className="object-cover object-center rounded sm:w-[90%] mx-auto shadow-md" src={massa} loading="lazy" />
          </div>
        </div>
      </section>
    </div>

  );
};

export default Landing;
