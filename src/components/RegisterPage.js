import React, { useState, useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import fb from "../utils/firebase.js";
import { AuthContext } from "../utils/Auth.js";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const { currentUser } = useContext(AuthContext);
  if (currentUser) {
    return <Navigate to="/" replace={true} />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password === password2) {
      try {
        let newUser = await fb
          .auth()
          .createUserWithEmailAndPassword(email, password);
        console.log(newUser);
        // create user info in postgres
      } catch (e) {
        alert(e);
      }
    } else {
      alert("Passwords don't match");
    }
  };

  return (
    <main className="text-black">
      <section className="flex justify-center items-center h-screen bg-gradient-to-tr from-yellow-200 via-pink-200 to-red-200">
        <div className="max-w-md w-full bg-white rounded p-6 space-y-4 relative z-10">
          <div className="mb-4">
            <p className="text-gray-600">Register</p>
            <h2 className="text-xl font-bold">Join our community</h2>
          </div>
          <div>
            <input
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-4 text-sm bg-gray-50 focus:outline-none border border-gray-200 rounded text-gray-600"
              type="text"
              placeholder="Username"
            />
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
            <input
              onChange={(e) => setPassword2(e.target.value)}
              className="w-full p-4 text-sm bg-gray-50 focus:outline-none border border-gray-200 rounded text-gray-600"
              type="password"
              placeholder="Password Confirmation"
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
              Register
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex flex-row items-center">
              <div className="leading-normal">
                <Link to="/Login" className="text-sm link dim black block">
                  Already have an account? Login here
                </Link>
              </div>
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

export default RegisterPage;
