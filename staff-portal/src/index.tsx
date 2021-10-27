import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createStore } from "redux";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App/index";
import reducer from "./store/reducer";
import config from "./config";
import "./assets/scss/style.scss";
const store = createStore(reducer);
const app = (
  <Provider store={store}>
    <BrowserRouter basename={config.basename}>
      <App />
    </BrowserRouter>
  </Provider>
);
ReactDOM.render(app, document.getElementById("root"));

