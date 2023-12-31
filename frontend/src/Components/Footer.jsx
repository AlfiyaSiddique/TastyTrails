// eslint-disable-next-line no-unused-vars
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagramSquare,
  faLinkedinIn,
  faGithubSquare,
} from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div>
      <footer className="text-gray-600 body-font">
        <div className="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">
          <span className="flex title-font font-medium items-center md:justify-start justify-center text-red-700">
            <span className="ml-3 text-xl font-[Mrriweather]">TastyTrails</span>
          </span>
          <p className="text-sm text-gray-500 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4 sm:text-center">
            © {new Date().getFullYear()} TastyTrails Developer —
            <Link
              to="https://twitter.com/A_l_f_i_y_a"
              className="text-gray-600 ml-1 sm:text-center"
              rel="noopener noreferrer"
              target="_blank"
            >
              @A_l_f_i_y_A
            </Link>
          </p>
          <span className="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
            <Link
              to={"https://www.instagram.com/alfiya.17.siddiq/"}
              className="text-ref-500 text-red-700"
            >
              <FontAwesomeIcon icon={faInstagramSquare} />
            </Link>
            <Link
              to={"https://www.linkedin.com/in/alfiya-siddique-987a59240/"}
              className="ml-3 text-red-700"
            >
              <FontAwesomeIcon icon={faLinkedinIn} className="" />
            </Link>
            <Link
              to={"https://github.com/AlfiyaSiddique"}
              className="ml-3 text-red-700"
            >
              <FontAwesomeIcon icon={faGithubSquare} />
            </Link>
          </span>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
