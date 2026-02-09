import { StationProfileProvider } from "./usercontext";

const UserContextProvider = ({ children }) => {
  return <StationProfileProvider>{children}</StationProfileProvider>;
};

export default UserContextProvider;
