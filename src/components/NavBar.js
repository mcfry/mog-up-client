import React, { useContext, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import fb from "../utils/firebase.js";
import { AuthContext } from "../utils/Auth.js";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHatWizard,
  faUser,
  faUserPlus,
  faList,
} from "@fortawesome/free-solid-svg-icons";

const NavBar = (props) => {
  let navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      await fb.auth().signOut();
      navigate("/");
    } catch (e) {
      console.log(e);
    }
  };

  // useEffect(() => {
  //     console.log('test')
  // })

  return (
    <nav className="flex justify-between bg-gradient-to-r from-pink-500 to-yellow-500 border-b-2">
      <div className="flex items-center">
        <NavLink
          to="allmogs"
          className="text-white hover:text-black no-underline p-3"
        >
          <FontAwesomeIcon icon={faHatWizard} />
          &nbsp; MogUp
        </NavLink>
        {currentUser && (
          <NavLink
            to="mymogs"
            className="text-white hover:text-black no-underline p-3"
          >
            <FontAwesomeIcon icon={faList} />
            &nbsp; My Mogs
          </NavLink>
        )}
      </div>
      <div className="flex p-3 items-center">
        {currentUser ? (
          <Link
            to="#"
            onClick={handleLogout}
            className="text-sm text-white hover:text-black inline-block mr-3"
          >
            <FontAwesomeIcon icon={faUser} />
            &nbsp; Sign Out
          </Link>
        ) : (
          <>
            <Link
              to="login"
              className="text-sm text-white hover:text-black inline-block mr-4"
            >
              <FontAwesomeIcon icon={faUser} />
              &nbsp; Login
            </Link>
            <Link
              to="register"
              className="text-sm text-white hover:text-black inline-block mr-3"
            >
              <FontAwesomeIcon icon={faUserPlus} />
              &nbsp; Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
