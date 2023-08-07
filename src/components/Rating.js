import React, { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import {
  faStar as faStarEmpty,
  faStarHalfStroke,
} from "@fortawesome/free-regular-svg-icons";
import { gql, useMutation } from "@apollo/client";

import { AuthContext } from "../utils/Auth.js";

const ADD_RATING = gql`
  mutation addRating($userId: ID!, $mogId: ID!, $rating: Int!) {
    createRating(userId: $userId, mogId: $mogId, rating: $rating) {
      value
    }
  }
`;

const Rating = ({
  mogId,
  averageRating = null,
  numberOfRatings = 0,
  userRating = null,
}) => {
  const { currentUser } = useContext(AuthContext);
  const userId = currentUser?.uid;

  const [createRatingInDb, { loading }] = useMutation(ADD_RATING);

  const [managedAvgRating, setManagedAvgRating] = useState(averageRating);
  const [managedNumOfRatings, setManagedNumOfRatings] =
    useState(numberOfRatings);
  const [showMyRating, setShowMyRating] = useState(false);
  const [selectedStarLevel, setSelectedStarLevel] = useState(
    userRating ? userRating.value : 0
  );
  const [ratingLocked, setRatingLocked] = useState(userRating !== null);

  // TODO: Let user change their user rating
  const createRating = (value) => {
    console.log(value);
    if (userId && ratingLocked === false) {
      createRatingInDb({
        variables: {
          userId,
          mogId,
          rating: value,
        },
      }).then(() => {
        setManagedNumOfRatings(managedNumOfRatings + 1);
        let weightedValue =
          (value - managedAvgRating) / ((managedNumOfRatings + 1) * 1.0);
        setManagedAvgRating(managedAvgRating + weightedValue);
        setRatingLocked(true);
        setSelectedStarLevel(value);
      });
    } else {
      console.log("User not logged in or mog already has user rating.");
    }
  };

  const createExistingStars = (value) => {
    const fullStars = parseInt(value);
    const isHalfStar = value - fullStars >= 0.5 ? 1 : 0;

    const stars = [];
    let keyId = 0;
    for (let i = 0; i < fullStars; i++) {
      keyId += 1;
      stars.push(<FontAwesomeIcon key={keyId} icon={faStar} />);
    }

    if (isHalfStar === 1) {
      keyId += 1;
      stars.push(<FontAwesomeIcon key={keyId} icon={faStarHalfStroke} />);
    }

    for (let i = 0; i < 5 - fullStars - isHalfStar; i++) {
      keyId += 1;
      stars.push(<FontAwesomeIcon key={keyId} icon={faStarEmpty} />);
    }

    return stars;
  };

  const userStar1Value = selectedStarLevel > 0 ? faStar : faStarEmpty;
  const userStar2Value = selectedStarLevel > 1 ? faStar : faStarEmpty;
  const userStar3Value = selectedStarLevel > 2 ? faStar : faStarEmpty;
  const userStar4Value = selectedStarLevel > 3 ? faStar : faStarEmpty;
  const userStar5Value = selectedStarLevel > 4 ? faStar : faStarEmpty;

  if (loading) {
    return <div className="flex justify-center">Loading</div>;
  }

  const starActiveCss = "text-white cursor-pointer";

  return (
    <div
      className="flex justify-center px-24 py-1"
      onMouseLeave={() => setShowMyRating(false)}
      onMouseEnter={() => setShowMyRating(true)}
    >
      {showMyRating && (
        <div className="flex justify-between font-bold drop-shadow">
          <FontAwesomeIcon
            icon={userStar1Value}
            className={starActiveCss}
            onMouseEnter={() =>
              setSelectedStarLevel(
                ratingLocked === false ? 1 : selectedStarLevel
              )
            }
            onClick={() => createRating(1)}
          />
          <FontAwesomeIcon
            icon={userStar2Value}
            className={starActiveCss}
            onMouseEnter={() =>
              setSelectedStarLevel(
                ratingLocked === false ? 2 : selectedStarLevel
              )
            }
            onClick={() => createRating(2)}
          />
          <FontAwesomeIcon
            icon={userStar3Value}
            className={starActiveCss}
            onMouseEnter={() =>
              setSelectedStarLevel(
                ratingLocked === false ? 3 : selectedStarLevel
              )
            }
            onClick={() => createRating(3)}
          />
          <FontAwesomeIcon
            icon={userStar4Value}
            className={starActiveCss}
            onMouseEnter={() =>
              setSelectedStarLevel(
                ratingLocked === false ? 4 : selectedStarLevel
              )
            }
            onClick={() => createRating(4)}
          />
          <FontAwesomeIcon
            icon={userStar5Value}
            className={starActiveCss}
            onMouseEnter={() =>
              setSelectedStarLevel(
                ratingLocked === false ? 5 : selectedStarLevel
              )
            }
            onClick={() => createRating(5)}
          />
          <div className="leading-none font-bold px-1 text-white">
            {selectedStarLevel}
          </div>
        </div>
      )}

      {!showMyRating && (
        <div className="flex justify-between text-gray-900 drop-shadow">
          {createExistingStars(managedAvgRating)}
          <div className="leading-none font-bold px-1">
            {managedAvgRating ? managedAvgRating.toFixed(1) : "No Ratings"} (
            {managedNumOfRatings})
          </div>
        </div>
      )}
    </div>
  );
};

export default Rating;
