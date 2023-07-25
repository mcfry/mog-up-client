import React, { useEffect, useState } from "react";
import { gql, useMutation, useLazyQuery } from "@apollo/client";
import _ from "lodash";

import { generateModels } from "wow-model-viewer";

const DELETE_MOG = gql`
  mutation deleteMog($id: ID!) {
    deleteMog(id: $id)
  }
`;

const GET_ITEMS_INFORMATION = gql`
  query getItemsInformation($ids: [ID!]!) {
    getItemsInformation(ids: $ids) {
      id
      name
      itemLevel
      displaySlot
      displayId
      relatedDisplayIds
    }
  }
`;

// <div className="border-2 border-white rounded p-3 m-3">
//     <div
//       className="w-full"
//       style={{
//         backgroundImage: `url(${mog.imageUrl})`,
//         backgroundSize: "cover",
//         paddingBottom: "100%",
//       }}
//     />
//     <div className="pt-3">
//       {mog.mogName}&nbsp;
//       {deletable && (
//         <span
//           className="text-red-600 text-sm cursor-pointer"
//           onClick={handleDelete}
//         >
//           Delete
//         </span>
//       )}
//     </div>
//   </div>

// 186797:188843:188843:186781:168659.0.0.0.0.0.0.0.0.0.3524:6795.0.0.0.0.0.0.0.0.0.3524:178991.0.0.0.0.0.0.0.0.0.3524:178160.0.0.0.0.0.0.0.0.0.3524:178160.0.0.0.0.0.0.0.0.0.3524:190464.0.0.0.0.0.0.0.0.0.3524:186798:186793:27673.0.0.0.0.0.0.0.0.0.3524:186778

const Mog = ({ mog, refresh, deletable, showState, updateShowState }) => {
  const [width, setWidth] = useState(window.innerWidth);
  const [lastWidthRange, setLastWidthRange] = useState(width < 1024); // true < 1024, false if >
  const [wowModelViewer, setWowModelViewer] = useState(null);
  const [isModelViewerSetOrLoading, setIsModelViewerSetOrLoading] =
    useState(false);
  const [getItems, { loading: itemLoading, error, data: itemData }] =
    useLazyQuery(GET_ITEMS_INFORMATION);

  const [deleteMog] = useMutation(DELETE_MOG, {
    variables: {
      id: mog.id,
    },
  });

  const handleDelete = () => {
    deleteMog().then(() => {
      refresh();
    });
  };

  const handleChecked = () => {
    updateShowState(mog.id, mog.id in showState ? !showState[mog.id] : true);

    if (mog.id in showState ? !showState[mog.id] : true) {
      createModelViewer();
    } else {
      if (wowModelViewer) {
        destroyModelViewer();
      }
    }
  };

  useEffect(() => {
    getItems({
      variables: {
        ids: mog.itemList,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mog]);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [width]);

  const destroyModelViewer = () => {
    wowModelViewer.destroy();
    setWowModelViewer(null);
    setIsModelViewerSetOrLoading(false);
  };

  // useEffect(() => {
  //   if (
  //     mog.id in showState &&
  //     showState[mog.id] === true &&
  //     width < 1024 &&
  //     wowModelViewer
  //   ) {
  //     destroyModelViewer();
  //     setIsModelViewerSetOrLoading(false);
  //   } else if (
  //     width >= 1024 &&
  //     mog.id in showState &&
  //     showState[mog.id] === true &&
  //     !isModelViewerSetOrLoading
  //   ) {
  //     createModelViewer();
  //   }
  // }, [width]);

  useEffect(() => {
    if (
      mog.id in showState &&
      showState[mog.id] === true &&
      width < 1024 &&
      wowModelViewer &&
      lastWidthRange === false
    ) {
      // recreate
      destroyModelViewer();
      createModelViewer();
    } else if (
      width >= 1024 &&
      mog.id in showState &&
      showState[mog.id] === true &&
      wowModelViewer &&
      lastWidthRange === true
    ) {
      // recreate
      destroyModelViewer();
      createModelViewer();
    }

    setLastWidthRange(width < 1024);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width]);

  // Can't be called unless mog.race, mog.gender are non null (ensured by checkbox)
  const createModelViewer = async () => {
    if (wowModelViewer) {
      destroyModelViewer();
    }

    setIsModelViewerSetOrLoading(true);

    const defaultCharacter = {
      race: parseInt(mog.race),
      gender: parseInt(mog.gender),
      skin: 4,
      face: 0,
      hairStyle: 5,
      hairColor: 5,
      facialStyle: 5,
      items: [],
    };

    let modelViewerSlotConversionTable = {
      0: 1, //head
      1: 3, //shoulders
      9: 16, //cape
      3: 5, //chest
      2: 4, //shirt
      10: 19, //tabard
      7: 9, //wrist
      8: 10, //hands
      4: 6, //waist
      5: 7, //legs
      6: 8, //feet
      11: 17, //mainhand (13?)
      15: 23, //offhand
    };

    let itemsDisplayArray = itemData.getItemsInformation.flatMap((item) => {
      const normallizedSlot = modelViewerSlotConversionTable[item.displaySlot];

      return item.displayId !== 0
        ? [
            [
              normallizedSlot,
              item.displaySlot in mog.itemOverrides
                ? mog.itemOverrides[item.displaySlot]
                : item.displayId,
            ],
          ]
        : [];
    });

    // Update Items on Default Characater
    defaultCharacter.items = itemsDisplayArray;

    let modelViewer = await generateModels(
      1,
      "#3dModel_" + mog.id,
      defaultCharacter
    );
    modelViewer.setZoom(-3);
    setWowModelViewer(modelViewer);
  };

  let itemsNormalized = {};
  if (itemData) {
    for (let item of itemData.getItemsInformation) {
      itemsNormalized[item.displaySlot] = { ...item };

      if (item.displaySlot in mog.itemOverrides) {
        itemsNormalized[item.displaySlot].displayId =
          mog.itemOverrides[item.displaySlot];
      }
    }
  }

  if (itemLoading) {
    return <div>Loading</div>;
  }

  //console.log(itemsNormalized);

  return (
    <div className="flex justify-center p-3 mt-5">
      <div className="flex flex-col md:flex-row w-full md:max-w-4xl rounded-lg bg-white shadow-lg lg:border-r-2">
        {mog.imageUrl && (
          <>
            <div className="relative lg:w-1/2">
              <h5 className="lg:hidden absolute pl-4 pt-4 text-white text-xl font-medium mb-2 capitalize">
                {mog.mogName}
              </h5>
              <img
                className="lg:block w-full h-full md:min-h-96 object-cover rounded-lg lg:rounded-none lg:rounded-l-lg"
                src={mog.imageUrl}
                alt="transmog"
              />
            </div>
          </>
        )}
        {!_.isEmpty(itemsNormalized) && (
          <div
            className={
              (!wowModelViewer && !isModelViewerSetOrLoading
                ? "hidden lg:block "
                : "block ") +
              "w-full lg:w-1/2 h-full " +
              (wowModelViewer || isModelViewerSetOrLoading ? "lg:pt-32 " : "") +
              mog.bgColor
            }
          >
            <div className="lg:hidden flex justify-center items-center w-full h-12">
              <h5 className="text-gray-900 text-xl font-medium mb-2 capitalize">
                {mog.mogName}
              </h5>
            </div>
            <div
              id={"3dModel_" + mog.id}
              className={
                "sm:pr-32 md:pr-0 " +
                (!wowModelViewer && !isModelViewerSetOrLoading
                  ? "hidden "
                  : "") +
                mog.bgColor
              }
            ></div>
            {(mog.race || mog.race === 0) &&
              (mog.gender || mog.gender === 0) &&
              mog.bgColor && (
                <div className="lg:hidden flex justify-center items-center pb-10">
                  <label
                    htmlFor="showModelWhenMinimized"
                    className={
                      "ml-1 text-sm font-medium " +
                      (mog.bgColor === "bg-black" ? "text-white" : "text-black")
                    }
                  >
                    Show Model?
                  </label>
                  <input
                    id="showModelWhenMinimized"
                    type="checkbox"
                    checked={mog.id in showState ? showState[mog.id] : false}
                    onChange={handleChecked}
                    className="w-4 h-4 rounded accent-purple-500 ml-2 mt-0.5"
                  />
                </div>
              )}
            {!wowModelViewer && !isModelViewerSetOrLoading && (
              <div className="h-full flex justify-center items-center border-r-2">
                <div
                  className={
                    "italic " +
                    (mog.bgColor === "bg-white" ? "text-black" : "text-white")
                  }
                >
                  Model Hidden
                </div>
              </div>
            )}
          </div>
        )}

        <div
          className={
            (wowModelViewer || isModelViewerSetOrLoading || mog.imageUrl
              ? "hidden lg:flex "
              : "block ") + "w-full lg:w-1/2 p-6 flex flex-col justify-start"
          }
        >
          <div className="flex justify-center items-center">
            <h5 className="text-gray-900 text-xl font-medium mb-2 capitalize">
              {mog.mogName}
            </h5>
          </div>
          {_.isEmpty(itemsNormalized) ? (
            <div className="h-full flex justify-center items-center min-h-[576px]">
              <div>User has chosen not to provide an item list</div>
            </div>
          ) : (
            <div className="flex justify-between pt-4 pb-0 mb-0">
              <div className="px-2">
                <div className="text-gray-700 text-base mb-4">
                  Head:
                  <div className="block">
                    <div className="text-xs pl-3 pt-1 h-10 bg-gray-50">
                      {itemsNormalized[0] ? itemsNormalized[0].name : "Hidden"}
                    </div>
                  </div>
                </div>
                <div className="text-gray-700 text-base mb-4">
                  Shoulders:
                  <div className="block">
                    <div className="text-xs pl-3 pt-1 h-10 bg-gray-50">
                      {itemsNormalized[1] ? itemsNormalized[1].name : "Hidden"}
                    </div>
                  </div>
                </div>
                <div className="text-gray-700 text-base mb-4">
                  Cape:
                  <div className="block">
                    <div className="text-xs pl-3 pt-1 h-10 bg-gray-50">
                      {itemsNormalized[9] ? itemsNormalized[9].name : "Hidden"}
                    </div>
                  </div>
                </div>
                <div className="text-gray-700 text-base mb-4">
                  Chest:
                  <div className="block">
                    <div className="text-xs pl-3 pt-1 h-10 bg-gray-50">
                      {itemsNormalized[3] ? itemsNormalized[3].name : "Hidden"}
                    </div>
                  </div>
                </div>
                <div className="text-gray-700 text-base mb-4">
                  Shirt:
                  <div className="block">
                    <div className="text-xs pl-3 pt-1 h-10 bg-gray-50">
                      {itemsNormalized[2] ? itemsNormalized[2].name : "Hidden"}
                    </div>
                  </div>
                </div>
                <div className="text-gray-700 text-base mb-4">
                  Tabard:
                  <div className="block">
                    <div className="text-xs pl-3 pt-1 h-10 bg-gray-50">
                      {itemsNormalized[10]
                        ? itemsNormalized[10].name
                        : "Hidden"}
                    </div>
                  </div>
                </div>
                <div className="text-gray-700 text-base mb-4">
                  Wrist:
                  <div className="block">
                    <div className="text-xs pl-3 pt-1 h-10 bg-gray-50">
                      {itemsNormalized[7] ? itemsNormalized[7].name : "Hidden"}
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-2">
                <div className="text-gray-700 text-base mb-4">
                  Hands:
                  <div className="block">
                    <div className="text-xs pl-3 pt-1 h-10 bg-gray-50">
                      {itemsNormalized[8] ? itemsNormalized[8].name : "Hidden"}
                    </div>
                  </div>
                </div>
                <div className="text-gray-700 text-base mb-4">
                  Waist:
                  <div className="block">
                    <div className="text-xs pl-3 pt-1 h-10 bg-gray-50">
                      {itemsNormalized[4] ? itemsNormalized[4].name : "Hidden"}
                    </div>
                  </div>
                </div>
                <div className="text-gray-700 text-base mb-4">
                  Legs:
                  <div className="block">
                    <div className="text-xs pl-3 pt-1 h-10 bg-gray-50">
                      {itemsNormalized[5] ? itemsNormalized[5].name : "Hidden"}
                    </div>
                  </div>
                </div>
                <div className="text-gray-700 text-base mb-4">
                  Feet:
                  <div className="block">
                    <div className="text-xs pl-3 pt-1 h-10 bg-gray-50">
                      {itemsNormalized[6] ? itemsNormalized[6].name : "Hidden"}
                    </div>
                  </div>
                </div>
                <div className="text-gray-700 text-base mb-4">
                  Mainhand:
                  <div className="block">
                    <div className="text-xs pl-3 pt-1 h-10 bg-gray-50">
                      {itemsNormalized[11]
                        ? itemsNormalized[11].name
                        : "Hidden"}
                    </div>
                  </div>
                </div>
                <div className="text-gray-700 text-base mb-4">
                  Offhand:
                  <div className="block">
                    <div className="text-xs pl-3 pt-1 h-10 bg-gray-50">
                      {itemsNormalized[15]
                        ? itemsNormalized[15].name
                        : "Hidden"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {(mog.race || mog.race === 0) &&
            (mog.gender || mog.gender === 0) &&
            mog.bgColor && (
              <div className="flex justify-center items-center">
                <label
                  htmlFor="showModel"
                  className="ml-1 text-sm font-medium text-black"
                >
                  Show Model?
                </label>
                <input
                  id="showModel"
                  type="checkbox"
                  checked={mog.id in showState ? showState[mog.id] : false}
                  onChange={handleChecked}
                  className="w-4 h-4 rounded accent-purple-500 ml-2 mt-0.5"
                />
              </div>
            )}

          <div className="flex justify-center items-center">
            <p className="text-gray-600 text-xs">
              Created:{" "}
              {mog.createdAt &&
                new Date(mog.createdAt.replace(" ", "T")).toString()}
            </p>
          </div>
          {deletable && (
            <span
              className="text-red-600 text-sm cursor-pointer mt-3"
              onClick={handleDelete}
            >
              Delete
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Mog;
