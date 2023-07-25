import React from "react";
import { Outlet } from "react-router-dom";

import NavBar from "./NavBar.js";

const App = () => {
  return (
    <div className="app">
      <NavBar />
      <div className="app-content h-full min-h-screen bg-gradient-to-tr from-yellow-200 via-pink-200 to-red-200 overflow-hidden pt-10 pb-20 relative">
        <ul className="circles">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>

        <div className="relative z-10 h-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default App;
