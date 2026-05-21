// import { useEffect, useRef, useState } from "react";

// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Popup,
//   LayersControl,
//   useMap,
//   Tooltip,
// } from "react-leaflet";

// import "leaflet/dist/leaflet.css";
// import L from "leaflet";
// import StationOverView from "./StationOverView";
// import { ThreeDot } from "react-loading-indicators";
// import { useStationProfile } from "../Context/usercontext";
// import { apiCaller } from "../api/apihelper";
// import api from "../api/axiosConfig";

// const { BaseLayer } = LayersControl;

// const ResizeHandler = () => {
//   const map = useMap();

//   useEffect(() => {
//     const handleResize = () => {
//       setTimeout(() => {
//         map.invalidateSize(true);
//       }, 300);
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, [map]);

//   return null;
// };

// // const RecenterMap = ({ center }) => {
// //   const map = useMap();

// //   useEffect(() => {
// //     if (center) {
// //       map.setView(center, map.getZoom(), { animate: true });
// //     }
// //   }, [center, map]);

// //   return null;
// // };

// const RecenterMapOnce = ({ center }) => {
//   const map = useMap();
//   const hasCentered = useRef(false);

//   useEffect(() => {
//     if (!hasCentered.current && center) {
//       map.setView(center, map.getZoom(), { animate: false });
//       hasCentered.current = true;
//     }
//   }, [center, map]);

//   return null;
// };

// const getValidCoordinates = (lat, lon) => {
//   const latitude = parseFloat(lat);
//   const longitude = parseFloat(lon);

//   return !isNaN(latitude) && !isNaN(longitude)
//     ? [latitude, longitude]
//     : [20.5937, 78.9629];
// };

// const MapEmbed = ({
//   locations = [],
//   height = "250px",
//   Zoom = 5,
//   viewSummary = false,
// }) => {
//   const [loading, setLoading] = useState(false);
//   const [activeMarker, setActiveMarker] = useState(null);
//   const [stationData, setStationData] = useState([]);
//   const mapRef = useRef(null);

//   const { setActiveStationId, setActiveProfileId } = useStationProfile();

//   const fetchStationData = async (stationId) => {
//     if (!stationId) return;
//     setActiveMarker(stationId);

//     const formData = new FormData();
//     formData.append("stationId", stationId);

//     apiCaller({
//       setLoading,
//       apiCall: () =>
//         api.post(`/User/UserMapDashboard/GetStationMapTooltip`, formData),
//       onSuccess: (result) =>
//         setStationData(result.length > 0 ? [{ ...result[0], stationId }] : []),
//     });
//   };

//   const createCustomIcon = (isActive, profileIcon, profileColor) => {
//     const color = isActive ? "#000000" : profileColor || "#2e8ff7ff";

//     const svgIcon = `
//       <svg xmlns="http://www.w3.org/2000/svg" width="25" height="41" viewBox="0 0 25 41">
//         <path fill="${color}" d="M12.5 0C5.6 0 0 5.6 0 12.5 0 22.2 12.5 41 12.5 41S25 22.2 25 12.5C25 5.6 19.4 0 12.5 0z"/>
//         <circle cx="13" cy="13" r="4" fill="white"/>
//       </svg>
//     `;

//     const svgUrl = "data:image/svg+xml;base64," + btoa(svgIcon);

//     return new L.Icon({
//       iconUrl: profileIcon || svgUrl,
//       iconSize: profileIcon ? [22, 22] : [25, 41],
//       iconAnchor: [12.5, 41],
//       popupAnchor: [0, -35],
//       // shadowUrl:
//       //   "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
//       shadowSize: [41, 41],
//     });
//   };

//   const centerCoordinates =
//     locations.length > 0
//       ? getValidCoordinates(locations[0]?.latitude, locations[0]?.longitude)
//       : [20.5937, 78.9629];

//   return (
//     <div className='map-container'>
//       <MapContainer
//         center={centerCoordinates}
//         zoom={Zoom}
//         style={{ width: "120%", height }}
//         attributionControl={true}
//         ref={mapRef}
//       >
//         {/* <RecenterMap center={centerCoordinates} /> */}
//         <ResizeHandler />
//         <RecenterMapOnce center={centerCoordinates} />
//         <LayersControl position='topleft'>
//           <BaseLayer checked name='Normal View'>
//             <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
//           </BaseLayer>
//           <BaseLayer name='Satellite View'>
//             <TileLayer url='https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}' />
//           </BaseLayer>
//         </LayersControl>
//         {locations.map((loc, i) => {
//           const [lat, lon] = getValidCoordinates(loc.latitude, loc.longitude);

//           return (
//             <Marker
//               key={loc.stationId || i}
//               position={[lat, lon]}
//               icon={createCustomIcon(
//                 activeMarker === loc.stationId,
//                 loc.profileIcon,
//                 loc.profileColor,
//               )}
//               eventHandlers={{
//                 click: () => fetchStationData(loc.stationId),
//                 ...(viewSummary && {
//                   mouseover: () => {
//                     setActiveMarker(loc.stationId);
//                     setActiveStationId(loc.stationId);
//                     setActiveProfileId(loc.profileId);
//                   },
//                   mouseout: () => {
//                     setActiveMarker(null);
//                     setActiveStationId(null);
//                     setActiveProfileId(null);
//                   },
//                 }),
//               }}
//             >
//               <Tooltip direction='top' offset={[0, -30]} opacity={1}>
//                 <span>{loc.stationName}</span>
//               </Tooltip>
//               <Popup>
//                 {loading ? (
//                   <ThreeDot color='#f58142' size='small' />
//                 ) : stationData.length > 0 ? (
//                   <StationOverView
//                     stations={stationData}
//                     viewSummary={viewSummary}
//                   />
//                 ) : (
//                   <span className='text-danger'>No Data found</span>
//                 )}
//               </Popup>
//             </Marker>
//           );
//         })}
//       </MapContainer>
//     </div>
//   );
// };

// export default MapEmbed;

import { useEffect, useRef, useState } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayersControl,
  useMap,
  Tooltip,
} from "react-leaflet";

import MarkerClusterGroup from "react-leaflet-cluster";

import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

import L from "leaflet";

import StationOverView from "./StationOverView";
import { ThreeDot } from "react-loading-indicators";
import { useStationProfile } from "../Context/usercontext";
import { apiCaller } from "../api/apihelper";
import api from "../api/axiosConfig";

const { BaseLayer } = LayersControl;

const ResizeHandler = () => {
  const map = useMap();

  useEffect(() => {
    const handleResize = () => {
      setTimeout(() => {
        map.invalidateSize(true);
      }, 300);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [map]);

  return null;
};

const FitBounds = ({ locations }) => {
  const map = useMap();

  useEffect(() => {
    if (!locations.length) return;

    const bounds = locations.map((loc) =>
      getValidCoordinates(loc.latitude, loc.longitude),
    );

    map.fitBounds(bounds, {
      padding: [50, 50],
    });
  }, [locations, map]);

  return null;
};

const getValidCoordinates = (lat, lon) => {
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);

  return !isNaN(latitude) && !isNaN(longitude)
    ? [latitude, longitude]
    : [20.5937, 78.9629];
};

const MapEmbed = ({
  locations = [],
  height = "250px",
  Zoom = 5,
  viewSummary = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [activeMarker, setActiveMarker] = useState(null);
  const [stationData, setStationData] = useState([]);

  const mapRef = useRef(null);

  const { setActiveStationId, setActiveProfileId } = useStationProfile();

  const fetchStationData = async (stationId) => {
    if (!stationId) return;

    setActiveMarker(stationId);

    const formData = new FormData();
    formData.append("stationId", stationId);

    apiCaller({
      setLoading,

      apiCall: () =>
        api.post(`/User/UserMapDashboard/GetStationMapTooltip`, formData),

      onSuccess: (result) =>
        setStationData(result.length > 0 ? [{ ...result[0], stationId }] : []),
    });
  };

  const createCustomIcon = (isActive, profileIcon, profileColor) => {
    const color = isActive ? "#000000" : profileColor || "#2e8ff7ff";

    const svgIcon = `
      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="41" viewBox="0 0 25 41">
        <path fill="${color}" d="M12.5 0C5.6 0 0 5.6 0 12.5C0 22.2 12.5 41 12.5 41S25 22.2 25 12.5C25 5.6 19.4 0 12.5 0Z"/>
        <circle cx="12.5" cy="12.5" r="4" fill="white"/>
      </svg>
    `;

    const svgUrl = "data:image/svg+xml;base64," + btoa(svgIcon);

    return new L.Icon({
      iconUrl: profileIcon || svgUrl,

      iconSize: profileIcon ? [22, 22] : [25, 41],

      iconAnchor: [12.5, 41],

      popupAnchor: [0, -35],

      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

      shadowSize: [41, 41],
    });
  };

  const centerCoordinates =
    locations.length > 0
      ? getValidCoordinates(locations[0]?.latitude, locations[0]?.longitude)
      : [20.5937, 78.9629];

  return (
    <div className='map-container'>
      <MapContainer
        center={centerCoordinates}
        zoom={Zoom}
        style={{
          width: "100%",
          height,
        }}
        attributionControl={true}
        ref={mapRef}
      >
        {/* RESIZE FIX */}
        <ResizeHandler />

        {/* AUTO FIT ALL MARKERS */}
        <FitBounds locations={locations} />

        {/* MAP LAYERS */}
        <LayersControl position='topleft'>
          <BaseLayer checked name='Normal View'>
            <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
          </BaseLayer>

          <BaseLayer name='Satellite View'>
            <TileLayer url='https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}' />
          </BaseLayer>
        </LayersControl>

        {/* CLUSTER GROUP */}
        <MarkerClusterGroup chunkedLoading>
          {locations.map((loc, i) => {
            const [lat, lon] = getValidCoordinates(loc.latitude, loc.longitude);

            return (
              <Marker
                key={loc.stationId || i}
                position={[lat, lon]}
                icon={createCustomIcon(
                  activeMarker === loc.stationId,
                  loc.profileIcon,
                  loc.profileColor,
                )}
                eventHandlers={{
                  click: () => fetchStationData(loc.stationId),

                  ...(viewSummary && {
                    mouseover: () => {
                      setActiveMarker(loc.stationId);

                      setActiveStationId(loc.stationId);

                      setActiveProfileId(loc.profileId);
                    },

                    mouseout: () => {
                      setActiveMarker(null);

                      setActiveStationId(null);

                      setActiveProfileId(null);
                    },
                  }),
                }}
              >
                <Tooltip direction='top' offset={[0, -30]} opacity={1}>
                  <span>{loc.stationName}</span>
                </Tooltip>

                <Popup>
                  {loading ? (
                    <ThreeDot color='#f58142' size='small' />
                  ) : stationData.length > 0 ? (
                    <StationOverView
                      stations={stationData}
                      viewSummary={viewSummary}
                    />
                  ) : (
                    <span className='text-danger'>No Data found</span>
                  )}
                </Popup>
              </Marker>
            );
          })}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
};

export default MapEmbed;
