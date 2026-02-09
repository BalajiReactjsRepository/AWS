export const storeInitial = {
  profiles: [],
  sensors: [],
};

export function masterApisReducer(state, action) {
  switch (action.type) {
    case "SET_MASTER_DATA":
      return {
        ...state,
        profiles: action.payload.profiles,
        sensors: action.payload.sensors,
      };

    default:
      return state;
  }
}
