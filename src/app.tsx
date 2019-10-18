import "core-js/stable";
import "regenerator-runtime/runtime";
import { Provider } from "react-redux";
import React, { FC } from "react";
import ReactDOM from "react-dom";
import Landing from "./components/Landing";
import configureStore from "./store/store";
import "./scss/styles.scss";
import "bootstrap-css-only/css/bootstrap.min.css";

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
  }
}

const store = configureStore();

const App: FC = (): JSX.Element => (
  <Provider store={store}>
    <div id="app">
      <Landing />
    </div>
  </Provider>
);

ReactDOM.render(<App />, document.getElementById("app"));
