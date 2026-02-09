import React, { useCallback, useEffect, useMemo, useState } from "react";

import MapEmbed from "../../../components/MapEmbed";

import Widgets from "./Widgets";
import { useStationProfile } from "../../../Context/usercontext";
import { apiCaller } from "../../../api/apihelper";
import api from "../../../api/axiosConfig";

const Home = () => {
  const [locations, setLocations] = useState([]);
  const { isKaranataka } = useStationProfile();

  const getMyStations = useCallback(() => {
    apiCaller({
      apiCall: () => api.post("/User/UserMapDashboard/GetStationMapDashboard"),
      onSuccess: (result) => setLocations(result),
    });
  }, []);

  useEffect(() => {
    sessionStorage.setItem("activeStation", "");
    getMyStations();
  }, [getMyStations]);

  const height = useMemo(
    () => (isKaranataka ? "72vh" : "85vh"),
    [isKaranataka]
  );

  const zoom = useMemo(
    () => (locations.length > 16 ? 6 : 10),
    [locations.length]
  );

  return (
    <div className="mainContInfo">
      {isKaranataka && <Widgets />}

      {locations.length > 0 ? (
        <MapEmbed
          locations={locations}
          height={height}
          Zoom={zoom}
          viewSummary={true}
        />
      ) : (
        <div className="h-75 d-flex justify-content-center align-items-center">
          <h1>No Data Found</h1>
        </div>
      )}
    </div>
  );
};

export default Home;
