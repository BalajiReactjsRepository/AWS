// import React, { useMemo, useState } from "react";

// import { MdKeyboardArrowUp, MdOutlineKeyboardArrowDown } from "react-icons/md";
// import azista from "../../images/UserImages/azista.png";
// import rajstanlogo from "../../images/UserImages/Emblem_Rajasthan.png";
// import karnatakalogo from "../../images/UserImages/Emblem_Karnataka.png";
// import locationIcon from "../../images/UserImages/location-icon.png";
// import { AiOutlineSearch } from "react-icons/ai";

// import { Link } from "react-router-dom";

// import StationOverView from "../../components/StationOverView";
// import { ThreeDot } from "react-loading-indicators";
// //import { IoIosClose } from "react-icons/io";
// import "./Custom.css";
// import "./dashboard.css";
// import { useStationProfile } from "../../Context/usercontext";
// import { apiCaller } from "../../api/apihelper";
// import api from "../../api/axiosConfig";

// const Sidebar = ({ toggleSidebar, showSidebar }) => {
//   const admin_key = process.env.REACT_APP_ADMIN_KEY;

//   const { isRjProfile, isKaranataka } = useStationProfile();

//   const userData = useMemo(() => {
//     try {
//       return JSON.parse(localStorage.getItem(admin_key)) || {};
//     } catch {
//       return {};
//     }
//   }, [admin_key]);

//   const { profileDetailsList = [] } = userData || {};

//   const [profileStations, setProfileStations] = useState([]);
//   const [openDropdown, setOpenDropdown] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [searchText, setSearchText] = useState("");
//   const [searchResult, setSearchResult] = useState([]);
//   const [showSearchResult, setShowSearchResult] = useState(false);
//   const [openSearchDropdown, setOpenSearchDropdown] = useState();

//   const getProfileStations = async (id = "", searchText = "", setSearch) => {
//     if (!userData?.userId) return;

//     const formdata = new FormData();
//     formdata.append("profileId", id);
//     formdata.append("searchText", searchText);

//     apiCaller({
//       setLoading,
//       apiCall: () =>
//         api.post("/User/UserMapDashboard/GetStationsPanelList", formdata),
//       onSuccess: (result) => {
//         if (setSearch) {
//           setSearchResult(result);
//           setOpenSearchDropdown(result[0]?.profileName);
//         } else {
//           setProfileStations(result);
//           setSearchResult([]);
//         }
//       },
//     });
//   };

//   // const handleSidebar = () => {
//   //   toggleSidebar(!showSidebar);
//   // };

//   const toggleDropdown = (id) => {
//     setOpenDropdown(openDropdown === id ? "" : id);
//     if (openDropdown !== id) {
//       getProfileStations(id, "");
//     }
//   };

//   const [ProfileDetailsList, setProfileDetailsList] = useState(
//     profileDetailsList || [],
//   );

//   const getSearchStations = () => {
//     if (searchText) {
//       setShowSearchResult(true);
//       getProfileStations(0, searchText, true);
//     }
//   };

//   const onChangeSearchText = (e) => {
//     const value = e.target.value;
//     setSearchText(value);

//     if (!value) {
//       setProfileDetailsList(profileDetailsList);
//       setShowSearchResult(false);
//     }
//   };

//   const onCloseSearchResult = () => {
//     setSearchText("");
//     setShowSearchResult(false);
//     setSearchResult([]);
//   };

//   const groupByProfileName = (stations) => {
//     return stations.reduce((acc, station) => {
//       let group = acc.find((g) => g.profileName === station.profileName);
//       if (!group) {
//         group = {
//           profileName: station.profileName,
//           profileColor: station.profileColor,
//           profileIcon: station.profileIcon,
//           stations: [],
//         };
//         acc.push(group);
//       }
//       group.stations.push(station);
//       return acc;
//     }, []);
//   };

//   const renderDropdownItem = (profile, isSearch = false) => {
//     const {
//       profileName = "",
//       profileID = "",
//       totalStations = 0,
//       stations = [],
//       profileIcon,

//       profileColor,
//     } = profile;

//     const isOpen = isSearch
//       ? openSearchDropdown === profileName
//       : openDropdown === profileID;

//     const stationsList = isSearch ? stations : profileStations;
//     const stationCount = isSearch ? stations.length : totalStations;

//     const handleProfileClick = () => {
//       if (isSearch) {
//         setOpenSearchDropdown(isOpen ? "" : profileName);
//       } else {
//         toggleDropdown(profileID);
//       }
//     };

//     return (
//       <li
//         key={profileID}
//         className={`nav-item mb-3 ${
//           !isSearch && isOpen ? "active-profile-view" : ""
//         }`}
//       >
//         <button onClick={handleProfileClick} className='customDropdown'>
//           <div className='customDropdown-continer'>
//             <img
//               src={profileIcon || locationIcon}
//               alt='location'
//               className='nav-icons'
//             />
//             <p className='w-75 text-start mb-0' style={{ color: profileColor }}>
//               {profileName}
//             </p>
//             <p
//               className='profile-count ms-auto ms-1 mb-0'
//               style={{ background: profileColor || "red" }}
//             >
//               {/* {stationCount > 99 ? "99+" : stationCount} */}
//               {stationCount}
//             </p>
//           </div>
//           {isOpen ? (
//             <MdKeyboardArrowUp className='d-block' size={18} />
//           ) : (
//             <MdOutlineKeyboardArrowDown className='d-block' size={18} />
//           )}
//         </button>

//         {isOpen && (
//           <div className='subDropdown mt-2 p-2'>
//             {loading ? (
//               <div className='text-center'>
//                 <ThreeDot color='#f58142' size='small' />
//               </div>
//             ) : stationsList.length > 0 ? (
//               <StationOverView
//                 stations={stationsList}
//                 profileName={profileName}
//                 activeEffect={true}
//               />
//             ) : (
//               <div className='text-center'>
//                 <span className='text-danger'>No Data found</span>
//               </div>
//             )}
//           </div>
//         )}
//       </li>
//     );
//   };

//   /* <div className="close-icon d-md-none">
//         <IoIosClose onClick={handleSidebar} />
//       </div> */

//   const sidebarLogo = useMemo(() => {
//     if (isRjProfile) return rajstanlogo;
//     if (isKaranataka) return karnatakalogo;
//     return azista;
//   }, [isRjProfile, isKaranataka]);

//   return (
//     <>
//       <div className='logo text-center'>
//         <Link to='/'>
//           <img src={sidebarLogo} alt='logo' className='nav-logo' />
//         </Link>
//       </div>
//       <div className='search-bar'>
//         <input
//           id='search'
//           type='text'
//           value={searchText}
//           onChange={onChangeSearchText}
//           placeholder='Search Here...'
//           className='searchBar'
//         />
//         <input
//           id='search'
//           type='text'
//           value={searchText}
//           onChange={onChangeSearchText}
//           onKeyDown={(e) => {
//             if (e.key === "Enter" && searchText.trim()) {
//               getSearchStations();
//             }
//           }}
//           placeholder='Search Here...'
//           className='searchBar'
//         />
//         <span className='verticalLine'></span>
//         <AiOutlineSearch
//           onClick={() => {
//             if (searchText.length > 0) {
//               getSearchStations();
//             }
//           }}
//           size={18}
//           style={{ cursor: "pointer" }}
//         />
//       </div>
//       <hr />

//       {showSearchResult ? (
//         <>
//           <div className='d-flex justify-content-between align-items-center'>
//             Search Results
//             <span className='cors-btn' onClick={onCloseSearchResult}>
//               x
//             </span>
//           </div>

//           <div
//             className={`subDropdown mt-2 p-1 ${loading ? "text-center" : ""}`}
//           >
//             {loading ? (
//               <div className='text-center'>
//                 <ThreeDot color='#f58142' size='small' />
//               </div>
//             ) : searchResult.length > 0 ? (
//               <ul className='nav-items search-Nav-Items'>
//                 {groupByProfileName(searchResult).map((each) =>
//                   renderDropdownItem(each, true),
//                 )}
//               </ul>
//             ) : (
//               <div className='text-center'>
//                 <span className='text-danger'>No Data found</span>
//               </div>
//             )}
//           </div>
//         </>
//       ) : (
//         <ul className='nav-items'>
//           {ProfileDetailsList.map((each) => renderDropdownItem(each))}
//         </ul>
//       )}
//     </>
//   );
// };

// export default Sidebar;

import React, { useEffect, useMemo, useState } from "react";

import { MdKeyboardArrowUp, MdOutlineKeyboardArrowDown } from "react-icons/md";

import { AiOutlineSearch } from "react-icons/ai";

import { Link } from "react-router-dom";

import debounce from "lodash/debounce";

import azista from "../../images/UserImages/azista.png";
import rajstanlogo from "../../images/UserImages/Emblem_Rajasthan.png";
import karnatakalogo from "../../images/UserImages/Emblem_Karnataka.png";
import locationIcon from "../../images/UserImages/location-icon.png";

import StationOverView from "../../components/StationOverView";

import { ThreeDot } from "react-loading-indicators";

import "./Custom.css";
import "./dashboard.css";

import { useStationProfile } from "../../Context/usercontext";
import { apiCaller } from "../../api/apihelper";
import api from "../../api/axiosConfig";

const Sidebar = ({ toggleSidebar, showSidebar }) => {
  const admin_key = process.env.REACT_APP_ADMIN_KEY;

  const { isRjProfile, isKaranataka } = useStationProfile();

  const userData = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem(admin_key)) || {};
    } catch {
      return {};
    }
  }, [admin_key]);

  const { profileDetailsList = [] } = userData || {};

  const [profileStations, setProfileStations] = useState([]);
  const [openDropdown, setOpenDropdown] = useState("");
  const [loading, setLoading] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [openSearchDropdown, setOpenSearchDropdown] = useState("");

  // NEW STATES
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [ProfileDetailsList, setProfileDetailsList] = useState(
    profileDetailsList || [],
  );

  // ===============================
  // COMMON API CALL
  // ===============================

  const getProfileStations = async (
    id = "",
    searchValue = "",
    setSearch = false,
  ) => {
    if (!userData?.userId) return;

    const formdata = new FormData();

    formdata.append("profileId", id);
    formdata.append("searchText", searchValue);

    apiCaller({
      setLoading,
      apiCall: () =>
        api.post("/User/UserMapDashboard/GetStationsPanelList", formdata),

      onSuccess: (result) => {
        if (setSearch) {
          setSearchResult(result || []);
          setOpenSearchDropdown(result?.[0]?.profileName || "");
        } else {
          setProfileStations(result || []);
          setSearchResult([]);
        }
      },
    });
  };

  // ===============================
  // SEARCH SUGGESTIONS API
  // ===============================

  const fetchSuggestions = useMemo(
    () =>
      debounce(async (value) => {
        try {
          if (!value.trim()) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
          }

          const formdata = new FormData();

          formdata.append("profileId", 0);
          formdata.append("searchText", value);

          const response = await api.post(
            "/User/UserMapDashboard/GetStationsPanelList",
            formdata,
          );

          const { result } = response?.data || [];

          setSuggestions(result);
          setShowSuggestions(true);
        } catch (error) {
          console.log(error);
        }
      }, 400),
    [],
  );

  useEffect(() => {
    return () => {
      fetchSuggestions.cancel();
    };
  }, [fetchSuggestions]);

  // ===============================
  // SEARCH INPUT CHANGE
  // ===============================

  const onChangeSearchText = (e) => {
    const value = e.target.value;

    setSearchText(value);

    if (!value.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      setShowSearchResult(false);
      setProfileDetailsList(profileDetailsList);

      return;
    }

    fetchSuggestions(value);
  };

  // ===============================
  // SEARCH BUTTON / ENTER SEARCH
  // ===============================

  const getSearchStations = () => {
    if (searchText.trim()) {
      setShowSuggestions(false);
      setShowSearchResult(true);

      getProfileStations(0, searchText, true);
    }
  };

  // ===============================
  // SUGGESTION CLICK
  // ===============================

  const handleSuggestionClick = (stationName) => {
    setSearchText(stationName);

    setShowSuggestions(false);

    setShowSearchResult(true);

    getProfileStations(0, stationName, true);
  };

  // ===============================
  // CLOSE SEARCH
  // ===============================

  const onCloseSearchResult = () => {
    setSearchText("");
    setShowSearchResult(false);
    setSearchResult([]);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // ===============================
  // PROFILE DROPDOWN
  // ===============================

  const toggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? "" : id);

    if (openDropdown !== id) {
      getProfileStations(id, "");
    }
  };

  // ===============================
  // GROUP SEARCH RESULTS
  // ===============================

  const groupByProfileName = (stations) => {
    return stations.reduce((acc, station) => {
      let group = acc.find((g) => g.profileName === station.profileName);

      if (!group) {
        group = {
          profileName: station.profileName,
          profileColor: station.profileColor,
          profileIcon: station.profileIcon,
          stations: [],
        };

        acc.push(group);
      }

      group.stations.push(station);

      return acc;
    }, []);
  };

  // ===============================
  // DROPDOWN ITEM
  // ===============================

  const renderDropdownItem = (profile, isSearch = false) => {
    const {
      profileName = "",
      profileID = "",
      totalStations = 0,
      stations = [],
      profileIcon,
      profileColor,
    } = profile;

    const isOpen = isSearch
      ? openSearchDropdown === profileName
      : openDropdown === profileID;

    const stationsList = isSearch ? stations : profileStations;

    const stationCount = isSearch ? stations.length : totalStations;

    const handleProfileClick = () => {
      if (isSearch) {
        setOpenSearchDropdown(isOpen ? "" : profileName);
      } else {
        toggleDropdown(profileID);
      }
    };

    return (
      <li
        key={profileID}
        className={`nav-item mb-3 ${
          !isSearch && isOpen ? "active-profile-view" : ""
        }`}
      >
        <button onClick={handleProfileClick} className='customDropdown'>
          <div className='customDropdown-continer'>
            <img
              src={profileIcon || locationIcon}
              alt='location'
              className='nav-icons'
            />

            <p className='w-75 text-start mb-0' style={{ color: profileColor }}>
              {profileName}
            </p>

            <p
              className='profile-count ms-auto ms-1 mb-0'
              style={{ background: profileColor || "red" }}
            >
              {stationCount}
            </p>
          </div>

          {isOpen ? (
            <MdKeyboardArrowUp className='d-block' size={18} />
          ) : (
            <MdOutlineKeyboardArrowDown className='d-block' size={18} />
          )}
        </button>

        {isOpen && (
          <div className='subDropdown mt-2 p-2'>
            {loading ? (
              <div className='text-center'>
                <ThreeDot color='#f58142' size='small' />
              </div>
            ) : stationsList.length > 0 ? (
              <StationOverView
                stations={stationsList}
                profileName={profileName}
                activeEffect={true}
              />
            ) : (
              <div className='text-center'>
                <span className='text-danger'>No Data found</span>
              </div>
            )}
          </div>
        )}
      </li>
    );
  };

  // ===============================
  // LOGO
  // ===============================

  const sidebarLogo = useMemo(() => {
    if (isRjProfile) return rajstanlogo;

    if (isKaranataka) return karnatakalogo;

    return azista;
  }, [isRjProfile, isKaranataka]);

  // ===============================
  // JSX
  // ===============================

  return (
    <>
      <div className='logo text-center'>
        <Link to='/'>
          <img src={sidebarLogo} alt='logo' className='nav-logo' />
        </Link>
      </div>

      {/* SEARCH BAR */}

      <div className='search-bar position-relative'>
        <input
          id='search'
          type='text'
          value={searchText}
          onChange={onChangeSearchText}
          placeholder='Search Here...'
          className='searchBar'
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              getSearchStations();
            }
          }}
        />

        <span className='verticalLine'></span>

        <AiOutlineSearch
          onClick={getSearchStations}
          size={18}
          style={{ cursor: "pointer" }}
        />

        {/* AUTO SUGGESTIONS */}

        {showSuggestions && suggestions.length > 0 && (
          <div className='suggestionBox'>
            {suggestions.map((item, index) => (
              <div
                key={index}
                className='suggestionItem'
                onClick={() =>
                  handleSuggestionClick(
                    item?.stationName || item?.stationCode || "",
                  )
                }
              >
                {item?.stationName || item?.stationCode}
              </div>
            ))}
          </div>
        )}
      </div>

      <hr />

      {/* SEARCH RESULTS */}

      {showSearchResult ? (
        <>
          <div className='d-flex justify-content-between align-items-center'>
            Search Results
            <span className='cors-btn' onClick={onCloseSearchResult}>
              x
            </span>
          </div>

          <div
            className={`subDropdown mt-2 p-1 ${loading ? "text-center" : ""}`}
          >
            {loading ? (
              <div className='text-center'>
                <ThreeDot color='#f58142' size='small' />
              </div>
            ) : searchResult.length > 0 ? (
              <ul className='nav-items search-Nav-Items'>
                {groupByProfileName(searchResult).map((each) =>
                  renderDropdownItem(each, true),
                )}
              </ul>
            ) : (
              <div className='text-center'>
                <span className='text-danger'>No Data found</span>
              </div>
            )}
          </div>
        </>
      ) : (
        <ul className='nav-items'>
          {ProfileDetailsList.map((each) => renderDropdownItem(each))}
        </ul>
      )}
    </>
  );
};

export default Sidebar;
