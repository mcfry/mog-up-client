import React from "react";
import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <>
      <section className="flex flex-col grow items-center justify-center space-y-4 p-10 drop-shadow">
        <p className="text-9xl bg-gradient-to-tl from-yellow-300 to-red-500 bg-clip-text text-transparent">
          404
        </p>
        <p className="text-2xl font-semibold pb-10">Oops! Page not found!</p>
        <Link
          className="z-20 text-white font-semibold hover:text-rose-400"
          to="/"
        >
          Home
        </Link>
        <Link
          className="z-20 text-white font-semibold hover:text-rose-400"
          to="/allmogs"
        >
          All Mogs
        </Link>
        <Link
          className="z-20 text-white font-semibold hover:text-rose-400"
          to="/create"
        >
          Create
        </Link>
      </section>
    </>
  );
}

export default NotFoundPage;
