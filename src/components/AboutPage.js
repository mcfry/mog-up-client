import React from "react";

const AboutPage = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full grow">
      <div className="bg-gradient-to-tl from-yellow-300 to-red-500 bg-clip-text text-transparent text-5xl font-bold p-10 drop-shadow">
        Created with:
      </div>
      <div className="text-white text-center font-semibold w-10/12 sm:w-9/12 md:w-8/12 lg:w-7/12 xl:w-6/12 max-w-full drop-shadow">
        React (CRA), GraphQL, Apollo, Tailwind + DaisyUI, Firebase (users), and
        Amazon S3. Back end uses Apollo Server, Express, and Sequelize ORM (with
        migrations) to communicate with PostgreSQL. Item data pulled from WoW's
        DBC.
      </div>
    </div>
  );
};

export default AboutPage;
