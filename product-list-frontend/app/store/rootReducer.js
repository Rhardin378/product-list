import { combineReducers } from "redux";
import productReducer from "./slices/product";

const rootReducer = combineReducers({
  products: productReducer,
});

export default rootReducer;
