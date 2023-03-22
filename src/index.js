import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import OfflinePlugin from "offline-plugin/runtime";

const rootEl = document.getElementById("root");

let render = () => {
  const MainApp = require("./App").default;
  ReactDOM.render(<MainApp />, rootEl);
};

if (module.hot) {
  module.hot.accept("./App", () => {
    const NextApp = require("./App").default;
    render(<NextApp />, rootEl);
  });
}

render();
serviceWorker.unregister();

