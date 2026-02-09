import { createContext, useContext, useState } from "react";

// Create context
const StationProfileContext = createContext();

// Provider component
export const StationProfileProvider = ({ children }) => {
  const [activeStationId, setActiveStationId] = useState(
    sessionStorage.getItem("activeStation") || ""
  );
  const [activeProfileId, setActiveProfileId] = useState(
    sessionStorage.getItem("activeprofileId") || ""
  );

  const [isRjProfile, setIsRjProfile] = useState(false);
  const [isKaranataka, setIsKaranataka] = useState(false);

  return (
    <StationProfileContext.Provider
      value={{
        activeStationId,
        setActiveStationId,
        activeProfileId,
        setActiveProfileId,
        isRjProfile,
        setIsRjProfile,
        isKaranataka,
        setIsKaranataka,
      }}
    >
      {children}
    </StationProfileContext.Provider>
  );
};

// Custom hook for easy access
export const useStationProfile = () => {
  const context = useContext(StationProfileContext);
  if (!context) {
    throw new Error(
      "useStationProfile must be used within a StationProfileProvider"
    );
  }
  return context;
};
