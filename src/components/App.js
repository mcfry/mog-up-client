import React from "react";
import { Outlet } from "react-router-dom";

import NavBar from "./NavBar.js";

const App = () => {
  return (
    <div className="app">
      <NavBar />
      <div className="flex flex-col app-content h-full min-h-screen bg-gradient-to-tr from-yellow-200 via-pink-200 to-red-200 overflow-hidden pb-20 relative">
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

        <div className="flex flex-col relative z-10 h-full grow mt-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default App;
