// eslint-disable-next-line no-unused-vars
import React from "react";

const Dashboard = ({user}) => {
  return (
    <div id="userDashboard" className="border-gray-200 border-t-[1px]">
      <div className="grid md:grid-cols-[67%_33%] grid-cols-1">
        <div className=" p-16">
          <h1 className="title-font sm:text-4xl text-2xl mb-4 font-medium text-gray-900 font-[Merriweather]">
            Alfiya Siddique
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
            <div className="container mx-auto flex px-5 py-24 items-center justify-center flex-col">
              <img
                className="lg:w-2/5 md:w-3/6 w-5/6 mb-10 object-cover object-center rounded-[100%]"
                alt="hero"
                src="https://dummyimage.com/720x600"
              />
              <div className="text-center lg:w-2/3 w-full">
                <h1>Alfiya Siddique</h1>
                <p className="mb-8 leading-relaxed">
                  Meggings kinfolk echo park stumptown DIY, kale chips beard
                  jianbing tousled. Chambray dreamcatcher trust fund, kitsch
                  vice godard disrupt ramps
                </p>
                <div className="flex justify-center">
                  <button className="inline-flex text-white bg-red-700 border-0 py-2 px-6 focus:outline-none hover:bg-red-500 rounded text-lg">
                    Log Out
                  </button>
                  <button className="ml-4 inline-flex text-gray-700 bg-gray-100 py-2 px-6 focus:outline-none hover:bg-gray-200 rounded text-lg border border-red-600">
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
