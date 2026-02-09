import { MasterApisProvider } from "./masterapis/MasterApisContext";

const MainContextProvider = ({ children }) => {
  return <MasterApisProvider>{children}</MasterApisProvider>;
};

export default MainContextProvider;
