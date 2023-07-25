import React, { useState, useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import fb from "../utils/firebase.js";
import { AuthContext } from "../utils/Auth.js";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { currentUser } = useContext(AuthContext);
  if (currentUser) {
    return <Navigate to="/" replace={true} />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await fb.auth().signInWithEmailAndPassword(email, password);
    } catch (e) {
      console.log(e);
    }
  };

  // <main className="p-4 text-black">
  // 	  <form onSubmit={handleSubmit} className="measure center">
  // 	    <fieldset id="sign_up" className="border border-transparent px-0 mx-0">
  // 	      <legend className="text-lg font-semibold px-0 mx-0">Login</legend>
  // 	      <div className="mt-3">
  // 	        <label className="block font-semibold leading-normal text-sm" htmlFor="email-address">Email</label>
  // 	        <input onChange={e => setEmail(e.target.value)} className="p-2 border bg-transparent hover:bg-yellow-50 hover:text-current w-full" type="email" name="email-address" id="email-address"/>
  // 	      </div>
  // 	      <div className="my-3">
  // 	        <label className="block font-semibold leading-normal text-sm" htmlFor="password">Password</label>
  // 	        <input onChange={e => setPassword(e.target.value)} className="p-2 border bg-transparent hover:bg-yellow-50 hover:text-current w-full" type="password" name="password" id="password"/>
  // 	      </div>
  // 	    </fieldset>
  // 	    <div className="">
  // 	      <input className="px-3 py-2 border border-black bg-transparent grow cursor-pointer text-sm inline-block" type="submit" value="Sign in"/>
  // 	    </div>
  // 	    <div className="leading-normal mt-3">
  // 	      <Link to="/register" className="text-sm link dim black block">Sign up</Link>
  // 	    </div>
  // 	  </form>
  // 	</main>

  return (
    <main className="text-black">
      <section className="flex justify-center items-center h-screen bg-gradient-to-tr from-yellow-200 via-pink-200 to-red-200">
        <div className="max-w-md w-full bg-white rounded p-6 space-y-4 relative z-10">
          <div className="mb-4">
            <p className="text-gray-600">Sign In</p>
            <h2 className="text-xl font-bold">Welcome</h2>
          </div>
          <div>
            <input
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 text-sm bg-gray-50 focus:outline-none border border-gray-200 rounded text-gray-600"
              type="text"
              placeholder="Email"
            />
          </div>
          <div>
            <input
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 text-sm bg-gray-50 focus:outline-none border border-gray-200 rounded text-gray-600"
              type="password"
              placeholder="Password"
            />
          </div>
          <div>
            <button
              type="button"
              data-mdb-ripple="true"
              data-mdb-ripple-color="light"
              className="w-full py-4 bg-purple-600 text-white font-medium text-sm font-bold rounded shadow-md hover:bg-purple-700 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple-800 active:shadow-lg transition duration-150 ease-in-out"
              onClick={(e) => handleSubmit(e)}
            >
              Sign In
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex flex-row items-center">
              <div></div>
            </div>
          </div>
        </div>

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
      </section>
    </main>
  );
};

export default LoginPage;
