import { createContext, useContext, useReducer } from "react";
import { storeInitial, masterApisReducer } from "./masterApisReducer.js";

const StoreContext = createContext();

export const MasterApisProvider = ({ children }) => {
  const [store, dispatch] = useReducer(masterApisReducer, storeInitial);

  return (
    <StoreContext.Provider value={{ store, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
