import { combineReducers } from "redux";
import darkModeReducer from "./darkModeReducer";
import orderProductreducer from "./orderProductreducer";
import productReducer from "./productReducer";
import systemUserReducer from "./systemUserReducer";

const rootReducer = combineReducers({
  darkMode: darkModeReducer,
  systemUser: systemUserReducer,
  product: productReducer,
  orderProduct: orderProductreducer,
});

export default rootReducer;
