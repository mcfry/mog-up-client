import React, { useEffect, useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";

import { AuthContext } from "../utils/Auth.js";
import Rating from "./Rating.js";
import Mog from "./Mog.js";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const GET_USER_MOGS_QUERY = gql`
  query allUserMogs($userId: ID!) {
    allUserMogs(userId: $userId) {
      id
      imageUrl
      mogName
      itemList
      itemOverrides
      race
      gender
      bgColor
      createdAt
      ratingData {
        numberOfRatings
        averageRating
        userRating {
          id
          value
        }
      }
    }
  }
`;

const UserListPage = () => {
  const { currentUser } = useContext(AuthContext);
  const userId = currentUser.uid;
  const location = useLocation();
  const { loading, data, refetch } = useQuery(GET_USER_MOGS_QUERY, {
    variables: {
      userId,
    },
  });

  const [modelViewerShowStates, setModelViewerShowStates] = useState({});

  const updateModelViewerShowStates = (mogId, newState) => {
    setModelViewerShowStates({
      ...modelViewerShowStates,
      [mogId]: newState,
    });
  };

  useEffect(() => {
    refetch();
  }, [location, refetch]);

  if (loading) {
    return <div>Loading</div>;
  }

  return (
    <div className="w-full flex justify-center">
      <div className="w-10/12 sm:w-10/12 md:w-8/12 lg:w-11/12 xl:w-10/12 max-w-full">
        <div className="flex justify-center">
          <Link
            to="/create"
            className="max-w-full text-current p-4 dim text-black no-underline"
          >
            <div className="flex space-x-2 justify-center">
              <button
                type="button"
                data-mdb-ripple="true"
                data-mdb-ripple-color="light"
                className="inline-block px-6 py-2.5 bg-purple-600 text-white font-bold text-xs leading-tight uppercase rounded shadow-md hover:bg-purple-700 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple-800 active:shadow-lg transition duration-150 ease-in-out"
              >
                <FontAwesomeIcon icon={faPlus} />
                &nbsp; Create New Mog
              </button>
            </div>
          </Link>
        </div>
        {data &&
          data.allUserMogs.map((mog) => (
            <div className="pb-8" key={mog.id}>
              <Mog
                mog={mog}
                refresh={() => refetch()}
                showState={modelViewerShowStates}
                updateShowState={updateModelViewerShowStates}
                deletabe={true}
              />
              <Rating
                mogId={mog.id}
                numberOfRatings={mog.ratingData.numberOfRatings}
                averageRating={mog.ratingData.averageRating}
                userRating={mog.ratingData.userRating}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default UserListPage;
