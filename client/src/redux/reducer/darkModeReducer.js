import { HANDLE_DARK_MODE } from "../actions/actionsTypes";

const initialState = {
  dark_mode: false,
};

const darkModeReducer = (state = initialState, action) => {
  switch (action.type) {
    case HANDLE_DARK_MODE:
      return {
        ...state,
        dark_mode: action.payload,
      };
    default:
      return state;
  }
};

export default darkModeReducer;
