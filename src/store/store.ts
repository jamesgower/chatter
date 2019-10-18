import thunk from "redux-thunk";
import { combineReducers, compose, applyMiddleware, Store, createStore } from "redux";
import roomReducer from "../reducers/room.reducer";
import userReducer from "../reducers/user.reducer";
import { ChatterState } from "../interfaces/components.i";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default (): Store => {
  const store: Store<ChatterState> = createStore(
    combineReducers({
      room: roomReducer,
      user: userReducer,
    }),
    composeEnhancers(applyMiddleware(thunk)),
  );
  return store;
};
