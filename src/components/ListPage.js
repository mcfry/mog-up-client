import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";

import { AuthContext } from "../utils/Auth.js";
import Mog from "./Mog.js";
import Rating from "./Rating.js";

const GET_MOG_QUERY = gql`
  query allMogs($userId: ID) {
    allMogs(userId: $userId) {
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

const ListPage = () => {
  const { currentUser } = useContext(AuthContext);
  const userId = currentUser?.uid;
  const location = useLocation();
  const { loading, data, refetch } = useQuery(GET_MOG_QUERY, {
    variables: {
      userId: userId,
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
        {data &&
          data.allMogs.map((mog) => (
            <div className="pb-8" key={mog.id}>
              <Mog
                mog={mog}
                refresh={() => refetch()}
                showState={modelViewerShowStates}
                updateShowState={updateModelViewerShowStates}
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

export default ListPage;
