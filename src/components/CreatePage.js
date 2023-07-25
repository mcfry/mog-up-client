import React, { useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { useAlert } from "@blaumaus/react-alert";

import { AuthContext } from "../utils/Auth.js";

import { generateModels } from "wow-model-viewer";

const ADD_MOG = gql`
  mutation addMog(
    $userId: ID!
    $mogName: String!
    $imageUrl: String
    $itemList: [Int!]
    $itemOverrides: JSON
    $race: Int
    $gender: Int
    $bgColor: String
  ) {
    createMog(
      userId: $userId
      mogName: $mogName
      imageUrl: $imageUrl
      itemList: $itemList
      itemOverrides: $itemOverrides
      race: $race
      gender: $gender
      bgColor: $bgColor
    ) {
      id
      userId
      mogName
      imageUrl
      itemList
      itemOverrides
      race
      gender
      bgColor
    }
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

const usePrevious = (value) => {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const ItemSelect = ({
  item,
  slot,
  overrides = {},
  updateOverrides = null,
  manualDisable,
}) => {
  const handleSelect = (e) => {
    if (updateOverrides !== null) {
      updateOverrides({ ...overrides, [slot]: parseInt(e.target.value) });
    }
  };

  return (
    <>
      {item && item.relatedDisplayIds && item.relatedDisplayIds.length > 0 ? (
        <select
          value={item.displayId}
          className="select select-bordered select-sm rounded-none font-normal text-xs w-full"
          disabled={item.relatedDisplayIds.length === 1 || manualDisable}
          onChange={handleSelect}
        >
          {item.relatedDisplayIds.map((id, index) => (
            <option value={id} key={id}>
              {item.name} {index > 0 ? `- ${index + 1}` : ""}
            </option>
          ))}
        </select>
      ) : (
        <div className="text-xs pl-3 pt-2">Hidden</div>
      )}
    </>
  );
};

const CreatePage = () => {
  let navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const userId = currentUser.uid;

  const [mogName, setMogName] = useState("");
  const [modelViewerBgColor, setModelViewerBgColor] = useState("bg-black");
  const [race, setRace] = useState(1);
  const [gender, setGender] = useState(0);
  const [importValue, setImportValue] = useState("");
  const [itemChecked, setItemChecked] = useState(false);
  const [modelAccurate, setModelAccurate] = useState(true);
  const [imageData, setImageData] = useState("");
  const [wowModelViewer, setWowModelViewer] = useState("");
  const [itemOverrides, setItemOverrides] = useState({});

  const alert = useAlert();

  const itemCheckedPrev = usePrevious(itemChecked);
  const modelAccuratePrev = usePrevious(modelAccurate);

  const [addMog, { loading: mogLoading }] = useMutation(ADD_MOG);
  const [getItems, { loading: itemLoading, error, data: itemData }] =
    useLazyQuery(GET_ITEMS_INFORMATION);

  const modelViewerSlotConversionTable = {
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

  const handleChecked = (e) => {
    if (e.target.id === "itemChecked") {
      setItemChecked(!itemChecked);
    } else if (e.target.id === "modelAccurate") {
      setModelAccurate(!modelAccurate);
    } else {
      setModelViewerBgColor(
        modelViewerBgColor === "bg-white" ? "bg-black" : "bg-white"
      );
    }
  };

  const handleSelect = (e) => {
    switch (e.target.id) {
      case "race":
        setRace(e.target.value);
        break;
      case "gender":
        setGender(e.target.value);
        break;
      default:
        console.log("Incorrect ID for select");
        break;
    }
  };

  // 186797:188843:188843:186781:168659.0.0.0.0.0.0.0.0.0.3524:6795.0.0.0.0.0.0.0.0.0.3524:178991.0.0.0.0.0.0.0.0.0.3524:178160.0.0.0.0.0.0.0.0.0.3524:144355.0.0.0.0.0.0.0.0.0.3524:190464.0.0.0.0.0.0.0.0.0.3524:186798:186793:27673.0.0.0.0.0.0.0.0.0.3524:186778

  // older set compare?items=134110.0.0.0.0.0.0.0.0.0.3524:47777.0.0.0.0.0.0.0.0.0.3524:47777.0.0.0.0.0.0.0.0.0.3524:144399.0.0.0.0.0.0.0.0.0.3524:158301.0.0.0.0.0.0.0.0.0.3524:4334.0.0.0.0.0.0.0.0.0.3524:15199.0.0.0.0.0.0.0.0.0.3524:90086.0.0.0.0.0.0.0.0.0.3524:47773.0.0.0.0.0.0.0.0.0.3524:172530:175868.0.0.0.0.0.0.0.0.0.3524:90315.0.0.0.0.0.0.0.0.0.3524:113934.0.0.0.0.0.0.0.0.0.3524:125221.0.0.0.0.0.0.0.0.0.3524

  // compare?items=90082.0.0.0.0.0.0.0.0.0.3524:90085.0.0.0.0.0.0.0.0.0.3524:90085.0.0.0.0.0.0.0.0.0.3524:184837.0.0.0.0.0.0.0.0.0.3524:168659.0.0.0.0.0.0.0.0.0.3524:3427.0.0.0.0.0.0.0.0.0.3524:140577.0.0.0.0.0.0.0.0.0.3524:168665.0.0.0.0.0.0.0.0.0.3524:151941.0.0.0.0.0.0.0.0.0.3524:90079.0.0.0.0.0.0.0.0.0.3524:184836.0.0.0.0.0.0.0.0.0.3524:184832.0.0.0.0.0.0.0.0.0.3524:128862

  // add edit/done button to input
  const convertImportValue = (rawImport) => {
    console.log(rawImport);

    if (typeof rawImport === "string") {
      if (rawImport.slice(0, 14) === "compare?items=") {
        rawImport = rawImport.slice(14, rawImport.length);
      }

      let converted = [];
      const sections = rawImport.split(":");
      for (let section of sections) {
        if (section.split(".")[0] !== converted[converted.length - 1])
          converted.push(section.split(".")[0]);
      }

      getItems({
        variables: {
          ids: converted,
        },
      });

      return converted;
      // Already converted
    } else {
      return rawImport;
    }
  };

  const handleMog = async () => {
    if (
      mogName &&
      mogName.length < 30 &&
      (imageData || (importValue && modelAccurate))
    ) {
      let imageUrl = null;
      if (imageData) {
        // Test image data for inappropriate content
        // const model = await nsfwjs.load();
        // const predictions = await model.classify(imageData);
        // console.log("Predictions: ", predictions);

        const { url } = await fetch("http://localhost:4000/s3Url")
          .then((res) => res.json())
          .catch((error) => console.log(error));

        await fetch(url, {
          method: "PUT",
          headers: {
            "content-type": "multipart/form-data",
          },
          body: imageData,
        });

        imageUrl = url.split("?")[0];
      }

      let mogVariables = {
        userId,
        mogName,
        imageUrl,
        itemList: itemChecked
          ? []
          : convertImportValue(importValue).map((x) => parseInt(x)),
        itemOverrides: itemChecked ? null : itemOverrides,
        race: itemChecked ? null : race,
        gender: itemChecked ? null : gender,
        bgColor: itemChecked ? null : modelViewerBgColor,
      };

      console.log(mogVariables);

      // catch error and delete object
      addMog({
        variables: {
          userId,
          mogName,
          imageUrl,
          itemList: itemChecked
            ? []
            : convertImportValue(importValue).map((x) => parseInt(x)),
          itemOverrides: itemChecked ? null : itemOverrides,
          race: itemChecked ? null : race,
          gender: itemChecked ? null : gender,
          bgColor: itemChecked ? null : modelViewerBgColor,
        },
      }).then(() => navigate("/"));
    } else {
      if (!mogName) {
        alert.show("You must provide a name.");
      } else if (mogName && mogName.length >= 30) {
        alert.show("Name must be less than 30 characters");
      }

      if (!imageData || !(importValue && modelAccurate)) {
        alert.show(
          "You must provide an image or import items from the BetterWardrobe addon"
        );
      }
    }
  };

  const createModelViewer = async (raceInt = 1, genderInt = 0) => {
    if (wowModelViewer) {
      wowModelViewer.destroy();
    }

    //console.log(raceInt, genderInt);

    const defaultCharacter = {
      race: parseInt(raceInt),
      gender: parseInt(genderInt),
      skin: 4,
      face: 0,
      hairStyle: 5,
      hairColor: 5,
      facialStyle: 5,
      items: [],
    };

    if (itemData) {
      let itemsDisplayArray = itemData.getItemsInformation.flatMap((item) => {
        const normallizedSlot =
          modelViewerSlotConversionTable[item.displaySlot];

        return item.displayId !== 0
          ? [
              [
                normallizedSlot,
                item.displaySlot in itemOverrides
                  ? itemOverrides[item.displaySlot]
                  : item.displayId,
              ],
            ]
          : [];
      });

      console.log(itemData);
      console.log(itemsDisplayArray);
      console.log(itemOverrides);

      // Update Items on Default Characater
      defaultCharacter.items = itemsDisplayArray;
    }

    let modelViewer = await generateModels(1, "#3dModel", defaultCharacter);
    modelViewer.setZoom(-3);
    setWowModelViewer(modelViewer);
  };

  useEffect(() => {
    // Don't generate the model if it's being hidden
    if (itemCheckedPrev !== itemChecked && itemCheckedPrev === true) {
      createModelViewer(race, gender);
    }

    // Don't generate the model if it's being hidden
    if (modelAccuratePrev !== modelAccurate && modelAccuratePrev === false) {
      createModelViewer(race, gender);
    }

    // If it's not one of these values that have changed, then update as normal
    if (
      modelAccuratePrev === modelAccurate &&
      itemCheckedPrev === itemChecked
    ) {
      createModelViewer(race, gender);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemData, race, gender, itemChecked, modelAccurate, itemOverrides]);

  let itemsNormalized = {};
  if (itemData) {
    for (let item of itemData.getItemsInformation) {
      itemsNormalized[item.displaySlot] = { ...item };

      if (item.displaySlot in itemOverrides) {
        itemsNormalized[item.displaySlot].displayId =
          itemOverrides[item.displaySlot];
      }
    }
  }

  if (mogLoading || itemLoading) {
    return <div>Loading</div>;
  }

  // {itemData && itemData.getItemsInformation.length < 13 && (
  //   <div className="flex justify-center pt-4 pb-0 mb-0">
  //     <div className="px-2 font-bold">
  //       One or more of the IDs are invalid
  //     </div>
  //   </div>
  // )}

  return (
    <div className="w-full p-4 flex justify-center">
      <div className="max-w-lg w-full bg-white rounded p-6 space-y-4 relative z-10">
        <div className="mb-4">
          <p>Enter your transmog information</p>
          <h2 className="text-xl font-bold">Create Mog</h2>
        </div>
        <div>
          <input
            type="text"
            onChange={(e) => setMogName(e.target.value)}
            className="w-full p-4 text-sm bg-gray-50 focus:outline-none border border-gray-200 rounded text-gray-600"
            placeholder="Name of transmog"
          />
        </div>
        <div>
          <input
            disabled={itemChecked}
            type="text"
            onChange={(e) => setImportValue(convertImportValue(e.target.value))}
            value={itemChecked ? "No item list" : importValue}
            className={
              "w-full p-4 text-sm bg-gray-50 focus:outline-none border border-gray-200 rounded text-gray-600" +
              (itemChecked ? " font-bold" : "")
            }
            placeholder="Paste betterwardrobe export"
          />

          {error && !itemChecked && (
            <div className="flex justify-center pt-4 pb-0 mb-0">
              <div className="px-2 font-bold">Invalid Input</div>
            </div>
          )}
          {itemData && !itemChecked && !error && (
            <>
              <div className="flex justify-between pt-4 pb-0 mb-0">
                <div className="px-2">
                  <div className="text-gray-700 text-base mb-4">
                    Head:
                    <div className="block">
                      <ItemSelect
                        item={itemsNormalized[0]}
                        slot={0}
                        overrides={itemOverrides}
                        updateOverrides={setItemOverrides}
                      />
                    </div>
                  </div>
                  <div className="text-gray-700 text-base mb-4">
                    Shoulders:
                    <div className="block">
                      <ItemSelect
                        item={itemsNormalized[1]}
                        slot={1}
                        overrides={itemOverrides}
                        updateOverrides={setItemOverrides}
                      />
                    </div>
                  </div>
                  <div className="text-gray-700 text-base mb-4">
                    Cape:
                    <div className="block">
                      <ItemSelect
                        item={itemsNormalized[9]}
                        slot={9}
                        overrides={itemOverrides}
                        updateOverrides={setItemOverrides}
                      />
                    </div>
                  </div>
                  <div className="text-gray-700 text-base mb-4">
                    Chest:
                    <div className="block">
                      <ItemSelect
                        item={itemsNormalized[3]}
                        slot={3}
                        overrides={itemOverrides}
                        updateOverrides={setItemOverrides}
                      />
                    </div>
                  </div>
                  <div className="text-gray-700 text-base mb-4">
                    Shirt:
                    <div className="block">
                      <ItemSelect
                        item={itemsNormalized[2]}
                        slot={2}
                        overrides={itemOverrides}
                        updateOverrides={setItemOverrides}
                      />
                    </div>
                  </div>
                  <div className="text-gray-700 text-base mb-4">
                    Tabard:
                    <div className="block">
                      <ItemSelect
                        item={itemsNormalized[10]}
                        slot={10}
                        overrides={itemOverrides}
                        updateOverrides={setItemOverrides}
                      />
                    </div>
                  </div>
                  <div className="text-gray-700 text-base mb-4">
                    Wrist:
                    <div className="block">
                      <ItemSelect
                        item={itemsNormalized[7]}
                        slot={7}
                        overrides={itemOverrides}
                        updateOverrides={setItemOverrides}
                      />
                    </div>
                  </div>
                </div>
                <div className="px-2">
                  <div className="text-gray-700 text-base mb-4">
                    Hands:
                    <div className="block">
                      <ItemSelect
                        item={itemsNormalized[8]}
                        slot={8}
                        overrides={itemOverrides}
                        updateOverrides={setItemOverrides}
                      />
                    </div>
                  </div>
                  <div className="text-gray-700 text-base mb-4">
                    Waist:
                    <div className="block">
                      <ItemSelect
                        item={itemsNormalized[4]}
                        slot={4}
                        overrides={itemOverrides}
                        updateOverrides={setItemOverrides}
                      />
                    </div>
                  </div>
                  <div className="text-gray-700 text-base mb-4">
                    Legs:
                    <div className="block">
                      <ItemSelect
                        item={itemsNormalized[5]}
                        slot={5}
                        overrides={itemOverrides}
                        updateOverrides={setItemOverrides}
                      />
                    </div>
                  </div>
                  <div className="text-gray-700 text-base mb-4">
                    Feet:
                    <div className="block">
                      <ItemSelect
                        item={itemsNormalized[6]}
                        slot={6}
                        overrides={itemOverrides}
                        updateOverrides={setItemOverrides}
                      />
                    </div>
                  </div>
                  <div className="text-gray-700 text-base mb-4">
                    Mainhand:
                    <div className="block">
                      <ItemSelect
                        item={itemsNormalized[11]}
                        slot={11}
                        overrides={itemOverrides}
                        updateOverrides={setItemOverrides}
                      />
                    </div>
                  </div>
                  <div className="text-gray-700 text-base mb-4">
                    Offhand:
                    <div className="block">
                      <ItemSelect
                        item={itemsNormalized[15]}
                        slot={15}
                        overrides={itemOverrides}
                        updateOverrides={setItemOverrides}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        {itemData && (
          <>
            <div className="flex">
              <label
                htmlFor="modelAccurate"
                className="ml-1 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                <div className="dropdown dropdown-hover">
                  Is the generated model accurate? (hover for help){" "}
                  <div className="card compact dropdown-content shadow bg-base-100 rounded-box w-64">
                    <div className="card-body">
                      <p className="font-normal">
                        If the model isn't accurate, try selecting the correct
                        appearance with the dropdowns.
                      </p>

                      <p className="font-normal text-xs">
                        You can uncheck this option and upload a screenshot
                        instead.
                      </p>

                      <p className="font-normal text-xs">
                        Unfortunately, retrieving items by ID from Blizzard's DB
                        is not one-to-one, but we get as close as we can!
                      </p>
                    </div>
                  </div>
                </div>
              </label>
              <input
                id="modelAccurate"
                type="checkbox"
                checked={modelAccurate}
                onChange={handleChecked}
                className="w-4 h-4 rounded accent-purple-500 ml-2 mt-0.5"
              />
            </div>

            <div className="flex">
              <label
                htmlFor="whiteBg"
                className="ml-1 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Background: White
              </label>
              <input
                id="whiteBg"
                type="checkbox"
                checked={modelViewerBgColor === "bg-white"}
                onChange={handleChecked}
                className="w-4 h-4 rounded accent-purple-500 ml-2 mt-0.5"
              />

              <label
                htmlFor="blackBg"
                className="ml-1 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Black
              </label>
              <input
                id="blackBg"
                type="checkbox"
                checked={modelViewerBgColor === "bg-black"}
                onChange={handleChecked}
                className="w-4 h-4 rounded accent-purple-500 ml-2 mt-0.5"
              />
            </div>
          </>
        )}
        <div className="flex items-center">
          <label htmlFor="itemChecked" className="ml-1 text-sm font-medium">
            {!itemData ? (
              <>Don't generate model using betterwardrobe</>
            ) : (
              <>Don't include item list</>
            )}
          </label>
          <input
            id="itemChecked"
            type="checkbox"
            checked={itemChecked}
            onChange={handleChecked}
            className="w-4 h-4 rounded accent-purple-500 ml-2 mt-0.5"
          />
        </div>
        {itemData && modelAccurate && (
          <div id="3dModel" className={modelViewerBgColor}></div>
        )}
        {itemData && modelAccurate && (
          <>
            <div className="flex flex-col justify-center items-center">
              <select
                id="race"
                value={race}
                onChange={handleSelect}
                className="select select-bordered w-full max-w-xs"
              >
                <option value="1">Human</option>
                <option value="2">Orc</option>
                <option value="3">Dwarf</option>
                <option value="4">Night Elf</option>
                <option value="5">Undead</option>
                <option value="6">Tauren</option>
                <option value="7">Gnome</option>
                <option value="8">Troll</option>
                <option value="10">Blood Elf</option>
                <option value="11">Draenei</option>
              </select>

              <div className="pt-4 w-full max-w-xs">
                <select
                  id="gender"
                  value={gender}
                  onChange={handleSelect}
                  className="select select-bordered w-full max-w-xs"
                >
                  <option value="0">Male</option>
                  <option value="1">Female</option>
                </select>
              </div>
            </div>
          </>
        )}
        {((!itemData && itemChecked) || (itemData && !modelAccurate)) && (
          <div className="border border-dashed border-gray-500 relative">
            <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={(e) => setImageData(e.target.files[0])}
              className="cursor-pointer relative block opacity-0 w-full h-full p-20 z-50"
            />
            <div className="text-center p-11 pt-14 absolute top-0 right-0 left-0 m-auto">
              {!imageData ? (
                <>
                  <h4>
                    Drop transmog anywhere to upload
                    <br />
                    <b>or</b>
                  </h4>
                  <p>Select transmog picture</p>
                </>
              ) : (
                <h4 className="pt-6">{imageData.name}</h4>
              )}
            </div>
          </div>
        )}
        {/* create alerts */}
        <div className="pt-5">
          <button
            type="button"
            data-mdb-ripple="true"
            data-mdb-ripple-color="light"
            className="w-full py-4 bg-purple-600 text-white font-bold text-sm font-bold rounded shadow-md hover:bg-purple-700 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple-800 active:shadow-lg transition duration-150 ease-in-out"
            onClick={handleMog}
          >
            Create Mog
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
