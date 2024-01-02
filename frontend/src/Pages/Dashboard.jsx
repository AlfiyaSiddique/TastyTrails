// eslint-disable-next-line no-unused-vars
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Dashboard = () => {

  const user = useLocation().state.user
  const navigator = useNavigate();
  const logout = ()=>{
    localStorage.removeItem("tastytoken");
    navigator("/")
  }
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
            <span className="mr-5 hover:text-gray-900 cursor-pointer">
              Liked Recipe
            </span>
          </nav>
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
                <h1>{user.firstName} {user.lastName}</h1>
                <h1 className="text-black">Followers: {user.followers.length} Following: {user.following.length}</h1>
                {/* <p className="mb-8 leading-relaxed">
                  Meggings kinfolk echo park stumptown DIY, kale chips beard
                  jianbing tousled. Chambray dreamcatcher trust fund, kitsch
                  vice godard disrupt ramps
                </p> */}
                <div className="flex justify-center">
                  <button className="inline-flex text-white bg-red-700 border-0 py-2 px-3 focus:outline-none hover:bg-red-500 rounded text-md m-2" onClick={logout}>
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
